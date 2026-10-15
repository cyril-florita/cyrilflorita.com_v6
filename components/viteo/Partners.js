"use client";
import { useState } from "react";
import Link from "next/link";
import { BASE, money } from "./data";
import PartnerHero from "./PartnerHero";
import { Arrow, BigWordHead, Button, Pill, PillTray } from "./ui";

// Viteo for professionals: personal trainers share Viteo with a link and a
// code; nutrition professionals suggest a whole pack, which the client sees as
// "Suggested by …" and can change. An earnings calculator (with the option to
// pass the commission on to clients as a bigger discount), a preview of the
// pro dashboard (sample data), the partner guidelines (disclosure, no health
// claims, client privacy), a FAQ and an application form (preview mode:
// nothing is sent). Program terms are part of the pitch, not live offers.

const COMMISSION = 0.1; // of each box a referred client pays for, first 12 months
const WELCOME = 0.15; // the client's first-box discount

const STEPS = [
  { n: "01", title: "Apply", text: "Tell us about your practice. We review every application and reply within two business days." },
  { n: "02", title: "Share or suggest", text: "Trainers share a personal link and code. Nutrition professionals build a pack for a client and send it as a link." },
  { n: "03", title: "Your clients stay in control", text: "It's their account: they can change, skip or pause anything. Their check-ins are shared with you only if they choose to." },
];

const CLIENTS = [
  { name: "A. Morgan", pills: ["d3", "b12", "omega", "magnesium"], status: "Active", since: "Mar" },
  { name: "J. Okafor", pills: ["d3", "magnesium", "theanine"], status: "Active", since: "May" },
  { name: "L. Chen", pills: ["omega", "c", "zinc"], status: "Paused", since: "Jun" },
  { name: "R. Alvarez", pills: ["d3", "probiotic", "biotin", "b12"], status: "Active", since: "Aug" },
];

const FAQ = [
  { q: "Who can apply?", a: "Certified personal trainers and coaches, registered dietitians and nutritionists. We ask for your certification or license number when you apply." },
  { q: "Can I recommend specific vitamins?", a: "Nutrition professionals can suggest a pack within their scope of practice; clients always see it as a suggestion they can change. Trainers share Viteo itself rather than specific items, since supplement advice is outside a trainer's scope." },
  { q: "Do I have to disclose that I earn from referrals?", a: "Yes. Whenever you share Viteo, say that you're a partner, the way you'd disclose any brand relationship. That applies with give-back on, too." },
  { q: "How and when am I paid?", a: "Monthly, by direct deposit, for boxes your referred clients paid for in the previous month, for their first 12 months." },
];

export default function Partners() {
  const [clients, setClients] = useState(20);
  const [pack, setPack] = useState(28);
  const [giveBack, setGiveBack] = useState(false);
  const [sent, setSent] = useState(false);
  const monthly = clients * pack * COMMISSION;

  return (
    <div className="dl-pro">
      <div className="dl-wrap">
        {/* Hero (shared with the landing: components/viteo/PartnerHero.js) */}
        <PartnerHero eager />

        {/* Two tracks */}
        <section className="dl-pro-section" aria-labelledby="pro-tracks">
          <h2 id="pro-tracks" className="dl-sr">Two ways to partner</h2>
          <div className="dl-pro-tracks">
            <article className="dl-card dl-panel dl-panel-3 dl-pro-track">
              <span className="dl-pill-label">Trainers and coaches</span>
              <h3 className="dl-h2">Share Viteo</h3>
              <ul className="dl-pro-list">
                <li>A personal link and code for your clients</li>
                <li>Clients get {WELCOME * 100}% off their first box</li>
                <li>You earn {COMMISSION * 100}% of every box they keep, for 12 months</li>
              </ul>
              <p className="dl-meta">You share Viteo itself; your clients take the quiz and choose their own pack.</p>
            </article>
            <article className="dl-card dl-panel dl-panel-2 dl-pro-track">
              <span className="dl-pill-label">Dietitians and nutritionists</span>
              <h3 className="dl-h2">Suggest a pack</h3>
              <ul className="dl-pro-list">
                <li>Build a pack for a client and send it as a link</li>
                <li>They see &ldquo;Suggested by Cyril Florita&rdquo; and can change anything</li>
                <li>Practitioner pricing for your own pack, plus commission</li>
              </ul>
              <p className="dl-meta">Your suggestion arrives with each item&apos;s reason, just like a quiz result.</p>
            </article>
            {/* What a client sees when a professional suggests a pack. */}
            <Link className="dl-panel dl-panel-1 dl-pro-track dl-pro-preview dl-pro-client" href={`${BASE}/plan/?pro=cyril-florita`}>
              <span className="dl-pill-label">What your client sees</span>
              <span className="dl-pro-preview-by"><span className="dl-pro-avatar" aria-hidden="true">CF</span> <span>Suggested by <strong>Cyril Florita</strong></span></span>
              <PillTray ids={["d3", "b12", "omega", "magnesium"]} label="Suggested pack" />
              <span className="dl-meta">4 essentials, each with Cyril&apos;s note · 15% off the first box</span>
              <span className="dl-textlink">Open the example <Arrow /></span>
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="dl-pro-section">
          <BigWordHead word="How it works">
            <h2 className="dl-h2">Three steps, then it runs itself.</h2>
          </BigWordHead>
          <ol className="dl-pro-steps">
            {STEPS.map((s) => (
              <li key={s.n} className="dl-card dl-glass">
                <span className="dl-pro-step-n" aria-hidden="true">{s.n}</span>
                <h3 className="dl-h3">{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Earnings */}
        <section id="pro-earnings" className="dl-pro-section">
          <BigWordHead word="Earnings">
            <h2 className="dl-h2">What partnering could look like.</h2>
          </BigWordHead>
          <div className="dl-pro-calc dl-card dl-panel dl-panel-dark">
            <div className="dl-pro-calc-inputs">
              <label className="dl-pro-range">
                <span>Clients with an active pack <strong>{clients}</strong></span>
                <input type="range" min="1" max="100" value={clients} onChange={(e) => setClients(+e.target.value)} />
              </label>
              <label className="dl-pro-range">
                <span>Average pack per month <strong>{money(pack)}</strong></span>
                <input type="range" min="15" max="45" value={pack} onChange={(e) => setPack(+e.target.value)} />
              </label>
              <label className="dl-switch">
                <input type="checkbox" checked={giveBack} onChange={(e) => setGiveBack(e.target.checked)} />
                <span className="dl-switch-ui" aria-hidden="true" />
                Give back: pass my commission to my clients
              </label>
            </div>
            <div className="dl-pro-calc-out" aria-live="polite">
              {giveBack ? (
                <>
                  <span className="dl-pill-label">Your clients save</span>
                  <strong className="dl-big">{COMMISSION * 100}% more</strong>
                  <p className="dl-meta">On every box, on top of {WELCOME * 100}% off the first. About {money(monthly)} a month across your clients goes back to them instead of to you.</p>
                </>
              ) : (
                <>
                  <span className="dl-pill-label">Estimated earnings</span>
                  <strong className="dl-big">{money(monthly)}<small>/mo</small></strong>
                  <p className="dl-meta">{money(monthly * 12)} over a year. {COMMISSION * 100}% of each box your referred clients pay for, for their first 12 months.</p>
                </>
              )}
            </div>
          </div>
          <p className="dl-meta dl-pro-note">An estimate to illustrate the program; real earnings depend on how many clients subscribe and stay.</p>
        </section>

        {/* Dashboard preview */}
        <section className="dl-pro-section">
          <BigWordHead word="Dashboard">
            <h2 className="dl-h2">Your clients, at a glance.</h2>
            <p className="dl-bigword-note"><span className="dl-code" data-lot="Lot 05">Sample data</span></p>
          </BigWordHead>
          <div className="dl-pro-dash dl-card">
            <dl className="dl-pro-stats">
              <div><dt>Active clients</dt><dd>18</dd></div>
              <div><dt>Packs suggested</dt><dd>24</dd></div>
              <div><dt>Kept past 3 months</dt><dd>83%</dd></div>
              <div><dt>Earned this month</dt><dd>{money(54.2)}</dd></div>
            </dl>
            <div className="dl-pro-table" role="table" aria-label="Clients (sample data)">
              <div role="row" className="dl-pro-row dl-pro-row-head">
                <span role="columnheader">Client</span><span role="columnheader">Pack</span><span role="columnheader">Status</span><span role="columnheader">Since</span>
              </div>
              {CLIENTS.map((c) => (
                <div role="row" key={c.name} className="dl-pro-row">
                  <span role="cell"><strong>{c.name}</strong></span>
                  <span role="cell" className="dl-pro-pills">{c.pills.map((id) => <Pill key={id} id={id} size="sm" tilt={-20} />)}</span>
                  <span role="cell"><span className={`dl-tag ${c.status === "Active" ? "dl-tag-sun" : ""}`}>{c.status}</span></span>
                  <span role="cell" className="dl-meta">{c.since}</span>
                </div>
              ))}
            </div>
            <div className="dl-ds-row">
              <Button variant="secondary" size="sm" href={`${BASE}/plan/?pro=cyril-florita`}>See a suggested pack</Button>
              <Button variant="ghost" size="sm">Copy my link</Button>
            </div>
          </div>
        </section>

        {/* Guidelines */}
        <section className="dl-pro-section">
          <BigWordHead word="Guidelines">
            <h2 className="dl-h2">Trust is the whole point.</h2>
          </BigWordHead>
          <ul className="dl-pro-rules">
            <li className="dl-card dl-glass"><h3 className="dl-h3">Always disclose</h3><p>Say you&apos;re a Viteo partner whenever you share it, the way you&apos;d disclose any brand relationship, with or without give-back.</p></li>
            <li className="dl-card dl-glass"><h3 className="dl-h3">No health claims</h3><p>Talk about routines and nutrients, not about treating or preventing anything. Viteo doesn&apos;t make those claims either.</p></li>
            <li className="dl-card dl-glass"><h3 className="dl-h3">Clients own their data</h3><p>You see a client&apos;s pack and status. Check-ins and answers are shared with you only if the client turns sharing on.</p></li>
          </ul>
        </section>

        {/* FAQ + apply */}
        <section className="dl-pro-section dl-pro-bottom">
          <div>
            <BigWordHead word="Questions">
              <h2 className="dl-h2">Good to know.</h2>
            </BigWordHead>
            <div className="dl-pro-faq">
              {FAQ.map((f) => (
                <details key={f.q} className="dl-glass dl-faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
          <form
            id="pro-apply"
            className="dl-card dl-panel dl-panel-1 dl-pro-apply"
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          >
            {sent ? (
              <div className="dl-pro-sent" role="status">
                <h2 className="dl-h3">Thanks, we&apos;ve got it.</h2>
                <p>We&apos;ll reply within two business days. Preview mode: nothing was sent.</p>
              </div>
            ) : (
              <>
                <h2 className="dl-h3">Apply to partner</h2>
                <label className="dl-field"><span>Full name</span><input required autoComplete="name" /></label>
                <label className="dl-field"><span>Email</span><input required type="email" autoComplete="email" /></label>
                <label className="dl-field">
                  <span>You are a</span>
                  <select required defaultValue="">
                    <option value="" disabled>Choose one</option>
                    <option>Personal trainer or coach</option>
                    <option>Registered dietitian</option>
                    <option>Nutritionist</option>
                  </select>
                </label>
                <label className="dl-field"><span>Certification or license number</span><input required /></label>
                <p className="dl-meta">Preview mode: your details stay in this browser and aren&apos;t sent anywhere.</p>
                <button type="submit" className="dl-btn dl-btn-primary">Send application <Arrow /></button>
              </>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
