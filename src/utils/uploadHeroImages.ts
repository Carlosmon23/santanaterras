/**
 * Utilitário para fazer upload e compressão de imagens do hero
 * Use este script para fazer upload das imagens de hero da home e busca
 */

import { supabase } from '@/lib/supabaseClient';
import { compressImage, getImageInfo } from './imageCompression';

export interface UploadHeroImageOptions {
  fileName: string;
  file: File;
  folder?: string; // Pasta no storage (padrão: 'hero')
}

/**
 * Faz upload de uma imagem do hero com compressão
 */
export async function uploadHeroImage({
  fileName,
  file,
  folder = 'hero'
}: UploadHeroImageOptions): Promise<string> {
  try {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      throw new Error('Arquivo deve ser uma imagem');
    }

    // Comprimir imagem
    console.log(`📸 Comprimindo ${fileName}...`);
    const originalSize = getImageInfo(file);
    
    const compressedFile = await compressImage(file, {
      maxSizeMB: 0.8, // Máximo 800KB para imagens de hero (são grandes)
      maxWidthOrHeight: 2560, // Máximo 2560px (alta qualidade para hero)
      useWebWorker: true,
      quality: 0.9 // Alta qualidade para imagens de hero
    });

    const compressedSize = getImageInfo(compressedFile);
    const reduction = ((1 - compressedSize.sizeMB / originalSize.sizeMB) * 100).toFixed(1);
    console.log(`✅ ${fileName} comprimida: ${originalSize.sizeMB.toFixed(2)}MB → ${compressedSize.sizeMB.toFixed(2)}MB (${reduction}% menor)`);

    // Fazer upload
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${folder}/${sanitizedFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('imoveis')
      .upload(path, compressedFile, {
        upsert: true,
        cacheControl: '3600',
      });

    if (uploadError) {
      throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('imoveis')
      .getPublicUrl(path);

    if (!urlData?.publicUrl) {
      throw new Error('Não foi possível obter URL pública da imagem');
    }

    console.log(`✅ Upload concluído: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (error: any) {
    console.error(`❌ Erro ao fazer upload de ${fileName}:`, error);
    throw error;
  }
}

/**
 * Faz upload de múltiplas imagens do hero
 */
export async function uploadHeroImages(
  files: { name: string; file: File }[],
  folder = 'hero'
): Promise<string[]> {
  const urls: string[] = [];
  const errors: string[] = [];

  for (const { name, file } of files) {
    try {
      const url = await uploadHeroImage({ fileName: name, file, folder });
      urls.push(url);
    } catch (error: any) {
      errors.push(`${name}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    console.warn('⚠️ Alguns uploads falharam:', errors);
  }

  return urls;
}


