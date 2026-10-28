import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Activity, Brain, Image as ImageIcon, Database, RefreshCw } from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: { legend: { labels: { color: '#b8c3d7', usePointStyle: true, boxWidth: 8 } } },
  scales: { x: { ticks: { color: '#8794aa' }, grid: { display: false } }, y: { ticks: { color: '#8794aa', precision: 0 }, grid: { color: 'rgba(148,163,184,.12)' }, beginAtZero: true } }
};

export default function Overview({ refreshKey }) {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([api.get('/stats'), api.get('/predictions')])
      .then(([s, h]) => { if (alive) { setStats(s.data); setHistory(h.data.slice(0, 5)); setError(''); } })
      .catch(() => { if (alive) setError('Could not load dashboard data. Check Flask and MongoDB are running.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [refreshKey]);

  const barData = {
    labels: stats?.labels || ['positive', 'neutral', 'negative'],
    datasets: [{ label: 'Predictions', data: stats?.counts || [0, 0, 0], borderRadius: 7, backgroundColor: ['#54d6a0', '#7c8cf8', '#fb7185'] }]
  };
  const doughnutData = {
    labels: ['Sentiment', 'Image analysis'],
    datasets: [{ data: [stats?.sentiment_count || 0, stats?.image_count || 0], backgroundColor: ['#818cf8', '#38bdf8'], borderWidth: 0 }]
  };

  return <div className="page-content">
    <div className="welcome-row"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>Dashboard overview</h1><p className="muted">A clear view of your AI experiments and activity.</p></div>
      <button className="secondary-btn" onClick={() => window.location.reload()}><RefreshCw size={15}/> Refresh</button></div>
    {error && <div className="alert error">{error}</div>}
    {loading && <div className="alert">Loading dashboard data…</div>}
    <div className="stats-grid">
      <StatCard title="Total records" value={stats?.total ?? '—'} note="Saved in MongoDB" icon={Database}/>
      <StatCard title="Text analyses" value={stats?.sentiment_count ?? '—'} note="VADER sentiment results" icon={Brain}/>
      <StatCard title="Image analyses" value={stats?.image_count ?? '—'} note="Uploaded image records" icon={ImageIcon}/>
      <StatCard title="API status" value={error ? 'Check' : 'Ready'} note="Local Flask service" icon={Activity}/>
    </div>
    <div className="charts-grid">
      <section className="panel"><div className="panel-heading"><div><h2>Sentiment distribution</h2><p>Saved sentiment labels</p></div><span className="panel-tag">LIVE DATA</span></div>
        <div className="chart-wrap"><Bar data={barData} options={chartOptions}/></div></section>
      <section className="panel"><div className="panel-heading"><div><h2>Experiment activity</h2><p>Record type split</p></div></div>
        <div className="doughnut-wrap"><Doughnut data={doughnutData} options={{responsive:true, maintainAspectRatio:false, cutout:'72%', plugins:{legend:{position:'bottom', labels:{color:'#b8c3d7', usePointStyle:true, padding:20}}}}}/></div></section>
    </div>
    <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Your latest saved predictions</p></div><span className="count-pill">{history.length} recent</span></div>
      {history.length === 0 ? <div className="empty-state">No saved records yet. Try Sentiment AI or Image analysis.</div> :
        <div className="table-scroll"><table><thead><tr><th>Type</th><th>Input</th><th>Result</th><th>Date</th></tr></thead><tbody>{history.map(item =>
          <tr key={item._id}><td><span className="type-chip">{item.type}</span></td><td className="truncate-cell">{item.text || item.filename || 'Image upload'}</td><td><span className={`label-chip ${item.label}`}>{item.label}</span></td><td>{new Date(item.created_at).toLocaleString()}</td></tr>
        )}</tbody></table></div>}
    </section>
  </div>;
}
