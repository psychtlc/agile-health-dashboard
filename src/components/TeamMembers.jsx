function TeamMembers({ team }) {
  return (
    <section className="dashboard-section">
      <h2>Team Members</h2>

      <div className="team-member-list">
        {team.map((member) => (
          <div className="team-member" key={member.id}>
            <div>
              <strong>{member.name}</strong>
              <p>{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TeamMembers