import { useEffect, useState } from 'react';
import { DocumentsPage } from './renderer/pages/DocumentsPage';
import { DocumentDetailPage } from './renderer/pages/DocumentDetailPage';
import './App.css';

type Route = { type: 'list' } | { type: 'detail'; id: string };

function parseRoute(hash: string): Route {
  const normalizedHash = hash.replace(/^#/, '');
  if (normalizedHash.startsWith('/document/')) {
    return { type: 'detail', id: normalizedHash.replace('/document/', '') };
  }
  return { type: 'list' };
}

function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app-shell">
      <div className="app-shell__glow app-shell__glow--left" />
      <div className="app-shell__glow app-shell__glow--right" />
      <main className="app-main">
        {route.type === 'list' && <DocumentsPage />}
        {route.type === 'detail' && <DocumentDetailPage documentId={route.id} />}
      </main>
    </div>
  );
}

export default App;
