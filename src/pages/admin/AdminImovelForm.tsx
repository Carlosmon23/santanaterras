import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X,
  Plus,
  Trash2,
  MapPin,
  Home,
  DollarSign,
  Bed,
  Bath,
  Square,
  Star
} from 'lucide-react';
import { Imovel, TipoImovel, StatusImovel, Comodidade } from '../../types/imovel';
import { useImovelStore } from '../../stores/imovelStore';
import { supabase } from '@/lib/supabaseClient';
import { formatarPreco, gerarSlug } from '../../utils/helpers';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { tiposImovel, comodidadesDisponiveis, categoriasImovel, tiposPorCategoria, obterCategoria } from '@/constants/imovelOptions';
import { CategoriaImovel } from '@/types/imovel';
import { compressImage, getImageInfo } from '../../utils/imageCompression';

export const AdminImovelForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { imoveis, saveImovel, loadImoveis, erro: erroStore } = useImovelStore();
  
  const isEditing = !!id;
  const imovelExistente = id ? imoveis.find(i => i.id === id) : null;
  
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaImovel>('Rural');
  const [tiposDisponiveis, setTiposDisponiveis] = useState<TipoImovel[]>(tiposPorCategoria.Rural);
  
  const [formData, setFormData] = useState<Partial<Imovel>>({
    titulo: '',
    tipo: 'Sítio',
    categoria: 'Rural',
    status: 'Rascunho',
    preco: null,
    precoExibicao: 'Sob Consulta',
    localizacao: {
      cidade: '',
      bairro: '',
      estado: 'SP'
    },
    areaTotal: 0,
    caracteristicas: {
      quartos: 0,
      suites: 0,
      banheiros: 0,
      vagasGaragem: 0,
      salaEstar: false,
      salaJantar: false,
      cozinha: false,
      lavanderia: false
    },
    comodidades: [],
    descricao: '',
    fotos: [],
    fotoCapa: '',
    destaque: false,
    visualizacoes: 0,
    slug: ''
  });
  
  const [newPhoto, setNewPhoto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  
  // Monitorar erros do store
  useEffect(() => {
    if (erroStore) {
      console.log('🔴 [AdminImovelForm] Erro do store detectado:', erroStore);
      setSubmitError(erroStore);
    }
  }, [erroStore]);
  
  useEffect(() => {
    if (imovelExistente) {
      setFormData(imovelExistente);
      const categoria = imovelExistente.categoria || obterCategoria(imovelExistente.tipo);
      setCategoriaSelecionada(categoria);
      setTiposDisponiveis(tiposPorCategoria[categoria]);
    }
  }, [imovelExistente]);
  
  // Atualizar tipos disponíveis quando categoria mudar
  useEffect(() => {
    setTiposDisponiveis(tiposPorCategoria[categoriaSelecionada]);
    // Selecionar o primeiro tipo da categoria
    if (tiposPorCategoria[categoriaSelecionada].length > 0) {
      setFormData(prev => ({
        ...prev,
        tipo: tiposPorCategoria[categoriaSelecionada][0],
        categoria: categoriaSelecionada
      }));
    }
  }, [categoriaSelecionada]);

  useEffect(() => {
    if (isEditing && !imovelExistente) {
      loadImoveis();
    }
  }, [isEditing, imovelExistente, loadImoveis]);
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleLocalizacaoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      localizacao: {
        ...prev.localizacao!,
        [field]: value
      }
    }));
  };
  
  const handleCaracteristicaChange = (field: string, value: number | boolean) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: {
        ...prev.caracteristicas!,
        [field]: value
      }
    }));
  };
  
  const handlePrecoChange = (value: string) => {
    if (value === '') {
      setFormData(prev => ({
        ...prev,
        preco: null,
        precoExibicao: 'Sob Consulta'
      }));
    } else {
      const preco = parseFloat(value.replace(/[^\d]/g, ''));
      setFormData(prev => ({
        ...prev,
        preco,
        precoExibicao: formatarPreco(preco)
      }));
    }
  };
  
  const handleComodidadeToggle = (comodidade: Comodidade) => {
    setFormData(prev => ({
      ...prev,
      comodidades: prev.comodidades?.includes(comodidade)
        ? prev.comodidades.filter(c => c !== comodidade)
        : [...(prev.comodidades || []), comodidade]
    }));
  };
  
  const addPhoto = () => {
    if (newPhoto.trim()) {
      setFormData(prev => ({
        ...prev,
        fotos: [...(prev.fotos || []), newPhoto.trim()]
      }));
      setNewPhoto('');
    }
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const uploadSelectedFiles = async () => {
    if (!files || !formData.titulo) {
      setUploadError('Selecione arquivos e preencha o título do imóvel');
      return;
    }
    
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    
    try {
      const slug = gerarSlug(formData.titulo);
      const bucket = 'imoveis';
      const urls: string[] = [];
      const errors: string[] = [];
      const compressionStats: string[] = [];
      
      for (const file of Array.from(files)) {
        try {
          // Validar tipo de arquivo
          if (!file.type.startsWith('image/')) {
            errors.push(`${file.name}: não é uma imagem válida`);
            continue;
          }
          
          // Validar tamanho original (máximo 10MB antes da compressão)
          if (file.size > 10 * 1024 * 1024) {
            errors.push(`${file.name}: arquivo muito grande (máximo 10MB)`);
            continue;
          }
          
          // Comprimir imagem antes do upload
          const originalSize = getImageInfo(file);
          console.log(`📸 Comprimindo ${file.name}... (${originalSize.sizeMB.toFixed(2)}MB)`);
          
          const compressedFile = await compressImage(file, {
            maxSizeMB: 1, // Máximo 1MB após compressão
            maxWidthOrHeight: 1920, // Máximo 1920px na maior dimensão
            useWebWorker: true,
            quality: 0.85 // Qualidade 85% (boa qualidade visual)
          });
          
          const compressedSize = getImageInfo(compressedFile);
          const reduction = ((1 - compressedSize.sizeMB / originalSize.sizeMB) * 100).toFixed(1);
          compressionStats.push(`${file.name}: ${originalSize.sizeMB.toFixed(2)}MB → ${compressedSize.sizeMB.toFixed(2)}MB (${reduction}% menor)`);
          
          console.log(`✅ ${file.name} comprimida: ${originalSize.sizeMB.toFixed(2)}MB → ${compressedSize.sizeMB.toFixed(2)}MB (${reduction}% menor)`);
          
          const fileName = `${Date.now()}-${compressedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const path = `${slug}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(path, compressedFile, { 
              upsert: true,
              cacheControl: '3600',
            });
          
          if (uploadError) {
            console.error(`Erro ao fazer upload de ${file.name}:`, uploadError);
            errors.push(`${file.name}: ${uploadError.message}`);
            continue;
          }
          
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
          
          if (urlData?.publicUrl) {
            urls.push(urlData.publicUrl);
          }
        } catch (fileError: any) {
          console.error(`Erro ao processar ${file.name}:`, fileError);
          errors.push(`${file.name}: ${fileError.message || 'Erro desconhecido'}`);
        }
      }
      
      if (urls.length > 0) {
        setFormData(prev => ({ 
          ...prev, 
          fotos: [...(prev.fotos || []), ...urls], 
          fotoCapa: prev.fotoCapa || urls[0] 
        }));
        
        const successMsg = `${urls.length} foto(s) enviada(s) com sucesso!`;
        const compressionMsg = compressionStats.length > 0 
          ? `\n\n📊 Compressão: ${compressionStats.join('\n')}`
          : '';
        const errorMsg = errors.length > 0 ? `\n\n⚠️ ${errors.length} erro(s): ${errors.join('; ')}` : '';
        
        setUploadSuccess(successMsg + compressionMsg + errorMsg);
      } else if (errors.length > 0) {
        setUploadError(`Falha ao fazer upload: ${errors.join('; ')}`);
      } else {
        setUploadError('Nenhuma foto foi enviada');
      }
      
      setFiles(null);
    } catch (err: any) {
      console.error('Erro inesperado no upload:', err);
      setUploadError(err?.message || 'Falha ao fazer upload das fotos');
    } finally {
      setUploading(false);
    }
  };
  
  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos?.filter((_, i) => i !== index) || []
    }));
  };
  
  const setCapaPhoto = (photo: string) => {
    setFormData(prev => ({
      ...prev,
      fotoCapa: photo
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Validações básicas
      if (!formData.titulo || formData.titulo.trim() === '') {
        setSubmitError('O título do imóvel é obrigatório.');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.descricao || formData.descricao.trim() === '') {
        setSubmitError('A descrição do imóvel é obrigatória.');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.areaTotal || formData.areaTotal <= 0) {
        setSubmitError('A área total do imóvel é obrigatória e deve ser maior que zero.');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.localizacao?.cidade || formData.localizacao.cidade.trim() === '') {
        setSubmitError('A cidade é obrigatória.');
        setIsSubmitting(false);
        return;
      }
      
      const slug = gerarSlug(formData.titulo || '');
      const now = new Date();
      const generatedId = isEditing
        ? id!
        : typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `imovel-${Date.now()}`;
      
      // Garantir que areaTotal sempre tenha um valor válido
      const areaTotalValue = formData.areaTotal && formData.areaTotal > 0 ? formData.areaTotal : 0;
      
      const categoriaFinal = formData.categoria || categoriaSelecionada || obterCategoria(formData.tipo || 'Casa');
      
      const imovelData: Imovel = {
        ...formData as Imovel,
        id: generatedId,
        slug,
        categoria: categoriaFinal,
        dataCriacao: isEditing ? formData.dataCriacao || now : now,
        dataAtualizacao: now,
        visualizacoes: formData.visualizacoes ?? 0,
        comodidades: formData.comodidades || [],
        fotos: formData.fotos || [],
        fotoCapa: formData.fotoCapa || (formData.fotos?.[0] || ''),
        precoExibicao: formData.precoExibicao || formatarPreco(formData.preco ?? null),
        descricao: formData.descricao || '',
        areaTotal: areaTotalValue,
      };
      
      console.log('🔵 [AdminImovelForm] areaTotal value:', areaTotalValue);
      
      console.log('🔵 [AdminImovelForm] Chamando saveImovel...', imovelData);
      const ok = await saveImovel(imovelData);
      console.log('🔵 [AdminImovelForm] Resultado do saveImovel:', { ok, erroStore });
      
      if (ok) {
        console.log('✅ [AdminImovelForm] Salvamento bem-sucedido, redirecionando...');
        navigate('/admin/imoveis');
      } else {
        // A mensagem de erro específica virá do store
        const errorMsg = erroStore || 'Erro ao salvar imóvel. Verifique seus dados ou a conexão com o banco.';
        console.error('❌ [AdminImovelForm] Erro ao salvar:', errorMsg);
        setSubmitError(errorMsg);
      }
    } catch (error: any) {
      console.error('Erro ao salvar imóvel:', error);
      setSubmitError(error?.message || 'Erro inesperado ao salvar o imóvel. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/imoveis')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Imóvel' : 'Novo Imóvel'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Atualize as informações do imóvel' : 'Adicione um novo imóvel ao catálogo'}
            </p>
          </div>
        </div>
        
        <Button
          type="submit"
          form="imovel-form"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isEditing ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>
      
      {/* Form */}
      <form id="imovel-form" onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {submitError}
          </div>
        )}
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Título do Imóvel"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                required
                placeholder="Ex: Sítio com 20.000m² - Vista Panorâmica"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={categoriaSelecionada}
                  onChange={(e) => {
                    const novaCategoria = e.target.value as CategoriaImovel;
                    setCategoriaSelecionada(novaCategoria);
                    setFormData(prev => ({
                      ...prev,
                      categoria: novaCategoria
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {categoriasImovel.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Imóvel
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value as TipoImovel)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {tiposDisponiveis.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as StatusImovel)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="Rascunho">Rascunho</option>
                  <option value="Publicado">Publicado</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (deixe vazio para "Sob Consulta")
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.preco ? formData.preco.toLocaleString('pt-BR') : ''}
                    onChange={(e) => handlePrecoChange(e.target.value)}
                    placeholder="Sob Consulta"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  label="Cidade"
                  value={formData.localizacao?.cidade || ''}
                  onChange={(e) => handleLocalizacaoChange('cidade', e.target.value)}
                  required
                  className="pl-10"
                  placeholder="Ex: São Pedro"
                />
              </div>
              
              <Input
                label="Bairro"
                value={formData.localizacao?.bairro || ''}
                onChange={(e) => handleLocalizacaoChange('bairro', e.target.value)}
                required
                placeholder="Ex: Zona Rural"
              />
              
              <Input
                label="Estado"
                value={formData.localizacao?.estado || ''}
                onChange={(e) => handleLocalizacaoChange('estado', e.target.value)}
                required
                placeholder="Ex: SP"
                maxLength={2}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Characteristics */}
        <Card>
          <CardHeader>
            <CardTitle>Características</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative">
                <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  label="Quartos"
                  type="number"
                  value={formData.caracteristicas?.quartos || 0}
                  onChange={(e) => handleCaracteristicaChange('quartos', parseInt(e.target.value) || 0)}
                  className="pl-10"
                  min="0"
                />
              </div>
              
              <div className="relative">
                <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  label="Suítes"
                  type="number"
                  value={formData.caracteristicas?.suites || 0}
                  onChange={(e) => handleCaracteristicaChange('suites', parseInt(e.target.value) || 0)}
                  className="pl-10"
                  min="0"
                />
              </div>
              
              <div className="relative">
                <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  label="Banheiros"
                  type="number"
                  value={formData.caracteristicas?.banheiros || 0}
                  onChange={(e) => handleCaracteristicaChange('banheiros', parseInt(e.target.value) || 0)}
                  className="pl-10"
                  min="0"
                />
              </div>
              
              <Input
                label="Vagas de Garagem"
                type="number"
                value={formData.caracteristicas?.vagasGaragem || 0}
                onChange={(e) => handleCaracteristicaChange('vagasGaragem', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.caracteristicas?.salaEstar || false}
                  onChange={(e) => handleCaracteristicaChange('salaEstar', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm font-medium text-gray-700">Sala de Estar</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.caracteristicas?.salaJantar || false}
                  onChange={(e) => handleCaracteristicaChange('salaJantar', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm font-medium text-gray-700">Sala de Jantar</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.caracteristicas?.cozinha || false}
                  onChange={(e) => handleCaracteristicaChange('cozinha', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm font-medium text-gray-700">Cozinha</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.caracteristicas?.lavanderia || false}
                  onChange={(e) => handleCaracteristicaChange('lavanderia', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm font-medium text-gray-700">Lavanderia</label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  label="Área Total (m²)"
                  type="number"
                  value={formData.areaTotal || 0}
                  onChange={(e) => handleInputChange('areaTotal', parseInt(e.target.value) || 0)}
                  className="pl-10"
                  min="0"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  checked={formData.destaque || false}
                  onChange={(e) => handleInputChange('destaque', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Destaque na página inicial
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Comodidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {comodidadesDisponiveis.map(comodidade => (
                <div key={comodidade} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.comodidades?.includes(comodidade) || false}
                    onChange={() => handleComodidadeToggle(comodidade)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    {comodidade}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Descrição Detalhada</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.descricao || ''}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Descreva os detalhes do imóvel, localização, características especiais, etc..."
              required
            />
          </CardContent>
        </Card>
        
        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle>Fotos do Imóvel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(uploadError || uploadSuccess) && (
              <div className={`px-4 py-3 rounded-lg border ${uploadError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                {uploadError || uploadSuccess}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input type="file" multiple onChange={handleFilesSelected} />
              <Button type="button" onClick={uploadSelectedFiles} disabled={uploading || !files}>
                {uploading ? 'Enviando...' : 'Enviar Fotos'}
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="URL da foto"
                value={newPhoto}
                onChange={(e) => setNewPhoto(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addPhoto}
                disabled={!newPhoto.trim()}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
            
            {formData.fotos && formData.fotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.fotos.map((foto, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCapaPhoto(foto)}
                          className={`p-2 rounded-lg ${
                            formData.fotoCapa === foto 
                              ? 'bg-red-600 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                          title={formData.fotoCapa === foto ? 'Foto de capa' : 'Definir como capa'}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          title="Remover foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {formData.fotos && formData.fotos.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Nenhuma foto adicionada ainda</p>
                <p className="text-sm text-gray-500">Adicione URLs de fotos do imóvel</p>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
