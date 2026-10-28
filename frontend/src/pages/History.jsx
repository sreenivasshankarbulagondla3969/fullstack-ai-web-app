import { useEffect, useState } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function History({ refreshKey, onSaved }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true); setError('');
    try { const res = await api.get('/predictions'); setItems(res.data); }
    catch (e) { setError(e.response?.data?.error || 'Could not load history. Check the backend and database.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [refreshKey]);
  async function remove(id) {
    if (!window.confirm('Delete this record?')) return;
    try { await api.delete(`/predictions/${id}`); setItems(old => old.filter(item => item._id !== id)); onSaved?.(); }
    catch (e) { setError(e.response?.data?.error || 'Could not delete this record.'); }
  }
  return <div className="page-content">
    <div className="welcome-row"><div><p className="eyebrow">YOUR RECORDS</p><h1>Prediction history</h1><p className="muted">Recent sentiment and image-analysis records stored in MongoDB.</p></div><button className="secondary-btn" onClick={load}><RefreshCw size={15}/> Refresh</button></div>
    {error && <div className="alert error">{error}</div>}
    <section className="panel recent-panel">{loading ? <div className="empty-state">Loading history…</div> : items.length === 0 ? <div className="empty-state">No records yet. Run an analysis to add your first record.</div> :
      <div className="table-scroll"><table><thead><tr><th>Type</th><th>Input / file</th><th>Result</th><th>Created</th><th>Action</th></tr></thead><tbody>{items.map(item =>
        <tr key={item._id}><td><span className="type-chip">{item.type}</span></td><td className="truncate-cell">{item.text || item.filename || 'Image upload'}</td><td><span className={`label-chip ${item.label}`}>{item.label}</span></td><td>{new Date(item.created_at).toLocaleString()}</td><td><button className="icon-btn danger-btn" title="Delete record" onClick={() => remove(item._id)}><Trash2 size={16}/></button></td></tr>
      )}</tbody></table></div>}
    </section>
  </div>;
}
