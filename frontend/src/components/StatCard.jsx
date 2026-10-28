export default function StatCard({ title, value, note, icon: Icon }) {
  return <article className="stat-card">
    <div className="stat-top"><span>{title}</span><span className="stat-icon"><Icon size={19}/></span></div>
    <div className="stat-value">{value}</div><div className="stat-note">{note}</div>
  </article>;
}
