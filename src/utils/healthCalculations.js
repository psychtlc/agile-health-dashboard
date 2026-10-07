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
export function getDeliveryPercentage(delivery) {
  return Math.round(
    (delivery.completedPoints / delivery.plannedPoints) * 100
  )
}
export function getTeamHealthScore(teamHealth) {
  const scores = [
    teamHealth.capacity,
    teamHealth.morale,
    teamHealth.sustainability,
    teamHealth.psychologicalSafety,
  ]

  return Math.round(
    scores.reduce((total, score) => total + score, 0) /
      scores.length
  )
}export function hasWorkloadWarning(teamHealth) {
  return teamHealth.signals.unplannedWork >= 15
}