import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatarPreco(preco: number | null | undefined): string {
  // Tratar null, undefined, NaN e valores inválidos
  if (preco === null || preco === undefined || isNaN(preco) || preco <= 0) {
    return 'Sob Consulta';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(preco);
}

/**
 * Valida se o precoExibicao é válido (não é NaN ou variações)
 */
export function isValidPrecoExibicao(precoExibicao: string | null | undefined): boolean {
  if (!precoExibicao) return false;
  const normalized = precoExibicao.trim().toLowerCase();
  return !(
    normalized === 'nan' ||
    normalized === 'r$ nan' ||
    normalized.includes('nan') ||
    normalized === 'undefined' ||
    normalized === 'null'
  );
}

import { UnidadeArea } from '@/types/imovel';

const ALQUEIRE_M2 = 24200; // Alqueire Paulista
const HECTARE_M2 = 10000;

export function formatarArea(area: number, unidade?: UnidadeArea): string {
  if (unidade === 'hectare') {
    const hectares = area / HECTARE_M2;
    // Mostrar até 4 casas decimais se necessário, removendo zeros à direita
    return `${hectares.toLocaleString('pt-BR', { maximumFractionDigits: 4 })} ha`;
  }

  if (unidade === 'alqueire') {
    const alqueires = area / ALQUEIRE_M2;
    return `${alqueires.toLocaleString('pt-BR', { maximumFractionDigits: 4 })} alqueires`;
  }

  // Comportamento padrão (m² ou fallback legado)
  if (unidade === 'm²' || !unidade) {
    // Se não tiver unidade especificada, mantém o comportamento antigo de converter para ha se for muito grande?
    // O usuário pediu "que seja hectares se eu escolhi hectares".
    // Se ele não escolheu (legado), talvez manter o auto-format?
    // Mas se ele escolheu m2 explicitamente, deve mostrar m2 mesmo que seja enorme.

    if (unidade === 'm²') {
      return `${area.toLocaleString('pt-BR')} m²`;
    }

    // Fallback para comportamento antigo (sem unidade definida)
    if (area >= 10000) {
      // Converter para hectares
      const hectares = area / 10000;
      return `${hectares.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ha`;
    }
    return `${area.toLocaleString('pt-BR')} m²`;
  }

  return `${area.toLocaleString('pt-BR')} m²`;
}

export function gerarSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-'); // Remove hífens duplicados
}

export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(data);
}

export function calcularDesconto(precoOriginal: number, precoAtual: number): number {
  return Math.round(((precoOriginal - precoAtual) / precoOriginal) * 100);
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}