"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { onPreloaderHidden, wipeThen } from "@/components/Preloader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CaseHero,
  CaseLayout,
  CaseSection,
  CaseFigure,
  CaseVideo,
  CaseGrid,
  CaseQuote,
  CaseNext,
} from "@/components/case/CaseStudy";
import { BrandSwatches } from "@/components/case/BrandGuide";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "designing-for-the-room", label: "Designing for the Room" },
  { id: "visual-language", label: "Visual Language" },
  { id: "live-weather", label: "Live Weather" },
  { id: "ministry-activities", label: "Ministry Activities" },
  { id: "website-analytics", label: "Website Analytics" },
  { id: "global-reach", label: "Global Reach" },
  { id: "ministry-photos", label: "Ministry Photos" },
  { id: "outcome", label: "Outcome" },
];

// Interface colors, sampled from the dashboard screens.
const COLORS = [
  { name: "Slate", hex: "#383F49", rgb: "56 63 73", role: "The screen background behind every card." },
  { name: "Card Charcoal", hex: "#2A3137", rgb: "42 49 55", role: "Cards, a step darker than the slate so each block of information reads as one unit." },
  { name: "Broadcast Green", hex: "#089062", rgb: "8 144 98", role: "The one filled card: today\u2019s radio broadcast, the thing most worth knowing right now." },
  { name: "Data Yellow", hex: "#FEC037", rgb: "254 192 55", role: "Sessions and sessions by country." },
  { name: "Data Blue", hex: "#1B8EF7", rgb: "27 142 247", role: "Page views, gty.org users and desktop share." },
  { name: "Data Green", hex: "#1CF783", rgb: "28 247 131", role: "Active users, mobile share and The Study Bible app." },
];

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'gtydashboard');
    cyrilUtility.tpInner();
    // Wait for the preloader to actually finish hiding before starting this
    // page's own reveal, instead of racing it on a separate fixed timer.
    const unsubscribePreloader = onPreloaderHidden(() => {
      const pageElement = document.querySelector('.cyril-page');
      if (pageElement) {
        pageElement.classList.add('cyril-active');
      }
    });

    return () => unsubscribePreloader();
  }, []);

  // Function to handle back navigation and save scroll position
  const handleBackToPortfolio = () => {
    // Get the project ID or identifier
    const projectId = 'gtydashboard'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Design & Development"
            detail="TV Dashboard"
            title="GTY Dashboard"
            summary="A TV-optimized dashboard interface for the Grace to You office that cycles through weather updates, streaming activity, broadcast schedules, live website stats, global engagement, and ministry activities in a format easy to read from a distance."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Web Designer & Developer" },
              { label: "Platform", value: "TV — Office Displays" },
            ]}
            image="/img/portfolio/gty-dashboard-2b.jpg"
            imageAlt="GTY Dashboard - Ministry Activities screen"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Real-Time TV Dashboard to Visualize the Global Impact of Grace to You">
              <p>As a web designer and developer at Grace to You, I was commissioned to design and build a TV dashboard system. The objective was to create a TV-optimized dashboard interface for use in the office. The dashboard needed to cycle through screens such as weather updates, streaming activity, TV &amp; radio broadcast schedules, live website user activities &amp; stats, global engagement, event photos, and ministry activities in a visually engaging, easy-to-read format from a distance.</p>
            </CaseSection>

            {/* 02 — Designing for the Room */}
            <CaseSection id="designing-for-the-room" number={2} title="Designing for the Room">
              <p>A dashboard on a wall is a different problem from a dashboard on a desk. Nobody sits in front of it, nobody clicks it, and most people only look at it for a moment on their way past. That shaped every decision:</p>
              <ul className="cyril-case-list">
                <li>Readable from across the room: large numerals, short labels and generous spacing, with no small print that matters</li>
                <li>Hands-free: the screens rotate on their own, so there are no menus, filters or hover states to rely on</li>
                <li>Always current: live data for streams, website activity and users, plus the local weather, date and time</li>
                <li>Unmistakably Grace to You: the logo and tagline on every screen, and the ministry&apos;s own broadcasts, series and artwork front and center</li>
              </ul>
            </CaseSection>

            {/* 03 — Visual Language */}
            <CaseSection id="visual-language" number={3} title="Visual Language">
              <p>Every screen shares the same frame. A header bar carries the Grace to You logo and tagline on the left, the current weather in the center, and the date and time on the right, so the dashboard doubles as a clock and a weather station whichever screen is showing.</p>
              <p>Below it, information sits in dark cards on a slate background. Each card follows one pattern: a label in the top-left corner, the time frame or source in the top-right (&ldquo;So far today,&rdquo; &ldquo;Last 30 days,&rdquo; &ldquo;GTY.ORG&rdquo;), and one large figure or image in the middle. Faint line illustrations of a radio, a TV and a calendar sit in the card backgrounds as quiet cues to what each card is about. Color carries meaning rather than decoration: each metric keeps its own color across screens, and the single green card marks what&apos;s on air today.</p>
              <BrandSwatches colors={COLORS} />
            </CaseSection>

            {/* 04 — Live Weather */}
            <CaseSection id="live-weather" number={4} title="Live Weather">
              <p>The weather screen is the calmest of the set: a full-bleed photograph behind white line icons. It shows the current temperature and conditions for the office&apos;s location, with the low, high, wind, humidity and pressure beside it, and a seven-day forecast of highs and lows along the bottom. The time and date sit large in the corner.</p>
              <CaseVideo url="gty.org" src="/img/portfolio/gty-dashboard.mp4" caption="Live Weather v1" />
              <CaseFigure src="/img/portfolio/gty-dashboard-1b.jpg" alt="GTY Dashboard - Screen 1B" caption="Live Weather v2" />
            </CaseSection>

            {/* 05 — Ministry Activities */}
            <CaseSection id="ministry-activities" number={5} title="Ministry Activities">
              <p>The ministry screen answers &ldquo;what&apos;s going out today?&rdquo; at a glance. The first version brings together this week&apos;s TV episode, today&apos;s radio broadcast, the current and upcoming radio series with their artwork and air dates, the latest sermons, the number of people listening to Grace Stream right now alongside the sermon that&apos;s playing, and the latest blog post with its views, comments and shares.</p>
              <p>The second version trades some of the schedule for engagement: site visitors by device over the last 30 days, a countdown to the Truth Matters Conference, and &ldquo;New to the Family,&rdquo; a weekly bar chart with today&apos;s count underneath.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty-dashboard-2a.jpg" alt="GTY Dashboard - Screen 2A" caption="Ministry Activities v1" />
                <CaseFigure src="/img/portfolio/gty-dashboard-2b.jpg" alt="GTY Dashboard - Screen 2B" caption="Ministry Activities v2" />
              </CaseGrid>
            </CaseSection>

            {/* 06 — Website Analytics */}
            <CaseSection id="website-analytics" number={6} title="Website Analytics">
              <p>The analytics screen turns gty.org&apos;s traffic into three headline numbers: sessions and page views so far today, and active users right now. Under each, yesterday, the last 7 days and the last 30 days give the number its context. The lower row breaks it down by where visitors come from (a map and a ranked list of countries), what they use (desktop, mobile and tablet), and what they read (the day&apos;s top 10 pages).</p>
              <CaseFigure src="/img/portfolio/gty-dashboard-3.jpg" alt="GTY Dashboard - Screen 3" caption="Website Usage Activities" />
            </CaseSection>

            {/* 07 — Global Reach */}
            <CaseSection id="global-reach" number={7} title="Global Reach">
              <p>The most striking screen is also the simplest: a dark world map with a pin for every active user. Pins are colored by where people are listening and reading, gty.org, gracia.org or The Study Bible app, and a panel at the bottom gives the live count for each in the same colors. It makes the ministry&apos;s reach visible in a way a table of numbers can&apos;t.</p>
              <CaseFigure src="/img/portfolio/gty-dashboard-4.jpg" alt="GTY Dashboard - Screen 4" caption="Website Global Usage Activities" />
            </CaseSection>

            {/* 08 — Ministry Photos */}
            <CaseSection id="ministry-photos" number={8} title="Ministry Photos">
              <p>Between the data screens, a photo slideshow brings in the people behind the ministry. Photos rotate through a carousel over a background seal marking Grace to You&apos;s 50 years, giving the room a reminder of the history behind the numbers.</p>
              <CaseFigure src="/img/portfolio/gty-dashboard-5.jpg" alt="GTY Dashboard - Screen 5" caption="Ministry Photo Slideshow" />
            </CaseSection>

            {/* 09 — Outcome */}
            <CaseSection id="outcome" number={9} title="Outcome and Reflection">
              <CaseQuote cite="Team feedback">
                Just glance at the screen and know what&apos;s going on.
              </CaseQuote>
              <p>The TV dashboard is now prominently displayed in the volunteer room and the hallways of the Grace to You office, providing volunteers, staff, and visitors with immediate insight into key metrics and activities of the website and apps. It improved internal awareness and coordination during live events and boosted morale by visually reinforcing the ministry's global reach. Team feedback emphasized how easy it was to &ldquo;just glance at the screen and know what's going on.&rdquo;</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-blog-graphics"
            title="GTY Blog Graphics"
            category="Marketing"
            image="/img/portfolio/thumb_gty-blog.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
