import { Activity, LayoutDashboard, MessageSquareText, Image, History, Github } from 'lucide-react';

const items = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'sentiment', label: 'Sentiment AI', icon: MessageSquareText },
  { id: 'images', label: 'Image analysis', icon: Image },
  { id: 'history', label: 'History', icon: History }
];

export default function Sidebar({ page, setPage }) {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-icon"><Activity size={22}/></div><div><strong>Insight AI</strong><small>FULL-STACK LAB</small></div></div>
    <div className="nav-caption">WORKSPACE</div>
    <nav>{items.map(({ id, label, icon: Icon }) =>
      <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => setPage(id)}>
        <Icon size={18}/><span>{label}</span>
      </button>
    )}</nav>
    <div className="sidebar-bottom">
      <div className="status-dot"></div><span>Local workspace</span>
      <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17}/></a>
    </div>
  </aside>;
}
