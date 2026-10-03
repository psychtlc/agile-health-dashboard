function HealthSignals({ signals }) {
  return (
    <section className="dashboard-section">
      <h2>Health Signals</h2>

      <div className="signal-grid">
        <div className="signal-card">
          <span>Unplanned Work</span>
          <strong>{signals.unplannedWork}%</strong>
          <p>of sprint capacity</p>
        </div>

        <div className="signal-card">
          <span>Sprint Spillover</span>
          <strong>{signals.sprintSpillover}%</strong>
          <p>of planned work</p>
        </div>

        <div className="signal-card">
          <span>After-Hours Work</span>
          <strong>{signals.afterHoursWork}%</strong>
          <p>of team activity</p>
        </div>
      </div>
    </section>
  )
}

export default HealthSignals