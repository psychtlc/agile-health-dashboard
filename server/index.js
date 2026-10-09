const cors = require("cors")
const express = require("express")

const Database = require("better-sqlite3")
const path = require("path")

const app = express()
app.use(cors())
app.use(express.json())
const PORT = 3001

const dbPath = path.join(__dirname, "..", "data", "agile_health.db")
const db = new Database(dbPath)

db.pragma("foreign_keys = ON")

app.get("/api/projects/:id/dashboard", (req, res) => {
  const projectId = req.params.id

  const project = db
    .prepare("SELECT * FROM projects WHERE id = ?")
    .get(projectId)

  if (!project) {
    return res.status(404).json({ error: "Project not found" })
  }

  const team = db
    .prepare("SELECT * FROM team_members WHERE project_id = ? AND active = 1")
    .all(projectId)

  const sprint = db
    .prepare(`
      SELECT *
      FROM sprints
      WHERE project_id = ?
      ORDER BY sprint_number DESC
      LIMIT 1
    `)
    .get(projectId)

  const metrics = db
    .prepare("SELECT * FROM sprint_metrics WHERE sprint_id = ?")
    .get(sprint.id)

  const risks = db
    .prepare("SELECT * FROM sprint_risks WHERE sprint_id = ?")
    .all(sprint.id)

  const organizationalContext = db
    .prepare("SELECT * FROM organizational_events WHERE project_id = ?")
    .all(projectId)

res.json({
  id: project.id,
  name: project.name,
  description: project.description,

  sprint: {
    number: sprint.sprint_number,
    name: sprint.name,
    goal: sprint.goal,
    startDate: sprint.start_date,
    endDate: sprint.end_date,
    status: sprint.status,
  },

  team,

  delivery: {
    completedPoints: metrics.completed_points,
    plannedPoints: metrics.planned_points,
  },

  teamHealth: {
    capacity: metrics.capacity,
    morale: metrics.morale,
    sustainability: metrics.sustainability,
    psychologicalSafety: metrics.psychological_safety,

    signals: {
      unplannedWork: metrics.unplanned_work,
      sprintSpillover: metrics.spillover,
      afterHoursWork: metrics.after_hours_work,
    },
  },

  risks,
  organizationalContext,
})
})

app.put("/api/projects/:id", (req, res) => {
  const projectId = req.params.id
  const { name, description, team, sprint, delivery, teamHealth, organizationalContext,} = req.body

  const existingProject = db
    .prepare("SELECT * FROM projects WHERE id = ?")
    .get(projectId)

  if (!existingProject) {
    return res.status(404).json({ error: "Project not found" })
  }

  const now = new Date().toISOString()

  const updateProject = db.transaction(() => {
  db.prepare(`
    UPDATE projects
    SET name = ?, description = ?, updated_at = ?
    WHERE id = ?
  `).run(name, description, now, projectId)

    const updateSprint = db.prepare(`
    UPDATE sprints
    SET name = ?, goal = ?, start_date = ?, end_date = ?
    WHERE project_id = ? AND status = 'active'
    `)

    updateSprint.run(
    sprint.name,
    sprint.goal,
    sprint.startDate,
    sprint.endDate,
    projectId
    )

const updateDelivery = db.prepare(`
  UPDATE sprint_metrics
  SET completed_points = ?, planned_points = ?
  WHERE sprint_id = (
    SELECT id
    FROM sprints
    WHERE project_id = ? AND status = 'active'
  )
`)

updateDelivery.run(
  delivery.completedPoints,
  delivery.plannedPoints,
  projectId
)

const updateTeamHealth = db.prepare(`
  UPDATE sprint_metrics
  SET
    capacity = ?,
    morale = ?,
    sustainability = ?,
    psychological_safety = ?,
    unplanned_work = ?,
    spillover = ?,
    after_hours_work = ?
  WHERE sprint_id = (
    SELECT id
    FROM sprints
    WHERE project_id = ? AND status = 'active'
  )
`)

updateTeamHealth.run(
  teamHealth.capacity,
  teamHealth.morale,
  teamHealth.sustainability,
  teamHealth.psychologicalSafety,
  teamHealth.signals.unplannedWork,
  teamHealth.signals.sprintSpillover,
  teamHealth.signals.afterHoursWork,
  projectId
)
const existingEvents = db
  .prepare(`
    SELECT id
    FROM organizational_events
    WHERE project_id = ?
  `)
  .all(projectId)

const submittedEventIds = new Set(
  organizationalContext
    .filter((event) => event.id)
    .map((event) => event.id)
)

const updateEvent = db.prepare(`
  UPDATE organizational_events
  SET type = ?, description = ?, impact = ?, start_date = ?
  WHERE id = ? AND project_id = ?
`)

const insertEvent = db.prepare(`
  INSERT INTO organizational_events (
    id,
    project_id,
    type,
    description,
    impact,
    start_date,
    created_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const deactivateEvent = db.prepare(`
  DELETE FROM organizational_events
  WHERE id = ? AND project_id = ?
`)

for (const event of organizationalContext) {
  if (event.id) {
    updateEvent.run(
      event.type,
      event.description,
      event.impact,
      event.startDate || event.start_date || new Date().toISOString().slice(0, 10),
      event.id,
      projectId
    )
  } else {
    const eventId = `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    insertEvent.run(
      eventId,
      projectId,
      event.type,
      event.description,
      event.impact,
      event.startDate || event.start_date || new Date().toISOString().slice(0, 10),
      now
    )
  }
}

for (const existingEvent of existingEvents) {
  if (!submittedEventIds.has(existingEvent.id)) {
    deactivateEvent.run(existingEvent.id, projectId)
  }
}

  const existingMembers = db
    .prepare(`
      SELECT id
      FROM team_members
      WHERE project_id = ? AND active = 1
    `)
    .all(projectId)

  const submittedMemberIds = new Set(
    team.map((member) => member.id)
  )

  const updateMember = db.prepare(`
    UPDATE team_members
    SET name = ?, role = ?, active = 1
    WHERE id = ? AND project_id = ?
  `)

  const insertMember = db.prepare(`
    INSERT INTO team_members (
      id,
      project_id,
      name,
      role,
      active,
      created_at
    )
    VALUES (?, ?, ?, ?, 1, ?)
  `)

  const deactivateMember = db.prepare(`
    UPDATE team_members
    SET active = 0
    WHERE id = ? AND project_id = ?
  `)

  for (const member of team) {
    const existingMember = existingMembers.find(
      (existing) => existing.id === member.id
    )

    if (existingMember) {
      updateMember.run(
        member.name,
        member.role,
        member.id,
        projectId
      )
    } else {
      insertMember.run(
        member.id,
        projectId,
        member.name,
        member.role,
        now
      )
    }
  }

  for (const existingMember of existingMembers) {
    if (!submittedMemberIds.has(existingMember.id)) {
      deactivateMember.run(
        existingMember.id,
        projectId
      )
    }
  }
})

updateProject()

const updatedProject = db
  .prepare("SELECT * FROM projects WHERE id = ?")
  .get(projectId)

const updatedTeam = db
  .prepare(`
    SELECT *
    FROM team_members
    WHERE project_id = ? AND active = 1
  `)
  .all(projectId)

const updatedSprint = db
  .prepare(`
    SELECT *
    FROM sprints
    WHERE project_id = ? AND status = 'active'
  `)
  .get(projectId)

  const updatedMetrics = db
  .prepare(`
    SELECT *
    FROM sprint_metrics
    WHERE sprint_id = ?
  `)
  .get(updatedSprint.id)

const updatedOrganizationalContext = db
  .prepare(`
    SELECT *
    FROM organizational_events
    WHERE project_id = ?
  `)
  .all(projectId)

res.json({
  ...updatedProject,
  team: updatedTeam,
  sprint: {
    number: updatedSprint.sprint_number,
    name: updatedSprint.name,
    goal: updatedSprint.goal,
    startDate: updatedSprint.start_date,
    endDate: updatedSprint.end_date,
    status: updatedSprint.status,
   },
  delivery: {
    completedPoints: updatedMetrics.completed_points,
    plannedPoints: updatedMetrics.planned_points,
  },
  teamHealth: {
  capacity: updatedMetrics.capacity,
  morale: updatedMetrics.morale,
  sustainability: updatedMetrics.sustainability,
  psychologicalSafety: updatedMetrics.psychological_safety,
  signals: {
    unplannedWork: updatedMetrics.unplanned_work,
    sprintSpillover: updatedMetrics.spillover,
    afterHoursWork: updatedMetrics.after_hours_work,
  },
},
organizationalContext: updatedOrganizationalContext,
})
})


app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})