import { useState } from 'react';
import { Bell, ChevronDown, CircleHelp } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Sentiment from './pages/Sentiment';
import Images from './pages/Images';
import History from './pages/History';

const titles = { overview: 'Overview', sentiment: 'Sentiment AI', images: 'Image analysis', history: 'History' };

export default function App() {
  const [page, setPage] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const saved = () => setRefreshKey(v => v + 1);
  return <div className="app-shell">
    <Sidebar page={page} setPage={setPage}/>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>{titles[page]}</strong></div><div className="topbar-right"><span className="topbar-status"><i/> Development mode</span><button className="top-icon" title="Help"><CircleHelp size={18}/></button><button className="top-icon" title="Notifications"><Bell size={18}/></button><div className="user-avatar">S</div><span className="user-name">Student</span><ChevronDown size={15}/></div></header>
      {page === 'overview' && <Overview refreshKey={refreshKey}/>}
      {page === 'sentiment' && <Sentiment onSaved={saved}/>}
      {page === 'images' && <Images onSaved={saved}/>}
      {page === 'history' && <History refreshKey={refreshKey} onSaved={saved}/>}
      <footer className="app-footer"><span>Insight AI · Full-Stack Learning Project</span><span>React · Flask · MongoDB</span></footer>
    </main>
  </div>;
}
