import { render, screen } from '@testing-library/react';
import NavLinks from '@/app/ui/dashboard/nav-links';

// nav-links.tsx utilise usePathname(). vi.mock est hoisté en haut du module.
vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/navigation')>();
  return { ...actual, usePathname: () => '/dashboard/invoices' };
});

describe('NavLinks', () => {
  it('rend tous les liens du dashboard', () => {
    render(<NavLinks />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /invoices/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /customers/i })).toBeInTheDocument();
  });

  it('marque le lien actif selon le pathname mocké', () => {
    render(<NavLinks />);
    expect(screen.getByRole('link', { name: /invoices/i })).toHaveClass(
      'bg-sky-100',
    );
  });
});
