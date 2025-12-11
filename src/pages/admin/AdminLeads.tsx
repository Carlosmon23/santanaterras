import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, Phone, Search, Filter, Calendar } from 'lucide-react';
import { useLeadStore } from '@/stores/leadStore';

export const AdminLeads: React.FC = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('Todos');
  const { leads, loadLeads, updateLeadStatus } = useLeadStore();

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      const q = query.toLowerCase();
      const matchesQuery =
        l.nome.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.telefone.toLowerCase().includes(q) ||
        l.mensagem.toLowerCase().includes(q);
      const matchesStatus = status === 'Todos' || l.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status, leads]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="Buscar por nome, email ou mensagem"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 w-80"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              <option>Todos</option>
              <option>Novo</option>
              <option>Respondido</option>
              <option>Convertido</option>
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((l) => (
          <Card key={l.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{l.nome}</span>
                <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700">{l.status}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{l.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{l.telefone}</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" />{l.dataContato.toLocaleDateString()}</div>
                <p className="mt-2 text-gray-600">{l.mensagem}</p>
                <div className="flex items-center justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => updateLeadStatus(l.id, 'Respondido')}>Marcar como Respondido</Button>
                  <Button size="sm" onClick={() => updateLeadStatus(l.id, 'Convertido')}>Converter Lead</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
