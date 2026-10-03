export function getHealthStatus(score) {
  if (score >= 80) {
    return "green"
  }

  if (score >= 60) {
    return "yellow"
  }

  return "red"
}
export function getTeamHealthStatus(teamHealth) {
  const criticalSignal =
    teamHealth.morale < 40 ||
    teamHealth.sustainability < 40 ||
    teamHealth.psychologicalSafety < 40

  if (criticalSignal) {
    return "red"
  }

  const scores = [
    teamHealth.capacity,
    teamHealth.morale,
    teamHealth.sustainability,
    teamHealth.psychologicalSafety,
  ]

  const average =
    scores.reduce((total, score) => total + score, 0) /
    scores.length

  return getHealthStatus(average)
}