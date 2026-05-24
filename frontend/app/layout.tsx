import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Morocco ERP',
  description: 'ERP SaaS conforme aux besoins des entreprises marocaines',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
