function OrganizationalContext({ context }) {
  return (
    <section className="dashboard-section">
      <h2>Organizational Context</h2>

      <div className="context-list">
        {context.map((item, index) => (
          <div className="context-item" key={index}>
            <div>
              <strong>{item.type}</strong>
              <p>{item.description}</p>
            </div>

            <span className={`impact-badge ${item.impact}`}>
              {item.impact}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OrganizationalContext