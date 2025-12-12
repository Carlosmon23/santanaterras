import { create } from 'zustand';
import { Imovel, FiltrosBusca } from '../types/imovel';
import { supabase } from '@/lib/supabaseClient';
import { formatarPreco, isValidPrecoExibicao } from '@/utils/helpers';
import { obterCategoria } from '@/constants/imovelOptions';

interface ImovelStore {
  imoveis: Imovel[];
  imoveisDestaque: Imovel[];
  imoveisRecentes: Imovel[];
  imovelSelecionado: Imovel | null;
  filtros: FiltrosBusca;
  carregando: boolean;
  erro: string | null;
  setImoveis: (imoveis: Imovel[]) => void;
  setImoveisDestaque: (imoveis: Imovel[]) => void;
  setImoveisRecentes: (imoveis: Imovel[]) => void;
  setImovelSelecionado: (imovel: Imovel | null) => void;
  setFiltros: (filtros: FiltrosBusca) => void;
  setCarregando: (carregando: boolean) => void;
  setErro: (erro: string | null) => void;
  loadImoveis: () => Promise<boolean>;
  saveImovel: (imovel: Imovel) => Promise<boolean>;
  deleteImovel: (id: string) => Promise<boolean>;
  buscarImoveis: (filtros?: FiltrosBusca) => Imovel[];
  buscarImovelPorSlug: (slug: string) => Imovel | undefined;
  buscarImoveisPorTipo: (tipo: string) => Imovel[];
}

const mapRowToImovel = (row: any): Imovel => {
  const dataCriacao = row.dataCriacao ? new Date(row.dataCriacao) : new Date();
  const dataAtualizacao = row.dataAtualizacao
    ? new Date(row.dataAtualizacao)
    : dataCriacao;

  return {
    ...row,
    localizacao: row.localizacao || { cidade: '', bairro: '', estado: '' },
    caracteristicas: row.caracteristicas || { quartos: 0, suites: 0, banheiros: 0 },
    comodidades: Array.isArray(row.comodidades) ? row.comodidades : [],
    fotos: Array.isArray(row.fotos) ? row.fotos : [],
    fotoCapa: row.fotoCapa || '',
    preco: row.preco ?? null,
    precoExibicao: isValidPrecoExibicao(row.precoExibicao)
      ? row.precoExibicao 
      : formatarPreco(row.preco ?? null),
    visualizacoes: typeof row.visualizacoes === 'number' ? row.visualizacoes : 0,
    destaque: Boolean(row.destaque),
    slug: row.slug || '',
    categoria: row.categoria || obterCategoria(row.tipo), // Adicionar categoria se não existir
    dataCriacao,
    dataAtualizacao,
  };
};

const ordenarPorData = (imoveis: Imovel[]) =>
  [...imoveis].sort((a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime());

const calcularListasDerivadas = (imoveis: Imovel[]) => {
  const ordenados = ordenarPorData(imoveis);
  const publicados = ordenados.filter((i) => i.status === 'Publicado');
  const destaque = publicados.filter((i) => i.destaque);
  const recentes = publicados.slice(0, 6);
  return { ordenados, destaque, recentes };
};

export const useImovelStore = create<ImovelStore>((set, get) => ({
  imoveis: [],
  imoveisDestaque: [],
  imoveisRecentes: [],
  imovelSelecionado: null,
  filtros: {},
  carregando: false,
  erro: null,

  setImoveis: (imoveis) => set({ imoveis }),
  setImoveisDestaque: (imoveisDestaque) => set({ imoveisDestaque }),
  setImoveisRecentes: (imoveisRecentes) => set({ imoveisRecentes }),
  setImovelSelecionado: (imovelSelecionado) => set({ imovelSelecionado }),
  setFiltros: (filtros) => set({ filtros }),
  setCarregando: (carregando) => set({ carregando }),
  setErro: (erro) => set({ erro }),

  loadImoveis: async () => {
    set({ carregando: true, erro: null });
    try {
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .order('dataCriacao', { ascending: false });
      
      if (error) {
        console.error('Erro ao carregar imóveis:', error);
        set({ carregando: false, erro: error.message });
        return false;
      }
      
      const rows = (data || []).map(mapRowToImovel);
      const { ordenados, destaque, recentes } = calcularListasDerivadas(rows);
      set({
        imoveis: ordenados,
        imoveisDestaque: destaque,
        imoveisRecentes: recentes,
        carregando: false,
        erro: null,
      });
      return true;
    } catch (err: any) {
      console.error('Erro inesperado ao carregar imóveis:', err);
      set({ carregando: false, erro: err?.message || 'Erro ao carregar imóveis' });
      return false;
    }
  },

  saveImovel: async (imovel: Imovel) => {
    set({ carregando: true, erro: null });
    try {
      console.log('🔵 [saveImovel] Iniciando salvamento...', { imovelId: imovel.id, titulo: imovel.titulo });
      
      // Verificar sessão
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('🔵 [saveImovel] Sessão:', { 
        hasSession: !!sessionData.session, 
        userId: sessionData.session?.user?.id 
      });
      
      if (!sessionData.session) {
        const errorMsg = 'Você não está autenticado. Faça login novamente.';
        console.error('❌ [saveImovel]', errorMsg);
        set({ carregando: false, erro: errorMsg });
        return false;
      }
      
      const atual = get().imoveis;
      const exists = atual.some((i) => i.id === imovel.id);
      console.log('🔵 [saveImovel] Imóvel existe?', exists);
      
      // Garantir que areaTotal sempre tenha um valor válido (mínimo 0)
      const areaTotalValue = (imovel.areaTotal !== null && imovel.areaTotal !== undefined && imovel.areaTotal >= 0) 
        ? imovel.areaTotal 
        : 0;
      
      console.log('🔵 [saveImovel] areaTotal original:', imovel.areaTotal, '-> processado:', areaTotalValue);
      
      // Garantir que a categoria seja salva
      const categoria = imovel.categoria || obterCategoria(imovel.tipo);
      
      const payload: any = {
        titulo: imovel.titulo,
        tipo: imovel.tipo,
        categoria: categoria,
        status: imovel.status,
        preco: imovel.preco,
        precoExibicao: isValidPrecoExibicao(imovel.precoExibicao)
          ? imovel.precoExibicao
          : formatarPreco(imovel.preco ?? null),
        localizacao: imovel.localizacao || { cidade: '', bairro: '', estado: '' },
        areaTotal: areaTotalValue, // O Supabase vai mapear automaticamente para a coluna correta
        areaUtil: imovel.areaUtil || null,
        caracteristicas: imovel.caracteristicas || { quartos: 0, suites: 0, banheiros: 0 },
        comodidades: imovel.comodidades || [],
        descricao: imovel.descricao || '',
        fotos: imovel.fotos || [],
        fotoCapa: imovel.fotoCapa || '',
        destaque: imovel.destaque || false,
        visualizacoes: imovel.visualizacoes ?? 0,
        slug: imovel.slug,
        dataCriacao: (imovel.dataCriacao || new Date()).toISOString(),
        dataAtualizacao: new Date().toISOString(),
      };
      
      console.log('🔵 [saveImovel] Payload preparado:', payload);
      
      let response;
      if (exists) {
        console.log('🔵 [saveImovel] Atualizando imóvel existente...');
        response = await supabase
          .from('imoveis')
          .update(payload)
          .eq('id', imovel.id)
          .select()
          .single();
      } else {
        console.log('🔵 [saveImovel] Criando novo imóvel...');
        // Para novo imóvel, não incluir o id no payload
        const { id, ...newPayload } = payload;
        console.log('🔵 [saveImovel] Payload para insert:', newPayload);
        response = await supabase
          .from('imoveis')
          .insert(newPayload)
          .select()
          .single();
      }
      
      console.log('🔵 [saveImovel] Resposta completa:', {
        hasError: !!response.error,
        hasData: !!response.data,
        error: response.error,
        data: response.data
      });

      if (response.error) {
        console.error('❌ [saveImovel] Erro ao salvar imóvel:', response.error);
        console.error('❌ [saveImovel] Detalhes do erro:', {
          message: response.error.message,
          details: response.error.details,
          hint: response.error.hint,
          code: response.error.code
        });
        
        // Mensagens de erro mais específicas
        let errorMessage = response.error.message || 'Erro ao salvar imóvel';
        
        if (response.error.code === 'PGRST116') {
          errorMessage = 'Tabela não encontrada. Execute o script SQL no Supabase primeiro.';
        } else if (response.error.code === '42501') {
          errorMessage = 'Permissão negada. Verifique as políticas RLS no Supabase.';
        } else if (response.error.code === '23502') {
          const missingColumn = response.error.hint?.match(/column "([^"]+)"/)?.[1] || 'desconhecido';
          errorMessage = `Campo obrigatório faltando: ${missingColumn}. Execute o script FIX_SIMPLES.sql no Supabase.`;
        } else if (response.error.code === '42703') {
          // Coluna não existe
          const missingColumn = response.error.message.match(/column "([^"]+)" does not exist/)?.[1] || 'desconhecida';
          errorMessage = `Coluna "${missingColumn}" não existe no banco. Execute o script FIX_SIMPLES.sql no Supabase.`;
        } else if (response.error.code === '23505') {
          errorMessage = 'Já existe um imóvel com este slug. Tente alterar o título.';
        } else if (response.error.hint) {
          errorMessage = `${response.error.message} (${response.error.hint})`;
        }
        
        set({
          carregando: false,
          erro: errorMessage,
        });
        return false;
      }

      if (!response.data) {
        console.error('❌ [saveImovel] Nenhum dado retornado');
        set({
          carregando: false,
          erro: 'Nenhum dado retornado ao salvar imóvel',
        });
        return false;
      }
      
      console.log('✅ [saveImovel] Imóvel salvo com sucesso:', response.data);

      const salvo = mapRowToImovel(response.data);
      const atualizados = exists
        ? atual.map((i) => (i.id === salvo.id ? salvo : i))
        : [salvo, ...atual];
      const { ordenados, destaque, recentes } = calcularListasDerivadas(atualizados);
      set({
        imoveis: ordenados,
        imoveisDestaque: destaque,
        imoveisRecentes: recentes,
        carregando: false,
        erro: null,
      });
      return true;
    } catch (err: any) {
      console.error('Erro inesperado ao salvar imóvel:', err);
      set({
        carregando: false,
        erro: err?.message || 'Erro inesperado ao salvar imóvel',
      });
      return false;
    }
  },

  deleteImovel: async (id: string) => {
    set({ carregando: true, erro: null });
    try {
      const { error } = await supabase.from('imoveis').delete().eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar imóvel:', error);
        set({ carregando: false, erro: error.message });
        return false;
      }
      
      const restantes = get().imoveis.filter((i) => i.id !== id);
      const { ordenados, destaque, recentes } = calcularListasDerivadas(restantes);
      set({
        imoveis: ordenados,
        imoveisDestaque: destaque,
        imoveisRecentes: recentes,
        carregando: false,
        erro: null,
      });
      return true;
    } catch (err: any) {
      console.error('Erro inesperado ao deletar imóvel:', err);
      set({ carregando: false, erro: err?.message || 'Erro ao deletar imóvel' });
      return false;
    }
  },

  buscarImoveis: (filtros) => {
    const { imoveis } = get();
    let resultado = imoveis.filter((imovel) => imovel.status === 'Publicado');

    if (!filtros) return resultado;

    // Filtrar por categoria
    if (filtros.categoria && filtros.categoria.length > 0) {
      resultado = resultado.filter((imovel) => {
        const categoriaImovel = imovel.categoria || obterCategoria(imovel.tipo);
        return filtros.categoria!.includes(categoriaImovel);
      });
    }

    // Filtrar por tipo
    if (filtros.tipo && filtros.tipo.length > 0) {
      resultado = resultado.filter((imovel) => filtros.tipo!.includes(imovel.tipo));
    }

    if (filtros.cidade) {
      resultado = resultado.filter((imovel) =>
        imovel.localizacao.cidade.toLowerCase().includes(filtros.cidade!.toLowerCase())
      );
    }

    if (filtros.faixaPrecoMin !== undefined) {
      resultado = resultado.filter(
        (imovel) => imovel.preco !== null && imovel.preco >= filtros.faixaPrecoMin!
      );
    }

    if (filtros.faixaPrecoMax !== undefined) {
      resultado = resultado.filter(
        (imovel) => imovel.preco !== null && imovel.preco <= filtros.faixaPrecoMax!
      );
    }

    if (filtros.quartosMin !== undefined) {
      resultado = resultado.filter(
        (imovel) => imovel.caracteristicas.quartos >= filtros.quartosMin!
      );
    }

    if (filtros.quartosMax !== undefined) {
      resultado = resultado.filter(
        (imovel) => imovel.caracteristicas.quartos <= filtros.quartosMax!
      );
    }

    if (filtros.suitesMin !== undefined) {
      resultado = resultado.filter(
        (imovel) => imovel.caracteristicas.suites >= filtros.suitesMin!
      );
    }

    if (filtros.banheirosMin !== undefined) {
      resultado = resultado.filter(
        (imovel) => imovel.caracteristicas.banheiros >= filtros.banheirosMin!
      );
    }

    if (filtros.areaMin !== undefined) {
      resultado = resultado.filter((imovel) => imovel.areaTotal >= filtros.areaMin!);
    }

    if (filtros.areaMax !== undefined) {
      resultado = resultado.filter((imovel) => imovel.areaTotal <= filtros.areaMax!);
    }

    if (filtros.comodidades && filtros.comodidades.length > 0) {
      resultado = resultado.filter((imovel) =>
        filtros.comodidades!.every((comodidade) =>
          imovel.comodidades.includes(comodidade)
        )
      );
    }

    if (filtros.destaque !== undefined) {
      resultado = resultado.filter((imovel) => imovel.destaque === filtros.destaque);
    }

    return resultado;
  },

  buscarImovelPorSlug: (slug) => {
    const { imoveis } = get();
    return imoveis.find((imovel) => imovel.slug === slug);
  },

  buscarImoveisPorTipo: (tipo) => {
    const { imoveis } = get();
    return imoveis.filter((imovel) => imovel.tipo === tipo);
  },
}));
