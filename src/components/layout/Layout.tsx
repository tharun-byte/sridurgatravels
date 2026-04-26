import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { FloatingContactButtons } from './FloatingContactButtons';
import { SEOHead } from '@/components/SEOHead';
import { AIChatWidget } from '@/components/AIChatWidget';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead />
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <FloatingContactButtons />
      <AIChatWidget />
    </div>
  );
}
