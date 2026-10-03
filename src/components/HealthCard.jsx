function HealthCard({ label, status, value, description }) {
  return (
    <div className="health-card">
      <p className="card-label">{label}</p>

      <div className="health-status">
        {status === "green" && "🟢"}
        {status === "yellow" && "🟡"}
        {status === "red" && "🔴"}
      </div>

      <h2>{value}%</h2>

      <p>{description}</p>
    </div>
  )
}

export default HealthCard