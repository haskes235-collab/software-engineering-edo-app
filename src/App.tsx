import { useState, useEffect } from 'react';
import { DocumentsPage } from './renderer/pages/DocumentsPage';
import { DocumentDetailPage } from './renderer/pages/DocumentDetailPage';
import './App.css';

function App() {
  const [route, setRoute] = useState<{ type: 'list' } | { type: 'detail'; id: string }>({ type: 'list' });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('#/document/')) {
        const id = hash.replace('#/document/', '');
        setRoute({ type: 'detail', id });
      } else {
        setRoute({ type: 'list' });
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app">
      {route.type === 'list' && <DocumentsPage />}
      {route.type === 'detail' && <DocumentDetailPage documentId={route.id} />}
    </div>
  );
}

export default App;