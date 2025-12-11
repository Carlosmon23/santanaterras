import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Check, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { uploadHeroImage } from '../../utils/uploadHeroImages';

export const AdminHeroImages: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setErrors([]);
    setSuccess(null);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setErrors(['Selecione pelo menos uma imagem']);
      return;
    }

    setUploading(true);
    setErrors([]);
    setSuccess(null);
    setUploadedUrls([]);

    const urls: string[] = [];
    const uploadErrors: string[] = [];

    try {
      for (const file of Array.from(files)) {
        try {
          const url = await uploadHeroImage({
            fileName: file.name,
            file,
            folder: 'hero'
          });
          urls.push(url);
        } catch (error: any) {
          uploadErrors.push(`${file.name}: ${error.message}`);
        }
      }

      if (urls.length > 0) {
        setUploadedUrls(urls);
        setSuccess(`${urls.length} imagem(ns) enviada(s) com sucesso!`);
      }

      if (uploadErrors.length > 0) {
        setErrors(uploadErrors);
      }
    } catch (err: any) {
      setErrors([err?.message || 'Erro ao fazer upload']);
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
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Imagens do Hero</h1>
          <p className="text-gray-600 mt-2">
            Faça upload das imagens que aparecem na home e na página de busca. 
            As imagens serão comprimidas automaticamente.
          </p>
        </div>

        {/* Upload Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Fazer Upload de Imagens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione as imagens (máximo 10MB cada)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesSelected}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
              />
              {files && (
                <div className="mt-2 text-sm text-gray-600">
                  {Array.from(files).length} arquivo(s) selecionado(s)
                </div>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={!files || uploading}
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
        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium">{success}</p>
                  {uploadedUrls.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-green-700">URLs das imagens:</p>
                      {uploadedUrls.map((url, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-green-200">
                          <code className="text-xs text-gray-700 break-all">{url}</code>
                          <button
                            onClick={() => navigator.clipboard.writeText(url)}
                            className="ml-2 text-xs text-green-600 hover:text-green-700"
                          >
                            Copiar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <X className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium mb-2">Erros:</p>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
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
            <p>• As imagens serão comprimidas automaticamente para economizar espaço</p>
            <p>• Tamanho máximo antes da compressão: 10MB</p>
            <p>• Tamanho após compressão: ~800KB cada</p>
            <p>• Dimensão máxima: 2560px (mantém proporção)</p>
            <p>• Formato recomendado: JPG ou PNG</p>
            <p>• Após o upload, copie as URLs e atualize o código das páginas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

