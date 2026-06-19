import { formatCurrency } from '@/app/lib/utils';

describe('formatCurrency', () => {
  it('formate des cents en chaîne USD', () => {
    expect(formatCurrency(2500)).toBe('$25.00');
  });

  it('gère zéro', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('ajoute les séparateurs de milliers et gère les sous-dollars', () => {
    expect(formatCurrency(99)).toBe('$0.99');
    expect(formatCurrency(123456)).toBe('$1,234.56');
  });
});
