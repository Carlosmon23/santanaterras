import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Check, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import { compressImage, getImageInfo } from '../../utils/imageCompression';

export const AdminLogo: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Selecione uma imagem');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem');
      }

      // Comprimir logo (logos podem ser menores)
      console.log(`📸 Comprimindo logo...`);
      const originalSize = getImageInfo(file);
      
      const compressedFile = await compressImage(file, {
        maxSizeMB: 0.3, // Máximo 300KB para logo
        maxWidthOrHeight: 400, // Logo não precisa ser muito grande
        useWebWorker: true,
        quality: 0.9 // Alta qualidade para logo
      });

      const compressedSize = getImageInfo(compressedFile);
      const reduction = ((1 - compressedSize.sizeMB / originalSize.sizeMB) * 100).toFixed(1);
      console.log(`✅ Logo comprimida: ${originalSize.sizeMB.toFixed(2)}MB → ${compressedSize.sizeMB.toFixed(2)}MB (${reduction}% menor)`);

      // Fazer upload para o Supabase Storage
      const fileName = 'logo-santana-terras.png';
      const path = `public/${fileName}`;

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
        throw new Error('Não foi possível obter URL pública da logo');
      }

      setUploadedUrl(urlData.publicUrl);
      setSuccess('Logo enviada com sucesso!');
      console.log(`✅ Upload concluído: ${urlData.publicUrl}`);
    } catch (err: any) {
      console.error(`❌ Erro ao fazer upload da logo:`, err);
      setError(err?.message || 'Falha ao fazer upload da logo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Logo</h1>
          <p className="text-gray-600 mt-2">
            Faça upload da nova logo do site. A logo será comprimida automaticamente.
          </p>
        </div>

        {/* Upload Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Fazer Upload da Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione a imagem da logo (PNG, JPG ou SVG recomendado)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelected}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
              />
              {file && (
                <div className="mt-2 text-sm text-gray-600">
                  Arquivo selecionado: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Fazer Upload e Comprimir
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Success Message */}
        {success && uploadedUrl && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-800 font-medium mb-4">{success}</p>
                  <div className="bg-white p-4 rounded border border-green-200">
                    <p className="text-sm font-medium text-green-700 mb-2">URL da logo:</p>
                    <code className="text-xs text-gray-700 break-all block mb-2">{uploadedUrl}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(uploadedUrl)}
                      className="text-xs text-green-600 hover:text-green-700 underline"
                    >
                      Copiar URL
                    </button>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded border border-green-200">
                    <p className="text-sm font-medium text-green-700 mb-2">Próximos passos:</p>
                    <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                      <li>Copie a URL acima</li>
                      <li>Abra o arquivo <code className="bg-gray-100 px-1 rounded">src/config/logo.ts</code></li>
                      <li>Cole a URL no campo <code className="bg-gray-100 px-1 rounded">logoUrl</code></li>
                      <li>Salve o arquivo</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <X className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Erro:</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instruções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>• A logo será comprimida automaticamente para economizar espaço</p>
            <p>• Tamanho máximo antes da compressão: 5MB</p>
            <p>• Tamanho após compressão: ~300KB</p>
            <p>• Dimensão máxima: 400px (mantém proporção)</p>
            <p>• Formato recomendado: PNG com fundo transparente ou JPG</p>
            <p>• Após o upload, atualize o arquivo de configuração com a URL retornada</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

