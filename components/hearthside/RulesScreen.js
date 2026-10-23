import { DOCS, REGIONS, ROUTING_RULES, STAGES, STAGE_LIMIT_H, COORDINATORS } from "./intake-data";

// Rules: how referrals are routed and flagged, written as plain sentences so
// the team can read (and question) exactly what the system does.
export default function RulesScreen() {
  return (
    <>
      <div className="hs-app-head"><div><h1>Rules</h1><p>How new referrals are routed, followed up, and flagged. Applied automatically to every referral.</p></div></div>
      <div className="hs-rec">
        <div>
          <section className="hs-panel" aria-labelledby="ru-routing">
            <h2 id="ru-routing">Routing and automation</h2>
            <div className="hs-table-wrap" style={{ border: 0, borderRadius: 0 }}>
              <table className="hs-table">
                <thead><tr><th scope="col">When</th><th scope="col">Then</th></tr></thead>
                <tbody>{ROUTING_RULES.map((r) => <tr key={r.id}><td>{r.when}</td><td><b>{r.then}</b></td></tr>)}</tbody>
              </table>
            </div>
          </section>
          <section className="hs-panel" aria-labelledby="ru-limits">
            <h2 id="ru-limits">Stage limits</h2>
            <div className="hs-table-wrap" style={{ border: 0, borderRadius: 0 }}>
              <table className="hs-table">
                <thead><tr><th scope="col">Stage</th><th scope="col">Flag as overdue after</th></tr></thead>
                <tbody>{STAGES.filter((s) => STAGE_LIMIT_H[s.id]).map((s) => <tr key={s.id}><td>{s.name}</td><td>{STAGE_LIMIT_H[s.id] < 24 ? `${STAGE_LIMIT_H[s.id]} hour${STAGE_LIMIT_H[s.id] > 1 ? "s" : ""}` : `${STAGE_LIMIT_H[s.id] / 24} day${STAGE_LIMIT_H[s.id] > 24 ? "s" : ""}`} with no activity</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        </div>
        <aside>
          <section className="hs-panel" aria-labelledby="ru-regions">
            <h2 id="ru-regions">Regions</h2>
            <div className="hs-panel-body">
              {Object.entries(REGIONS).map(([id, r]) => (
                <div key={id} style={{ marginBottom: 16 }}>
                  <b>{r.name}</b> · {COORDINATORS.find((c) => c.region === id).name}
                  <p className="hs-hint">{r.towns.join(", ")}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="hs-panel" aria-labelledby="ru-docs">
            <h2 id="ru-docs">Required documents</h2>
            <div className="hs-panel-body"><p className="hs-hint">{DOCS.filter((d) => d.required).map((d) => d.name).join(" · ")}</p></div>
          </section>
          <section className="hs-panel" aria-labelledby="ru-privacy">
            <h2 id="ru-privacy">Notifications and privacy</h2>
            <div className="hs-panel-body">
              <p className="hs-hint">Email and text alerts to staff contain a reference number and a link, never patient names or health details. Referrers see progress only. The public website runs no advertising pixels or session recording, and form contents never go to analytics.</p>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
