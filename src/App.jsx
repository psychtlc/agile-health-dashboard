import { useEffect, useState } from "react"
import "./App.css"
import HealthCard from "./components/HealthCard"
import {
  getHealthStatus,
  getTeamHealthStatus,
  getDeliveryPercentage,
  getTeamHealthScore,
  hasWorkloadWarning,
} from "./utils/healthCalculations"
import HealthSignals from "./components/HealthSignals"
import TeamHealth from "./components/TeamHealth"
import OrganizationalContext from "./components/OrganizationalContext"
import RisksBlockers from "./components/RisksBlockers"
import EditProject from "./components/EditProject"
import TeamMembers from "./components/TeamMembers"

const initialProject = {
  name: "Website Modernization",
  sprints: [
  {
    id: "sprint-014",
    number: 14,
    name: "Foundation & API Integration",
    startDate: "2026-09-28",
    endDate: "2026-10-09",
    teamMemberIds: ["tm-001", "tm-002", "tm-003"],
  },
],
  team: [
    {
      id: "tm-001",
      name: "Tara Glover",
      role: "Senior Developer",
    },
    {
      id: "tm-002",
      name: "Ellen Robinson",
      role: "Product Manager",
    },
    {
      id: "tm-003",
      name: "Morgan Smith",
      role: "UX Designer",
    },
  ],
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
//console.log(initialProject)

  const [project, setProject] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editProject, setEditProject] = useState(null)
useEffect(() => {
  fetch("http://localhost:3001/api/projects/proj-001/dashboard")
    .then((response) => response.json())
    .then((data) => {
      setProject(data)
    })
}, [])

if (!project) {
  return <p>Loading project...</p>
}
const currentSprint = project.sprint

const deliveryPercentage = getDeliveryPercentage(
  project.delivery
)
const deliveryStatus = getHealthStatus(deliveryPercentage)
const teamHealthScore = getTeamHealthScore(
  project.teamHealth
)

const teamHealthStatus = getTeamHealthStatus(
  project.teamHealth
)

const teamHealthInsight = getTeamHealthInsight(project.teamHealth)
const workloadWarning = hasWorkloadWarning(
  project.teamHealth
)

  return (
    <div className="app">
      <header className="project-header">
        <p className="eyebrow">AGILE PROJECT HEALTH</p>

        <h1>{project.name}</h1>

        <p className="project-meta">
          Sprint {currentSprint.number}: {currentSprint.name}
        </p>
         <p className="project-meta">
           {currentSprint.startDate} – {currentSprint.endDate}
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
<TeamMembers team={project.team} />
<HealthSignals signals={project.teamHealth.signals} />
       
<OrganizationalContext context={project.organizationalContext} />
        
<RisksBlockers risks={project.risks} />        
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
            <EditProject
              editProject={editProject}
              setEditProject={setEditProject}
             onSave={() => {
              console.log("Saving project:", editProject)
              fetch("http://localhost:3001/api/projects/proj-001", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                
                body: JSON.stringify({
                  name: editProject.name,
                  description: editProject.description,
                  team: editProject.team,
                  sprint: editProject.sprint,
                  delivery: editProject.delivery,
                  teamHealth: editProject.teamHealth,
                  organizationalContext: editProject.organizationalContext,
                }),
              })
                .then((response) => response.json())
                .then((updatedProject) => {
                  console.log("API response after save:", updatedProject)
                  setProject({
                    ...project,
                    ...updatedProject,
                  })
                  setIsEditing(false)
                })
            }}
              onCancel={() => setIsEditing(false)}
            />
          )}
      </main>
    </div>
  )
}


export default App