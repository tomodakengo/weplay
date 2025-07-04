import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  currentPage?: 'home' | 'games' | 'create' | 'login' | 'register';
  showHeader?: boolean;
  className?: string;
}

export default function Layout({ 
  children, 
  currentPage, 
  showHeader = true,
  className = 'min-h-screen bg-gray-50'
}: LayoutProps) {
  return (
    <div className={className}>
      {showHeader && <Header currentPage={currentPage} />}
      <main>
        {children}
      </main>
    </div>
  );
}