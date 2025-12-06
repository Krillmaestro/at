// Layout Component - Main app layout wrapper

import Head from 'next/head';
import Navbar from './Navbar';

export default function Layout({
  children,
  title = 'AlpineVideo',
  description = 'Video analysis platform for alpine skiing',
  showNavbar = true,
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-bg-primary">
        {showNavbar && <Navbar />}
        <main className={showNavbar ? 'pt-16' : ''}>
          {children}
        </main>
      </div>
    </>
  );
}

// Page Container - Centers content with max width
export function PageContainer({ children, className = '' }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </div>
  );
}

// Page Header - Title and actions
export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
        {description && (
          <p className="mt-1 text-text-secondary">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
