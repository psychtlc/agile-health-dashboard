import { useEffect, useState } from "react"
import "./App.css"
import HealthCard from "./components/HealthCard"
import {
  getHealthStatus,
  getTeamHealthStatus,
} from "./utils/healthCalculations"
import HealthSignals from "./components/HealthSignals"
import TeamHealth from "./components/TeamHealth"
import OrganizationalContext from "./components/OrganizationalContext"

const initialProject = {
  name: "Website Modernization",
  sprint: 14,
  sprintDates: "September 28 – October 9",
  teamSize: 7,

  delivery: {
    status: "green",
    completedPoints: 41,
    plannedPoints: 50,
  },

teamHealth: {
  capacity: 84,
  morale: 71,
  sustainability: 68,
  psychologicalSafety: 86,
 
  signals: {
    unplannedWork: 12,
    sprintSpillover: 8,
    afterHoursWork: 5,
  },

  observations: {
    morale: "Team reports some frustration with organizational uncertainty.",
    workload: "Team feels current workload is manageable.",
  },
},

    risks: [
    {
      severity: "high",
      description: "API dependency delayed",
    },
    {
      severity: "medium",
      description: "Content migration behind schedule",
    },
    {
      severity: "medium",
      description: "Limited UAT resources",
    },
  ],

  organizationalContext: [
    {
      type: "Organizational Change",
      description: "Department restructuring underway",
      impact: "medium",
    },
  ],
}


function getTeamHealthInsight(teamHealth) {
  if (teamHealth.morale < 40) {
    return "Morale is critically low and may require attention."
  }

  if (teamHealth.psychologicalSafety < 40) {
    return "Psychological safety is critically low and may require attention."
  }

  if (teamHealth.sustainability < 40) {
    return "Sustainability is critically low and may indicate an unhealthy workload."
  }

  if (teamHealth.morale < 60) {
    return "Morale is below the target range."
  }

  if (teamHealth.sustainability < 60) {
    return "Sustainability is below the target range."
  }

  return "Team health is within the expected range."
}

function App() {
  const [project, setProject] = useState(() => {
  const savedProject = localStorage.getItem("agileHealthProject")

  return savedProject
    ? JSON.parse(savedProject)
    : initialProject
})
  const [isEditing, setIsEditing] = useState(false)
  const [editProject, setEditProject] = useState(initialProject)
  const deliveryPercentage =
    Math.round(
      (project.delivery.completedPoints /
        project.delivery.plannedPoints) *
        100
    )
  const deliveryStatus = getHealthStatus(deliveryPercentage)
const teamHealthScores = [
  project.teamHealth.capacity,
  project.teamHealth.morale,
  project.teamHealth.sustainability,
  project.teamHealth.psychologicalSafety,
]
  const teamHealthScore = Math.round(
  teamHealthScores.reduce((total, score) => total + score, 0) /
    teamHealthScores.length
  )

const teamHealthStatus = getTeamHealthStatus(
  project.teamHealth
)

const teamHealthInsight = getTeamHealthInsight(project.teamHealth)
const workloadWarning =
  project.teamHealth.signals.unplannedWork >= 15
  return (
    <div className="app">
      <header className="project-header">
        <p className="eyebrow">AGILE PROJECT HEALTH</p>

        <h1>{project.name}</h1>

        <p className="project-meta">
          Sprint {project.sprint} · {project.sprintDates} ·{" "}
          {project.teamSize} team members
        </p>
      </header>

      <main>

        <section className="health-grid">

          <HealthCard
            label="DELIVERY"
            status={deliveryStatus}
            value={deliveryPercentage}
            description="Complete"
          />

         <div className="health-card">
            <p className="card-label">TEAM HEALTH</p>

            <div className="health-status">
              {teamHealthStatus === "green" && "🟢"}
              {teamHealthStatus === "yellow" && "🟡"}
              {teamHealthStatus === "red" && "🔴"}
            </div>

            <h2>{teamHealthScore}%</h2>

            <p>Overall health</p>

           <div className="health-insight">
              <span>💡</span>
              <p>{teamHealthInsight}</p>
            </div>

            {workloadWarning && (
              <div className="health-insight warning">
                <span>⚠️</span>
                <p>Unplanned work is above the team's threshold.</p>
              </div>
            )}
          </div>


         <HealthCard
            label="RISK"
            status="yellow"
            value={project.risks.length}
            description="Active risks"
          />

        </section>


        <section className="dashboard-section">

          <h2>Sprint Progress</h2>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${deliveryPercentage}%` }}
            />
          </div>

          <div className="progress-summary">
            <span>{deliveryPercentage}% complete</span>

            <span>
              {project.delivery.completedPoints} of{" "}
              {project.delivery.plannedPoints} points
            </span>
          </div>

        </section>

        <TeamHealth
          teamHealth={project.teamHealth}
          teamHealthInsight={teamHealthInsight}
          workloadWarning={workloadWarning}
        />
<HealthSignals signals={project.teamHealth.signals} />
       
<OrganizationalContext context={project.organizationalContext} />
        <section className="dashboard-section">

          <h2>Risks & Blockers</h2>

          <div className="risk-list">

            {project.risks.map((risk) => (
              <div className="risk-item" key={risk.description}>
                <span>
                  {risk.severity === "high" ? "🔴" : "🟡"}
                </span>

                <span>{risk.description}</span>
              </div>
            ))}

          </div>

        </section>
          <button
            className="edit-button"
            onClick={() => {
              setEditProject(project)
              setIsEditing(true)
            }}
          >
            Edit Project
          </button>
          {isEditing && (
            <section className="edit-panel">
              <h2>Edit Project</h2>
              <div className="edit-group">
               <h3>Project</h3>
                <label> Project Name
                    <input
                      type="text"
                      value={editProject.name}
                      onChange={(event) =>
                        setEditProject({
                          ...editProject,
                          name: event.target.value,
                        })
                      }
                    />
                </label>
              </div>
              <div className="edit-group">
              <h3>Delivery</h3>
                <label>
                  Completed Points
                  <input
                    type="number"
                    min="0"
                    value={editProject.delivery.completedPoints}
                    onChange={(event) =>
                      setEditProject({
                        ...editProject,
                        delivery: {
                          ...editProject.delivery,
                          completedPoints: Number(event.target.value),
                        },
                      })
                    }
                  />
                </label>
             
              <label>
                Planned Points
                <input
                  type="number"
                  min="0"
                  value={editProject.delivery.plannedPoints}
                  onChange={(event) =>
                    setEditProject({
                      ...editProject,
                      delivery: {
                        ...editProject.delivery,
                        plannedPoints: Number(event.target.value),
                      },
                    })
                  }
                />
              </label>
             </div> 

             <div className="edit-group">
               <h3>Team Health</h3>
                  <label>
                  Capacity
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editProject.teamHealth.capacity}
                    onChange={(event) =>
                      setEditProject({
                        ...editProject,
                        teamHealth: {
                          ...editProject.teamHealth,
                          capacity: Number(event.target.value),
                        },
                      })
                    }
                  />
                </label>
                  <label>
                    Morale
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editProject.teamHealth.morale}
                      onChange={(event) =>
                        setEditProject({
                          ...editProject,
                          teamHealth: {
                            ...editProject.teamHealth,
                            morale: Number(event.target.value),
                          },
                        })
                      }
                    />
                  </label>
              <label>
                  Sustainability
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editProject.teamHealth.sustainability}
                    onChange={(event) =>
                      setEditProject({
                        ...editProject,
                        teamHealth: {
                          ...editProject.teamHealth,
                          sustainability: Number(event.target.value),
                        },
                      })
                    }
                  />
                </label>
                <label>
                  Psychological Safety
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editProject.teamHealth.psychologicalSafety}
                    onChange={(event) =>
                      setEditProject({
                        ...editProject,
                        teamHealth: {
                          ...editProject.teamHealth,
                          psychologicalSafety: Number(event.target.value),
                        },
                      })
                    }
                  />
                </label>
                <label>
                Unplanned Work
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editProject.teamHealth.signals.unplannedWork}
                  onChange={(event) =>
                    setEditProject({
                      ...editProject,
                      teamHealth: {
                        ...editProject.teamHealth,
                        signals: {
                          ...editProject.teamHealth.signals,
                          unplannedWork: Number(event.target.value),
                        },
                      },
                    })
                  }
                />
              </label>

              <label>
                Sprint Spillover
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editProject.teamHealth.signals.sprintSpillover}
                  onChange={(event) =>
                    setEditProject({
                      ...editProject,
                      teamHealth: {
                        ...editProject.teamHealth,
                        signals: {
                          ...editProject.teamHealth.signals,
                          sprintSpillover: Number(event.target.value),
                        },
                      },
                    })
                  }
                />
              </label>

              <label>
                After-Hours Work
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editProject.teamHealth.signals.afterHoursWork}
                  onChange={(event) =>
                    setEditProject({
                      ...editProject,
                      teamHealth: {
                        ...editProject.teamHealth,
                        signals: {
                          ...editProject.teamHealth.signals,
                          afterHoursWork: Number(event.target.value),
                        },
                      },
                    })
                  }
                />
              </label>      

              </div>
              <div className="edit-group">
                <h3>Organizational Context</h3>

                {editProject.organizationalContext.map((context, index) => (
                <div className="context-edit-item" key={index}>
                  <label>
                    Type
                    <input
                      type="text"
                      value={context.type}
                      onChange={(event) => {
                        const updatedContext = [...editProject.organizationalContext]

                        updatedContext[index] = {
                          ...updatedContext[index],
                          type: event.target.value,
                        }

                        setEditProject({
                          ...editProject,
                          organizationalContext: updatedContext,
                        })
                      }}
                    />
                  </label>

                  <label>
                    Description
                    <input
                      type="text"
                      value={context.description}
                      onChange={(event) => {
                        const updatedContext = [...editProject.organizationalContext]

                        updatedContext[index] = {
                          ...updatedContext[index],
                          description: event.target.value,
                        }

                        setEditProject({
                          ...editProject,
                          organizationalContext: updatedContext,
                        })
                      }}
                    />
                  </label>
                  <label>
                      Impact
                      <select
                        value={context.impact}
                        onChange={(event) => {
                          const updatedContext = [
                            ...editProject.organizationalContext,
                          ]

                          updatedContext[index] = {
                            ...updatedContext[index],
                            impact: event.target.value,
                          }

                          setEditProject({
                            ...editProject,
                            organizationalContext: updatedContext,
                          })
                        }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </label>
                      <button
                        type="button"
                        className="remove-context-button"
                        onClick={() => {
                          const updatedContext =
                            editProject.organizationalContext.filter(
                              (_, contextIndex) => contextIndex !== index
                            )

                          setEditProject({
                            ...editProject,
                            organizationalContext: updatedContext,
                          })
                        }}
                      >
                        Remove
                      </button>
                </div>
              ))}
                <button
                type="button"
                className="add-context-button"
                onClick={() =>
                  setEditProject({
                    ...editProject,
                    organizationalContext: [
                      ...editProject.organizationalContext,
                      {
                        type: "Organizational Change",
                        description: "",
                        impact: "medium",
                      },
                    ],
                  })
                }
              >
                + Add Organizational Event
              </button>
              </div>
              <div className="edit-actions">
                  <button
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="save-button"
                    onClick={() => {
                      setProject(editProject)
                      localStorage.setItem(
                        "agileHealthProject",
                        JSON.stringify(editProject)
                      )
                      setIsEditing(false)
                    }}
                  >
                    Save
                  </button>
                </div>
            </section>
          )}
      </main>
    </div>
  )
}


export default App