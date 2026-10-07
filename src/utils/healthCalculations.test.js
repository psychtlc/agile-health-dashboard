import { describe, expect, it } from "vitest"
import {
  getHealthStatus,
  getTeamHealthStatus,
  getDeliveryPercentage,
  getTeamHealthScore,
  hasWorkloadWarning,
} from "./healthCalculations"

describe("getHealthStatus", () => {
  it("returns green for scores of 80 or higher", () => {
    expect(getHealthStatus(80)).toBe("green")
    expect(getHealthStatus(95)).toBe("green")
  })

  it("returns yellow for scores from 60 to 79", () => {
    expect(getHealthStatus(60)).toBe("yellow")
    expect(getHealthStatus(75)).toBe("yellow")
  })

  it("returns red for scores below 60", () => {
    expect(getHealthStatus(59)).toBe("red")
    expect(getHealthStatus(20)).toBe("red")
  })
})

describe("getTeamHealthStatus", () => {
  it("returns red when a critical team-health signal is below 40", () => {
    const teamHealth = {
      capacity: 90,
      morale: 30,
      sustainability: 90,
      psychologicalSafety: 90,
    }

    expect(getTeamHealthStatus(teamHealth)).toBe("red")
  })

  it("uses the average when there is no critical signal", () => {
    const teamHealth = {
      capacity: 80,
      morale: 70,
      sustainability: 70,
      psychologicalSafety: 80,
    }

    expect(getTeamHealthStatus(teamHealth)).toBe("yellow")
  })
})
describe("getDeliveryPercentage", () => {
  it("calculates delivery percentage", () => {
    expect(
      getDeliveryPercentage({
        completedPoints: 41,
        plannedPoints: 50,
      })
    ).toBe(82)
  })
})

describe("getTeamHealthScore", () => {
  it("calculates the average team health score", () => {
    expect(
      getTeamHealthScore({
        capacity: 84,
        morale: 71,
        sustainability: 68,
        psychologicalSafety: 86,
      })
    ).toBe(77)
  })
})

describe("hasWorkloadWarning", () => {
  it("returns true when unplanned work reaches the threshold", () => {
    expect(
      hasWorkloadWarning({
        signals: {
          unplannedWork: 15,
        },
      })
    ).toBe(true)
  })

  it("returns false when unplanned work is below the threshold", () => {
    expect(
      hasWorkloadWarning({
        signals: {
          unplannedWork: 14,
        },
      })
    ).toBe(false)
  })
})