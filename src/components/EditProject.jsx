function EditProject({
  editProject,
  setEditProject,
  onSave,
  onCancel,
}) {
  return (
    <section className="edit-panel">
      <h2>Edit Project</h2>

      <div className="edit-group">
        <h3>Project</h3>

        <label>
          Project Name
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
                  <h3>Sprint</h3>

                  <label>
                    Sprint Name
                    <input
                      type="text"
                      value={editProject.sprint.name}
                      onChange={(event) =>
                        setEditProject({
                          ...editProject,
                          sprint: {
                            ...editProject.sprint,
                            name: event.target.value,
                          },
                        })
                      }
                    />
                  </label>

                  <label>
                    Sprint Goal
                    <input
                      type="text"
                      value={editProject.sprint.goal}
                      onChange={(event) =>
                        setEditProject({
                          ...editProject,
                          sprint: {
                            ...editProject.sprint,
                            goal: event.target.value,
                          },
                        })
                      }
                    />
                  </label>

                  <label>
                    Start Date
                    <input
                      type="date"
                      value={editProject.sprint.startDate}
                      onChange={(event) =>
                        setEditProject({
                          ...editProject,
                          sprint: {
                            ...editProject.sprint,
                            startDate: event.target.value,
                          },
                        })
                      }
                    />
                  </label>

                  <label>
                    End Date
                    <input
                      type="date"
                      value={editProject.sprint.endDate}
                      onChange={(event) =>
                        setEditProject({
                          ...editProject,
                          sprint: {
                            ...editProject.sprint,
                            endDate: event.target.value,
                          },
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
  <h3>Team Members</h3>

  {editProject.team.map((member, index) => (
    <div className="team-member-edit-item" key={member.id}>
      <label>
        Name
        <input
          type="text"
          value={member.name}
          onChange={(event) => {
            const updatedTeam = [...editProject.team]

            updatedTeam[index] = {
              ...updatedTeam[index],
              name: event.target.value,
            }

            setEditProject({
              ...editProject,
              team: updatedTeam,
            })
          }}
        />
      </label>

      <label>
        Role
        <input
          type="text"
          value={member.role}
          onChange={(event) => {
            const updatedTeam = [...editProject.team]

            updatedTeam[index] = {
              ...updatedTeam[index],
              role: event.target.value,
            }

            setEditProject({
              ...editProject,
              team: updatedTeam,
            })
          }}
        />
      </label>

      <button
        type="button"
        className="remove-team-button"
        onClick={() => {
          const updatedTeam = editProject.team.filter(
            (_, teamIndex) => teamIndex !== index
          )

          setEditProject({
            ...editProject,
            team: updatedTeam,
          })
        }}
      >
        Remove
      </button>
    </div>
  ))}

  <button
    type="button"
    className="add-team-button"
    onClick={() =>
      setEditProject({
        ...editProject,
        team: [
          ...editProject.team,
          {
            id: `tm-${Date.now()}`,
            name: "",
            role: "",
          },
        ],
      })
    }
  >
    + Add Team Member
  </button>
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
                  const updatedContext = [
                    ...editProject.organizationalContext,
                  ]

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
                  const updatedContext = [
                    ...editProject.organizationalContext,
                  ]

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
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="save-button"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </section>
  )
}

export default EditProject