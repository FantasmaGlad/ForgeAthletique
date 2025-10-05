/**
 * MainLayout - Structure principale de l'application
 * Layout type "cockpit" avec sidebar persistante
 */

import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Zone principale */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title={title} subtitle={subtitle} />

        {/* Contenu scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
