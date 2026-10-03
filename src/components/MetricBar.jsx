import { getHealthStatus } from "../utils/healthCalculations"
function MetricBar({ label, value }) {
const status = getHealthStatus(value)

  return (
    <div className="team-health-item">
      <div className="team-health-header">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div className="metric-bar">
        <div
          className={`metric-fill ${status}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default MetricBar