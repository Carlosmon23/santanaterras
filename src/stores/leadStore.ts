import { create } from 'zustand';
import { ContatoLead } from '@/types/imovel';
import { supabase } from '@/lib/supabaseClient';

interface LeadStore {
  leads: ContatoLead[];
  carregando: boolean;
  erro: string | null;
  loadLeads: () => Promise<void>;
  addLead: (lead: Omit<ContatoLead, 'id' | 'dataContato' | 'status'> & { status?: ContatoLead['status'] }) => Promise<void>;
  updateLeadStatus: (id: string, status: ContatoLead['status']) => Promise<void>;
}

export const useLeadStore = create<LeadStore>((set, get) => ({
  leads: [],
  carregando: false,
  erro: null,

  loadLeads: async () => {
    set({ carregando: true, erro: null });
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('dataContato', { ascending: false });
      
      if (error) {
        console.error('Erro ao carregar leads:', error);
        set({ carregando: false, erro: error.message });
        return;
      }
      
      const rows = (data || []).map((r: any) => ({
        ...r,
        dataContato: r.dataContato ? new Date(r.dataContato) : new Date(),
      })) as ContatoLead[];
      set({ leads: rows, carregando: false });
    } catch (err: any) {
      console.error('Erro inesperado ao carregar leads:', err);
      set({ carregando: false, erro: err?.message || 'Erro ao carregar leads' });
    }
  },

  addLead: async (lead) => {
    set({ carregando: true, erro: null });
    try {
      const payload: any = {
        nome: lead.nome,
        email: lead.email,
        telefone: lead.telefone,
        mensagem: lead.mensagem,
        imovelId: lead.imovelId || null,
        tipoInteresse: lead.tipoInteresse,
        status: lead.status || 'Novo',
        dataContato: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('leads')
        .insert(payload)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao adicionar lead:', error);
        set({ carregando: false, erro: error.message });
        return;
      }
      
      if (!data) {
        set({ carregando: false, erro: 'Nenhum dado retornado ao adicionar lead' });
        return;
      }
      
      const saved: ContatoLead = { 
        ...data, 
        dataContato: data.dataContato ? new Date(data.dataContato) : new Date() 
      };
      set({ leads: [saved, ...get().leads], carregando: false });
    } catch (err: any) {
      console.error('Erro inesperado ao adicionar lead:', err);
      set({ carregando: false, erro: err?.message || 'Erro ao adicionar lead' });
    }
  },

  updateLeadStatus: async (id, status) => {
    set({ carregando: true, erro: null });
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao atualizar status do lead:', error);
        set({ carregando: false, erro: error.message });
        return;
      }
      
      set({
        leads: get().leads.map(l => (l.id === id ? { ...l, status } : l)),
        carregando: false,
      });
    } catch (err: any) {
      console.error('Erro inesperado ao atualizar status do lead:', err);
      set({ carregando: false, erro: err?.message || 'Erro ao atualizar status do lead' });
    }
  },
}));
