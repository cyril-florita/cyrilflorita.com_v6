"use client";
import { PRODUCTS, money } from "./data";
import { BigWordHead, LogoMark, Pill } from "./ui";

// Lifecycle messages, designed on the same brand: the shipping reminder
// (three days before a box ships, with one-tap skip, pause and edit, so the
// "you're in control" promise reaches the inbox), the order confirmation, and
// the daily reminder text. Emails are shown as they'd arrive: light, 600px
// wide, inside an inbox frame, whatever the site's theme. Sample content;
// the sender uses the reserved .example domain.

const PACK = ["d3", "b12", "omega", "magnesium"];
const FROM = "Viteo <hello@viteo.example>";

const Inbox = ({ subject, preheader, when, children }) => (
  <figure className="dl-email-frame">
    <div className="dl-email-inbox">
      <span className="dl-email-avatar" aria-hidden="true"><LogoMark /></span>
      <div>
        <p className="dl-email-from"><strong>{FROM}</strong><span>{when}</span></p>
        <p className="dl-email-subject">{subject}</p>
        <p className="dl-email-pre">{preheader}</p>
      </div>
    </div>
    <div className="dl-email">{children}</div>
  </figure>
);

const EmailHead = () => (
  <div className="dl-email-head">
    <span className="dl-email-logo"><LogoMark /><span>viteo</span></span>
  </div>
);

const EmailFoot = ({ why }) => (
  <div className="dl-email-foot">
    <p>{why}</p>
    <p>Manage email preferences · Unsubscribe from reminders</p>
    <p>Viteo · A design and dev pitch by Cyril Florita. Sample email; nothing was sent.</p>
  </div>
);

const Tray = () => (
  <div className="dl-email-tray" aria-hidden="true">
    {PACK.map((id) => <Pill key={id} id={id} tilt={-20} />)}
  </div>
);

export default function Emails() {
  return (
    <div className="dl-emails">
      <div className="dl-wrap">
        <BigWordHead word="Messages">
          <h1 className="dl-h2">The product doesn&apos;t stop at the website.</h1>
          <p className="dl-bigword-note"><span className="dl-code" data-lot="Lot 06">Sample content</span></p>
        </BigWordHead>
        <p className="dl-section-lede">
          The messages people get between visits, designed on the same brand. The shipping reminder carries the same
          one-tap controls as the account, so skipping or pausing never takes more than a tap, even from the inbox.
        </p>

        <section className="dl-emails-row">
          <div className="dl-emails-note">
            <span className="dl-pill-label">Shipping reminder</span>
            <h2 className="dl-h3">Three days before each box ships</h2>
            <p>One clear message: what&apos;s coming and when, with Skip, Pause and Edit as the only actions. If everything&apos;s fine, there&apos;s nothing to do.</p>
          </div>
          <Inbox subject="Your Morning pack ships Friday" preheader="Need a change? Skip, pause or edit your pack before Thursday." when="Tue, Dec 15">
            <EmailHead />
            <div className="dl-email-body">
              <p className="dl-email-eyebrow">Ships Friday, Dec 18</p>
              <h3 className="dl-email-h">Cyril&apos;s Morning pack is almost on its way.</h3>
              <Tray />
              <p>Your next box ({PACK.length} essentials, 30 daily packs) ships on Friday and arrives by Monday. Want something different this time? You have until Thursday.</p>
              <div className="dl-email-actions">
                <span className="dl-email-btn">Edit my pack</span>
                <span className="dl-email-btn is-ghost">Skip this box</span>
                <span className="dl-email-btn is-ghost">Pause</span>
              </div>
              <p className="dl-email-small">All good as it is? You don&apos;t need to do anything.</p>
            </div>
            <EmailFoot why="You're getting this because you have a Viteo subscription. Delivery reminders come 3 days before each box ships." />
          </Inbox>
        </section>

        <section className="dl-emails-row">
          <div className="dl-emails-note">
            <span className="dl-pill-label">Order confirmation</span>
            <h2 className="dl-h3">Right after checkout</h2>
            <p>The receipt reads like the plan: every item with its reason, the delivery date, and what happens next, so the first email builds the same trust as the product.</p>
          </div>
          <Inbox subject="You're all set, Cyril: order VT-204816" preheader="Your first box arrives Wed, Oct 21. Here's what's inside, and why." when="Mon, Oct 12">
            <EmailHead />
            <div className="dl-email-body">
              <p className="dl-email-eyebrow">Order VT-204816</p>
              <h3 className="dl-email-h">You&apos;re all set, Cyril.</h3>
              <p>Your first box arrives on <strong>Wed, Oct 21</strong>. Here&apos;s what&apos;s inside your Morning pack, and why each one is there.</p>
              <ul className="dl-email-items">
                {[
                  ["d3", "You spend most of the day indoors."],
                  ["b12", "You eat mostly or fully plant-based."],
                  ["omega", "Fish isn't part of your diet."],
                  ["magnesium", "You'd like help winding down."],
                ].map(([id, why]) => (
                  <li key={id}>
                    <Pill id={id} size="sm" tilt={-20} />
                    <span><strong>{PRODUCTS[id].name}</strong><br /><span className="dl-email-why">{why}</span></span>
                    <span>{money(PRODUCTS[id].price)}/mo</span>
                  </li>
                ))}
              </ul>
              <dl className="dl-email-totals">
                <div><dt>Every 2 months</dt><dd>{money(48)}</dd></div>
                <div><dt>Saving (10%)</dt><dd>−{money(4.8)}</dd></div>
                <div><dt>Delivery</dt><dd>Free</dd></div>
                <div className="is-total"><dt>Per box</dt><dd>{money(43.2)}</dd></div>
              </dl>
              <h4 className="dl-email-h4">What happens next</h4>
              <ol className="dl-email-steps">
                <li>We pack your 30 daily packs, printed with your name.</li>
                <li>You&apos;ll get a tracking link when it ships.</li>
                <li>A daily reminder at 8:00 AM, if you&apos;d like one.</li>
              </ol>
              <div className="dl-email-actions"><span className="dl-email-btn">Go to your account</span></div>
            </div>
            <EmailFoot why="You're getting this because you placed an order with Viteo." />
          </Inbox>
        </section>

        <section className="dl-emails-row">
          <div className="dl-emails-note">
            <span className="dl-pill-label">Daily reminder</span>
            <h2 className="dl-h3">A text at the time you chose</h2>
            <p>Short enough to read on a lock screen. Replying checks the day off, the same as tapping &ldquo;I took today&apos;s pack&rdquo;, and the streak keeps count.</p>
          </div>
          <figure className="dl-sms" aria-label="Sample text message conversation">
            <p className="dl-sms-head"><span className="dl-email-avatar" aria-hidden="true"><LogoMark /></span> Viteo</p>
            <div className="dl-sms-thread">
              <p className="dl-sms-in">Morning, Cyril ☀︎ Time for today&apos;s pack: D3, B12, Omega-3 and Magnesium. Reply 1 once you&apos;ve taken it.</p>
              <p className="dl-sms-out">1</p>
              <p className="dl-sms-in">Done ✓ That&apos;s a 5-day streak. See you tomorrow at 8:00.</p>
            </div>
            <figcaption className="dl-meta">Reply STOP to turn off reminders.</figcaption>
          </figure>
        </section>
      </div>
    </div>
  );
}
