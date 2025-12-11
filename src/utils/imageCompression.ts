/**
 * Utilitário para compressão de imagens antes do upload
 * Reduz o tamanho do arquivo mantendo qualidade visual aceitável
 */

export interface CompressionOptions {
  maxSizeMB?: number; // Tamanho máximo em MB (padrão: 1MB)
  maxWidthOrHeight?: number; // Dimensão máxima (padrão: 1920px)
  useWebWorker?: boolean; // Usar Web Worker para não travar a UI
  quality?: number; // Qualidade da compressão 0-1 (padrão: 0.8)
}

/**
 * Comprime uma imagem usando Canvas API
 * Fallback caso browser-image-compression não esteja disponível
 */
async function compressImageFallback(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxSizeMB = 1,
    maxWidthOrHeight = 1920,
    quality = 0.8
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calcular novas dimensões mantendo proporção
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
          if (width > height) {
            height = (height * maxWidthOrHeight) / width;
            width = maxWidthOrHeight;
          } else {
            width = (width * maxWidthOrHeight) / height;
            height = maxWidthOrHeight;
          }
        }
        
        // Criar canvas e redimensionar
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converter para blob com compressão
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha ao comprimir imagem'));
              return;
            }
            
            // Se ainda estiver muito grande, reduzir qualidade
            if (blob.size > maxSizeMB * 1024 * 1024) {
              canvas.toBlob(
                (smallerBlob) => {
                  if (!smallerBlob) {
                    resolve(new File([blob], file.name, { type: file.type }));
                    return;
                  }
                  resolve(new File([smallerBlob], file.name, { type: file.type }));
                },
                file.type,
                quality * 0.7 // Reduzir mais a qualidade
              );
            } else {
              resolve(new File([blob], file.name, { type: file.type }));
            }
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}

/**
 * Comprime uma imagem usando browser-image-compression se disponível,
 * caso contrário usa fallback com Canvas API
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxSizeMB = 1,
    maxWidthOrHeight = 1920,
    useWebWorker = true,
    quality = 0.8
  } = options;

  // Usar browser-image-compression
  try {
    const imageCompression = await import('browser-image-compression');
    
    const compressionOptions = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker,
      fileType: file.type,
      initialQuality: quality,
    };
    
    // A biblioteca pode exportar como default ou named export
    const compressFn = imageCompression.default || imageCompression;
    const compressedFile = await compressFn(file, compressionOptions);
    
    return compressedFile;
  } catch (error) {
    // Se browser-image-compression não estiver disponível, usar fallback
    console.warn('⚠️ browser-image-compression não disponível, usando compressão nativa', error);
    return compressImageFallback(file, options);
  }
}

/**
 * Comprime múltiplas imagens
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<File[]> {
  const compressedFiles = await Promise.all(
    files.map(file => compressImage(file, options))
  );
  
  return compressedFiles;
}

/**
 * Obtém informações sobre o tamanho da imagem
 */
export function getImageInfo(file: File): { sizeMB: number; sizeKB: number } {
  return {
    sizeMB: file.size / 1024 / 1024,
    sizeKB: file.size / 1024,
  };
}

