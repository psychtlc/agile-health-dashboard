import MetricBar from "./MetricBar"

function TeamHealth({
  teamHealth,
  teamHealthInsight,
  workloadWarning,
}) {
  return (
    <section className="dashboard-section">
      <h2>Team Health</h2>

      <div className="team-health-list">
        <MetricBar
          label="Capacity"
          value={teamHealth.capacity}
        />

        <MetricBar
          label="Morale"
          value={teamHealth.morale}
        />

        <MetricBar
          label="Sustainability"
          value={teamHealth.sustainability}
        />

        <MetricBar
          label="Psychological Safety"
          value={teamHealth.psychologicalSafety}
        />
      </div>

      <div className="health-insight">
        <strong>Insight</strong>
        <p>{teamHealthInsight}</p>
      </div>

      {workloadWarning && (
        <div className="health-warning">
          <strong>Workload Warning</strong>
          <p>
            Unplanned work is elevated and may be affecting team
            sustainability.
          </p>
        </div>
      )}
    </section>
  )
}

export default TeamHealth