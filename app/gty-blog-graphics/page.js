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
  CaseGrid,
  CaseNext,
} from "@/components/case/CaseStudy";

const SECTIONS = [
  { id: "visually-communicating-truth", label: "Communicating Truth" },
];

const page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'gtyblog');
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
    const projectId = 'gtyblog'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Marketing"
            detail="Blog Graphics"
            title="GTY Blog Graphics"
            summary="Blog graphics for Grace to You that pair imagery and typography to visually encapsulate the essence of each post, making the content inviting and memorable for readers."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Web Designer & Developer" },
            ]}
            image="/img/portfolio/gty-blog_the-Bible-is-timeless-truth.jpg"
            imageAlt="The Bible Is Timeless Truth"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Visually Communicating Truth */}
            <CaseSection id="visually-communicating-truth" number={1} title="Visually Communicating Truth">
              <p>When I designed blog graphics for Grace to You, I would always start by considering the core theme and title of each post, as these elements would guide my visual choices. For example, for a post titled &ldquo;A Church Not Forsaken,&rdquo; I selected a serene image of a church bathed in warm light, evoking a sense of hope and steadfastness that matches the message. The font I chose is bold and classic, ensuring the title stands out and immediately communicates the gravity and reassurance of the topic. The overall composition is uncluttered, allowing the viewer's attention to be drawn to both the image and the text without distraction, which is crucial for making a strong first impression.</p>
              <CaseFigure src="/img/portfolio/gty-blog_a-church-not-forsaken.jpg" alt="A Church Not Forsaken" caption="A Church Not Forsaken" size="text" />
              <p>Similarly, for posts like &ldquo;Christ Gives the Gospel&rdquo; and &ldquo;Inerrancy and Evangelical Syncretism,&rdquo; I carefully pair imagery and typography to reinforce the post's subject. For the former, I use a dynamic split design with an illustration of Christ, combined with a modern, bold font for the word &ldquo;CHRIST&rdquo; to highlight its importance and draw the reader in. For the latter, I opt for a conceptual image&mdash;a jar with separated liquids&mdash;to visually represent the idea of syncretism, paired with clean, contemporary type to convey clarity and seriousness.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty-blog_Christ-gives-the-gospel.jpg" alt="Christ Gives the Gospel" caption="Christ Gives the Gospel" />
                <CaseFigure src="/img/portfolio/gty-blog_inerrancy-and-evangelical-syncretism.jpg" alt="Inerrancy and Evangelical Syncretism" caption="Inerrancy and Evangelical Syncretism" />
              </CaseGrid>
              <p>In every case, my goal is to create graphics that not only attract attention but also visually encapsulate the essence of the blog post, making the content inviting and memorable for readers.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty-blog_a-world-gone-mad.jpg" alt="A World Gone Mad" caption="A World Gone Mad" />
                <CaseFigure src="/img/portfolio/gty-blog_and-His-Name-shall-be-called.jpg" alt="And His Name Shall Be Called" caption="And His Name Shall Be Called" />
                <CaseFigure src="/img/portfolio/gty-blog_answering-tough-questions-about-forgiveness.jpg" alt="Answering Tough Questions About Forgiveness" caption="Answering Tough Questions About Forgiveness" />
                <CaseFigure src="/img/portfolio/gty-blog_assaulting-the-nature-of-truth.jpg" alt="Assaulting the Nature of Truth" caption="Assaulting the Nature of Truth" />
                <CaseFigure src="/img/portfolio/gty-blog_commendation-of-a-persecuted-church.jpg" alt="Commendation of a Persecuted Church" caption="Commendation of a Persecuted Church" />
                <CaseFigure src="/img/portfolio/gty-blog_contentment-and-providence.jpg" alt="Contentment and Providence" caption="Contentment and Providence" />
                <CaseFigure src="/img/portfolio/gty-blog_courageous-Christianity.jpg" alt="Courageous Christianity" caption="Courageous Christianity" />
                <CaseFigure src="/img/portfolio/gty-blog_dethroning-the-Judge.jpg" alt="Dethroning the Judge" caption="Dethroning the Judge" />
                <CaseFigure src="/img/portfolio/gty-blog_digital-disrupters.jpg" alt="Digital Disrupters" caption="Digital Disrupters" />
                <CaseFigure src="/img/portfolio/gty-blog_election-and-Christ.jpg" alt="Election and Christ" caption="Election and Christ" />
                <CaseFigure src="/img/portfolio/gty-blog_engaging-without-embibing.jpg" alt="Engaging Without Imbibing" caption="Engaging Without Imbibing" />
                <CaseFigure src="/img/portfolio/gty-blog_faith-as-Christ-defined-it.jpg" alt="Faith as Christ Defined It" caption="Faith as Christ Defined It" />
                <CaseFigure src="/img/portfolio/gty-blog_false-Gods-fake-images.jpg" alt="False Gods, Fake Images" caption="False Gods, Fake Images" />
                <CaseFigure src="/img/portfolio/gty-blog_Gods-unimpeachable-sovereignty.jpg" alt="God's Unimpeachable Sovereignty" caption="God's Unimpeachable Sovereignty" />
                <CaseFigure src="/img/portfolio/gty-blog_He-loved-them-to-the-end.jpg" alt="He Loved Them to the End" caption="He Loved Them to the End" />
                <CaseFigure src="/img/portfolio/gty-blog_in-the-world-but-not-of-it.jpg" alt="In the World but Not of It" caption="In the World but Not of It" />
                <CaseFigure src="/img/portfolio/gty-blog_inerrancy-and-evangelical-syncretism.jpg" alt="Inerrancy and Evangelical Syncretism" caption="Inerrancy and Evangelical Syncretism" />
                <CaseFigure src="/img/portfolio/gty-blog_is-there-a-temple-in-heaven.jpg" alt="Is There a Temple in Heaven?" caption="Is There a Temple in Heaven?" />
                <CaseFigure src="/img/portfolio/gty-blog_legalism-and-assurance.jpg" alt="Legalism and Assurance" caption="Legalism and Assurance" />
                <CaseFigure src="/img/portfolio/gty-blog_limitless-love.jpg" alt="Limitless Love" caption="Limitless Love" />
                <CaseFigure src="/img/portfolio/gty-blog_looking-for-truth-in-the-wrong-places.jpg" alt="Looking for Truth in the Wrong Places" caption="Looking for Truth in the Wrong Places" />
                <CaseFigure src="/img/portfolio/gty-blog_loving-the-local-church.jpg" alt="Loving the Local Church" caption="Loving the Local Church" />
                <CaseFigure src="/img/portfolio/gty-blog_no-other-gospel.jpg" alt="No Other Gospel" caption="No Other Gospel" />
                <CaseFigure src="/img/portfolio/gty-blog_not-all-that-glitters-is-gold.jpg" alt="Not All That Glitters Is Gold" caption="Not All That Glitters Is Gold" />
                <CaseFigure src="/img/portfolio/gty-blog_one-race-one-remedy.jpg" alt="One Race, One Remedy" caption="One Race, One Remedy" />
                <CaseFigure src="/img/portfolio/gty-blog_pauls-gospel-essential.jpg" alt="Paul's Gospel Essential" caption="Paul's Gospel Essential" />
                <CaseFigure src="/img/portfolio/gty-blog_people-who-missed-Christmas.jpg" alt="People Who Missed Christmas" caption="People Who Missed Christmas" />
                <CaseFigure src="/img/portfolio/gty-blog_purpose-of-the-parable-of-the-vineyard.jpg" alt="Purpose of the Parable of the Vineyard" caption="Purpose of the Parable of the Vineyard" />
                <CaseFigure src="/img/portfolio/gty-blog_reconciled-in-Christ.jpg" alt="Reconciled in Christ" caption="Reconciled in Christ" />
                <CaseFigure src="/img/portfolio/gty-blog_replacing-worry-with-the-right-focus.jpg" alt="Replacing Worry with the Right Focus" caption="Replacing Worry with the Right Focus" />
                <CaseFigure src="/img/portfolio/gty-blog_seduced-by-mysticism.jpg" alt="Seduced by Mysticism" caption="Seduced by Mysticism" />
                <CaseFigure src="/img/portfolio/gty-blog_social-injustice-and-the-gospel.jpg" alt="Social Injustice and the Gospel" caption="Social Injustice and the Gospel" />
                <CaseFigure src="/img/portfolio/gty-blog_soteriology-of-the-thief.jpg" alt="Soteriology of the Thief" caption="Soteriology of the Thief" />
                <CaseFigure src="/img/portfolio/gty-blog_stop-complaining.jpg" alt="Stop Complaining" caption="Stop Complaining" />
                <CaseFigure src="/img/portfolio/gty-blog_takeaway-from-the-shepcon-qna-session.jpg" alt="Takeaway from the ShepCon Q&A Session" caption="Takeaway from the ShepCon Q&A Session" />
                <CaseFigure src="/img/portfolio/gty-blog_teach-the-word.jpg" alt="Teach the Word" caption="Teach the Word" />
                <CaseFigure src="/img/portfolio/gty-blog_the-assault-on-the-virgin-birth-of-Christ.jpg" alt="The Assault on the Virgin Birth of Christ" caption="The Assault on the Virgin Birth of Christ" />
                <CaseFigure src="/img/portfolio/gty-blog_the-Bible-is-timeless-truth.jpg" alt="The Bible Is Timeless Truth" caption="The Bible Is Timeless Truth" />
                <CaseFigure src="/img/portfolio/gty-blog_the-centraility-of-man-in-creation.jpg" alt="The Centrality of Man in Creation" caption="The Centrality of Man in Creation" />
                <CaseFigure src="/img/portfolio/gty-blog_the-coming-Messiah.jpg" alt="The Coming Messiah" caption="The Coming Messiah" />
                <CaseFigure src="/img/portfolio/gty-blog_the-condemnation-in-Gods-love.jpg" alt="The Condemnation in God's Love" caption="The Condemnation in God's Love" />
                <CaseFigure src="/img/portfolio/gty-blog_the-danger-of-calling-the-church-to-repent.jpg" alt="The Danger of Calling the Church to Repent" caption="The Danger of Calling the Church to Repent" />
                <CaseFigure src="/img/portfolio/gty-blog_the-fear-of-man.jpg" alt="The Fear of Man" caption="The Fear of Man" />
                <CaseFigure src="/img/portfolio/gty-blog_the-fertile-ground.jpg" alt="The Fertile Ground" caption="The Fertile Ground" />
                <CaseFigure src="/img/portfolio/gty-blog_the-great-exchange.jpg" alt="The Great Exchange" caption="The Great Exchange" />
                <CaseFigure src="/img/portfolio/gty-blog_the-illegitimacy-of-the-pope.jpg" alt="The Illegitimacy of the Pope" caption="The Illegitimacy of the Pope" />
                <CaseFigure src="/img/portfolio/gty-blog_the-inescapable-truth-about-God.jpg" alt="The Inescapable Truth About God" caption="The Inescapable Truth About God" />
                <CaseFigure src="/img/portfolio/gty-blog_the-Lord-told-me.jpg" alt="The Lord Told Me" caption="The Lord Told Me" />
                <CaseFigure src="/img/portfolio/gty-blog_the-problem-of-evil.jpg" alt="The Problem of Evil" caption="The Problem of Evil" />
                <CaseFigure src="/img/portfolio/gty-blog_the-right-kind-of-hunger.jpg" alt="The Right Kind of Hunger" caption="The Right Kind of Hunger" />
                <CaseFigure src="/img/portfolio/gty-blog_the-sovereign-Savior.jpg" alt="The Sovereign Savior" caption="The Sovereign Savior" />
                <CaseFigure src="/img/portfolio/gty-blog_the-subtlety-of-idolatry.jpg" alt="The Subtlety of Idolatry" caption="The Subtlety of Idolatry" />
                <CaseFigure src="/img/portfolio/gty-blog_the-totality-of-depravity.jpg" alt="The Totality of Depravity" caption="The Totality of Depravity" />
                <CaseFigure src="/img/portfolio/gty-blog_the-truth-about-man.jpg" alt="The Truth About Man" caption="The Truth About Man" />
                <CaseFigure src="/img/portfolio/gty-blog_ultimate-expression-divine-compassion.jpg" alt="Ultimate Expression of Divine Compassion" caption="Ultimate Expression of Divine Compassion" />
                <CaseFigure src="/img/portfolio/gty-blog_unqualified-not-worthy.jpg" alt="Unqualified, Not Worthy" caption="Unqualified, Not Worthy" />
                <CaseFigure src="/img/portfolio/gty-blog_untangling-the-Lords-lineage.jpg" alt="Untangling the Lord's Lineage" caption="Untangling the Lord's Lineage" />
                <CaseFigure src="/img/portfolio/gty-blog_watching-your-spiritual-diet.jpg" alt="Watching Your Spiritual Diet" caption="Watching Your Spiritual Diet" />
                <CaseFigure src="/img/portfolio/gty-blog_what-is-the-eye-of-a-needle.jpg" alt="What Is the Eye of a Needle?" caption="What Is the Eye of a Needle?" />
                <CaseFigure src="/img/portfolio/gty-blog_when-truth-is-stranger-than-fiction.jpg" alt="When Truth Is Stranger Than Fiction" caption="When Truth Is Stranger Than Fiction" />
              </CaseGrid>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/patricia-macarthur-pastoral-care-fund"
            title="The Patricia MacArthur Pastoral Care Fund"
            category="Illustration/Branding"
            image="/img/portfolio/thumb_patricia-macarthur-pastoral-fund.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
