function RisksBlockers({ risks }) {
  return (
    <section className="dashboard-section">
      <h2>Risks & Blockers</h2>

      <div className="risk-list">
        {risks.map((risk, index) => (
          <div className="risk-item" key={index}>
            <span className={`risk-badge ${risk.severity}`}>
              {risk.severity}
            </span>

            <p>{risk.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RisksBlockers