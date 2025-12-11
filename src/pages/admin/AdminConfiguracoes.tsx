import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const AdminConfiguracoes: React.FC = () => {
  const [empresa, setEmpresa] = useState('Santana Terras');
  const [telefone, setTelefone] = useState('(19) 99999-9999');
  const [email, setEmail] = useState('contato@santanaterras.com.br');
  const [cidade, setCidade] = useState('São Pedro - SP');

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Configuracoes salvas com sucesso!');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSalvar} className="space-y-4">
            <Input value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Nome da empresa" />
            <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Telefone" />
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <Input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" />
            <div className="flex justify-end">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
