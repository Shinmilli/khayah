import { KHAYAH_ORG_BOARD_MERGED_HTML } from './khayahOrgBoardHtml.en'
import { KHAYAH_LOCATION_PAGE_HTML } from './khayahLocationPageHtml.en'
import { KHAYAH_HISTORY_PAGE_HTML } from './khayahHistoryHtml.en'
import { DONOR_GUIDE_PAGE_HTML } from './donorGuidePageHtml.en'
import type { StaticPage } from './pagesContent.ko'

/**
 * WordPress page static content (fallback before DB migration)
 * Key: pathname (no leading slash, e.g. "about/khayah", "business/overseas")
 */
export const PAGES_STATIC_EN: Record<string, StaticPage> = {
  'about/khayah': {
    title: 'About Khayah',
    content: `
<div class="khayah-about-def-vmv">
  <section id="about" class="def-section" aria-labelledby="about-label">
    <div id="about-label" class="def-label">Definition</div>
    <div class="def-content">
      <p class="def-headline">Khayah is a development NGO that nurtures and serves people.</p>
      <p class="def-body">Khayah believes that one person who has grown through right guidance can lead great transformation — and that they may become a light that illuminates the world wherever they go.</p>
    </div>
  </section>
  <div class="def-divider" aria-hidden="true"></div>
  <section id="vision" class="vmv-hero" aria-labelledby="vmv-hero-title">
    <h2 id="vmv-hero-title" class="vmv-hero-title">Vision &amp; Mission &amp; Value</h2>
    <div class="vmv-hero-line" aria-hidden="true"></div>
    <p class="vmv-hero-desc">The world Khayah envisions is one where all marginalized neighbors<br />find ways to stand on their own.</p>
  </section>
  <div class="vmv-content">
    <div class="vmv-row">
      <div class="vmv-row-label">Vision</div>
      <p class="vmv-row-body">Khayah envisions a world where all marginalized neighbors, transcending barriers of race, religion, and ideology, lead transformation in their families and communities through their own growth.</p>
    </div>
    <div class="vmv-row">
      <div class="vmv-row-label">Mission</div>
      <p class="vmv-row-body">Through people-centered project development, Khayah helps all marginalized neighbors find ways to stand on their own.</p>
    </div>
    <div id="value" class="values-orbit-section" aria-labelledby="values-heading">
      <div class="values-orbit-section__head">
        <h3 id="values-heading" class="values-orbit-section__title">Core Values</h3>
        <div class="values-orbit-section__underline" aria-hidden="true"></div>
      </div>
      <div class="values-orbit-section__body">
        <div class="values-orbit" aria-label="Five core values">
          <img
            class="values-orbit__bgimg"
            src="/images/Khayah/intro/values_bubble.png"
            alt=""
            aria-hidden="true"
          />
          <div class="values-orbit__center">
            <div class="values-orbit__center-title">5 Values</div>
            <div class="values-orbit__center-sub">Values that matter to Khayah</div>
          </div>

          <div class="values-orbit__node values-orbit__node--v1">
            <div class="values-orbit__stack">
              <div class="values-orbit__bubble">
                <img class="values-orbit__bubble-img" src="/images/Khayah/intro/bubble1.png" alt="" aria-hidden="true" />
                <div class="values-orbit__bubble-content">
                  <div class="value-tile-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M12 11a4 4 0 100-8 4 4 0 000 8z"/><path d="M4 20a8 8 0 0116 0"/></svg>
                  </div>
                  <div class="values-orbit__key">Human Dignity</div>
                </div>
              </div>
            </div>
            <p class="values-orbit__desc">We respect the inherent dignity of every person and reject treating people as tools.</p>
          </div>

          <div class="values-orbit__node values-orbit__node--v2">
            <div class="values-orbit__stack">
              <div class="values-orbit__bubble">
                <img class="values-orbit__bubble-img" src="/images/Khayah/intro/bubble2.png" alt="" aria-hidden="true" />
                <div class="values-orbit__bubble-content">
                  <div class="value-tile-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                  </div>
                  <div class="values-orbit__key">Inclusion &amp; Cooperation</div>
                </div>
              </div>
            </div>
            <p class="values-orbit__desc">We serve people and work together across barriers of race, religion, and ideology.</p>
          </div>

          <div class="values-orbit__node values-orbit__node--v3">
            <div class="values-orbit__stack">
              <div class="values-orbit__bubble">
                <img class="values-orbit__bubble-img" src="/images/Khayah/intro/bubble3.png" alt="" aria-hidden="true" />
                <div class="values-orbit__bubble-content">
                  <div class="value-tile-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
                  </div>
                  <div class="values-orbit__key">Professionalism</div>
                </div>
              </div>
            </div>
            <p class="values-orbit__desc">We act with distinctive capability and professional expertise.</p>
          </div>

          <div class="values-orbit__node values-orbit__node--v4">
            <div class="values-orbit__stack">
              <div class="values-orbit__bubble">
                <img class="values-orbit__bubble-img" src="/images/Khayah/intro/bubble4.png" alt="" aria-hidden="true" />
                <div class="values-orbit__bubble-content">
                  <div class="value-tile-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  </div>
                  <div class="values-orbit__key">Innovation</div>
                </div>
              </div>
            </div>
            <p class="values-orbit__desc">We set aside harmful practices and pursue change through innovative ideas.</p>
          </div>

          <div class="values-orbit__node values-orbit__node--v5">
            <div class="values-orbit__stack">
              <div class="values-orbit__bubble">
                <img class="values-orbit__bubble-img" src="/images/Khayah/intro/bubble5.png" alt="" aria-hidden="true" />
                <div class="values-orbit__bubble-content">
                  <div class="value-tile-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.29 1.51 4.04 3 5.5l7 6.5 7-6.5z"/></svg>
                  </div>
                  <div class="values-orbit__key">Social Responsibility</div>
                </div>
              </div>
            </div>
            <p class="values-orbit__desc">We live out the life of a true Christian who loves their neighbor.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`,
  },
  'about/greeting': {
    title: 'Greeting',
    content: `
<div class="greeting-modern">
  <div class="main-grid">
    <aside class="sidebar">
      <img class="sidebar-photo" src="/images/about/greeting-representative.png" alt="Choi Soon-tae, Representative of Khayah (KHAYAH)" width="512" height="630" />
      <p class="sidebar-kicker">Representative's Message</p>
      <h2 class="sidebar-title">With a shared heart</h2>
      <p class="sidebar-sub">For the practice of sharing and service</p>
      <div class="sidebar-rule"></div>
      <p class="sidebar-role">Representative, Khayah (KHAYAH)</p>
      <p class="sidebar-name">Choi Soon-tae</p>
    </aside>
    <article class="article">
      <div class="article-lead">
        <span class="article-quote-mark" aria-hidden="true">&ldquo;</span>
        <p class="article-lead-text">Helping others is never as easy as it may seem when we hear or read about it somewhere. We must give up part of what we worked hard to earn, or carve out precious time from our lives. Yet the reward for that difficult work is unlike any other.</p>
      </div>
      <p class="article-body">
        Since making sharing and service my life's work, one of the questions I am asked most often is, &lsquo;How did you end up doing this kind of work?&rsquo; People usually look as though they cannot quite understand. My answer is always simple: &lsquo;If you have the same experience I did, you will know the answer.&rsquo; It may sound matter-of-fact, but I have always been able to answer sincerely and with gratitude.
      </p>
      <p class="article-body">
        Most of us have helped an elderly person carrying a heavy load on the street at least once. It is not a difficult or extraordinary thing. How did it make you feel? In making sharing my vocation, I live every moment with that same feeling. <strong>Saving a life, watching a student grow up smiling because of my help — nothing in this world compares to that joy.</strong>
      </p>
      <p class="article-body">
        I ask you to look around you right now. Within just a few minutes, or a few hours, there are so many neighbors who could brighten with a smile through your attention and a small act of kindness. Do not hesitate to reach out to them. This is never something to put off until &lsquo;later,&rsquo; &lsquo;when I have more money,&rsquo; or &lsquo;when I have more time.&rsquo; Sharing is something you can do right now — even without money, even without much time, at any moment.
      </p>
      <p class="article-body">
        Every life in this world is a precious creation of God, and caring for those who suffer and helping them is a calling every person on this earth should carry in their heart. Like the name Khayah, which means to live again, I pray that true revival — Khayah — may sweep through your life as well.
      </p>
      <p class="article-sign"><span class="article-sign-role">Representative, Khayah (KHAYAH)</span> <strong>Choi Soon-tae</strong></p>
    </article>
  </div>
  <section class="sig-section">
    <div class="sig-inner">
      <div class="sig-quote">
        <span class="sig-quote-mark" aria-hidden="true">&ldquo;</span>
        <p class="sig-quote-text">Together with Khayah, I pray that true sharing and true change will come to your life as well.<span class="sig-quote-mark sig-quote-mark--close">&rdquo;</span></p>
      </div>
      <div class="sig-info">
        <p class="sig-role">Representative, KHAYAH International</p>
        <p class="sig-name">Choi Soon-tae</p>
        <p class="sig-name-ko">최 순 태</p>
      </div>
    </div>
  </section>
</div>
`,
  },
  'about/history': {
    title: 'Khayah History',
    content: KHAYAH_HISTORY_PAGE_HTML,
  },
  'about/location': {
    title: 'Directions',
    content: KHAYAH_LOCATION_PAGE_HTML,
  },
  'about/financial-report': {
    title: 'Financial Report',
    content: '<p>Annual financial reports and program reports.</p>',
  },
  'about/org-chart': {
    title: 'Org Chart',
    content: KHAYAH_ORG_BOARD_MERGED_HTML,
  },
  'about/directors': {
    title: 'Board of Directors / Professional Advisors',
    content: KHAYAH_ORG_BOARD_MERGED_HTML,
  },
  'business/overseas': {
    title: 'Overseas Programs',
    content: `
<div class="overseas-page">
  <section class="overseas-hero">
    <div class="ov-wrap">
      <p class="overseas-kicker">Overseas Programs</p>
      <h1 class="overseas-title">Together with local residents, Khayah widens access to education and supports self-directed growth,<br />building a foundation for communities to lead their own change.</h1>
      <p class="overseas-lead">
        We learn and act together with local residents, pursuing development cooperation in which communities themselves grow the power to change.
      </p>
      <div class="overseas-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="overseas-section">
    <div class="ov-wrap">
      <ol class="overseas-list" aria-label="Core principles of overseas programs">
        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">01</div>
          <div>
            <h2 class="overseas-h2">Participation &amp; Cooperation</h2>
            <p class="overseas-desc">
              Khayah respects local residents not as aid recipients, but as partners in participation and cooperation.
              We share experience and knowledge, and together create the change communities need.
            </p>
          </div>
        </li>

        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">02</div>
          <div>
            <h2 class="overseas-h2">Integration with Local Communities</h2>
            <p class="overseas-desc">
              True change is possible only when local residents' will to participate and their right understanding of that change are supported.
              For this reason, Khayah makes integration with local communities — understanding the lives of the region and its people, and building dialogue and trust — an essential step in every project. We set and share the direction of our work together, and foster their voluntary participation.
            </p>
          </div>
        </li>

        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">03</div>
          <div>
            <h2 class="overseas-h2">Participatory Methodology</h2>
            <p class="overseas-desc">
              We involve residents throughout the entire project cycle (research, analysis, planning, implementation, and monitoring &amp; evaluation), reflect their experience and opinions in the work, and review results and improvements together.
            </p>
          </div>
        </li>

        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">04</div>
          <div>
            <h2 class="overseas-h2">Sustainability</h2>
            <p class="overseas-desc">
              We study the full project cycle and seek answers so that development cooperation can continue as sustainable operations within the community, based on local resources and partnership systems.
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</div>
`,
  },
  'business/overseas/education': {
    title: 'Education',
    content: `
<div class="ov-edu-page">
  <section class="ov-edu-hero">
    <div class="ov-edu-wrap">
      <p class="ov-edu-kicker">Overseas Programs · Education</p>
      <h1 class="ov-edu-title">Learning today,<br />Leading tomorrow!</h1>
      <p class="ov-edu-desc">
        Khayah helps communities build the power to change through education.
        From foundational life skills to vocational training and improved learning environments, we design and deliver programs together with people on the ground.
      </p>
      <div class="ov-edu-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="ov-edu-section">
    <div class="ov-edu-wrap">
      <div class="ov-edu-head">
        <div class="ov-edu-head__titles">
          <p class="ov-edu-head__kicker">Foundational Capacity Building</p>
          <h2 class="ov-edu-head__ko">Foundational\nCapacity Building</h2>
        </div>
        <div>
          <p class="ov-edu-head__en">Power to accept change</p>
          <p class="ov-edu-head__p">
            The ability to keep learning and meet life’s challenges is the foundation of lasting growth. Khayah builds foundational learning — reading, writing, and numeracy — together with life skills such as self-understanding, communication, and problem-solving. We support participants to continue learning, understand themselves and their community, and live as agents of their own lives.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="Foundational capacity building components">
        <div class="ov-edu-table__row ov-edu-table__row--2" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Foundational Learning</p>
            <p class="ov-edu-cell__p" role="cell">
              Essential knowledge and learning ability — Korean (reading, writing, speaking), numeracy, English, science, and more — that leads into continued study and deeper learning
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Life Skills</p>
            <p class="ov-edu-cell__p" role="cell">
              Core capacities for meeting daily life and its challenges with agency and cooperation: self-understanding, communication, relationships, health and financial management, critical and creative thinking, and problem-solving
            </p>
          </div>
        </div>
      </div>

      <div class="ov-edu-strip" aria-label="Activity images">
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-learn.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">Learning activities</div>
        </div>
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-reading.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">Reading club</div>
        </div>
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-env.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">Learning environment</div>
        </div>
      </div>
    </div>
  </section>

  <section class="ov-edu-section ov-edu-section--surface">
    <div class="ov-edu-wrap">
      <div class="ov-edu-head">
        <div class="ov-edu-head__titles">
          <p class="ov-edu-head__kicker">Future-Oriented Education</p>
          <h2 class="ov-edu-head__ko">Future-Oriented\nEducation</h2>
        </div>
        <div>
          <p class="ov-edu-head__en">Dream Seekers</p>
          <p class="ov-edu-head__p">
            Khayah aims to raise future leaders who can drive community change among the regions and participants where we work,
            and runs growth programs shaped by analysis of what the times, global currents, and each country and community will need.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="Future-oriented education components">
        <div class="ov-edu-table__row" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Tailored Vocational Training</p>
            <p class="ov-edu-cell__sub">Participant-tailored</p>
            <p class="ov-edu-cell__p" role="cell">
              Youth who have never had the chance to think about how to live or what career to choose, due to lack of proper education, are given opportunities through diverse programs to discover their aptitudes and prepare for work.
            </p>
            <p class="ov-edu-cell__sub">Enterprise-tailored</p>
            <p class="ov-edu-cell__p" role="cell">
              In partnership with promising industries and companies in the project country and region, we connect people in poverty with jobs and companies with trained skilled workers, contributing to local economic development.
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Mentoring</p>
            <p class="ov-edu-cell__p" role="cell">
              Drawing on a pool of local experts who work with Khayah, we provide diverse mentoring for adolescents and young adults in the fields they want to pursue.
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">STEM Education</p>
            <p class="ov-edu-cell__p" role="cell">
              Through science, technology, engineering, and mathematics, we support the growth of future talent that fits both local communities and global currents.
            </p>
          </div>
        </div>
      </div>

      <div class="ov-edu-strip" aria-label="Activity images">
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-skill.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">Skills training</div>
        </div>
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-field.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">Field practice</div>
        </div>
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-job.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">Job placement</div>
        </div>
      </div>
    </div>
  </section>

  <section class="ov-edu-section">
    <div class="ov-edu-wrap">
      <div class="ov-edu-head">
        <div class="ov-edu-head__titles">
          <p class="ov-edu-head__kicker">Education Quality Improvement</p>
          <h2 class="ov-edu-head__ko">Education Quality\nImprovement</h2>
        </div>
        <div>
          <p class="ov-edu-head__en">EQUIP (Education Quality Improvement Program)</p>
          <p class="ov-edu-head__p">
            As part of education quality improvement, Khayah supports HDCS (Human Development &amp; Community Services), a Nepal NGO that visits schools in mountain regions and works to share sound teaching methods with local teachers.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="Education quality improvement components">
        <div class="ov-edu-table__row" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Teacher Pedagogy Training</p>
            <ul class="ov-edu-cell__list">
              <li>School leaders and leadership (leadership and management education)</li>
              <li>Teacher education (pedagogy centered on creative and analytical thinking)</li>
              <li>Parents (awareness education)</li>
            </ul>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Education Support</p>
            <ul class="ov-edu-cell__list">
              <li>Reading education (Classroom Reading)</li>
              <li>Arts and physical education (PE/art/music, and more)</li>
              <li>School farm education</li>
              <li>Scholarship support</li>
            </ul>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Health, Hygiene &amp; Adolescent Sexual Health Education</p>
            <ul class="ov-edu-cell__list">
              <li>Awareness education for teachers and parents</li>
              <li>Youth education and peer-group activities</li>
              <li>Installation and repair of sanitation facilities such as toilets and water supply</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="ov-edu-strip" aria-label="Activity images">
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-quality-1.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">Teacher training</div>
        </div>
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-quality-2.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">Teaching materials</div>
        </div>
        <div class="ov-edu-img" aria-hidden="true">
          <img class="ov-edu-img__photo" src="/images/business/overseas-edu-quality-3.jpg" alt="" loading="lazy" />
          <div class="ov-edu-img__cap">Classroom learning</div>
        </div>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/overseas/volunteer': {
    title: 'Overseas volunteers',
    content: `
<div class="ov-health-page">
  <section class="ov-health-hero">
    <div class="ov-health-wrap">
      <p class="ov-health-kicker">Overseas Programs · Overseas volunteers</p>
      <h1 class="ov-health-title">Overseas volunteers</h1>
      <p class="ov-health-desc">
        Khayah gives young people in Korea, companies, and participants with experience and passion across many fields the chance to understand local community challenges firsthand and seek solutions together. We propose and carry out practical models the field needs, so that sustainable community change and participants’ growth happen together.
      </p>
      <div class="ov-health-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="ov-health-section">
    <div class="ov-health-wrap">
      <h2 class="ovh-block__title">Volunteer design shaped by development cooperation</h2>
      <p class="ov-health-desc ov-health-desc--left">
        With more than ten years in international development and education, Khayah identifies what a host community needs and designs activities that can last. Volunteers grow as whole persons — as global citizens, in the use of their expertise, and in problem-solving and adaptability — while the program stays fitted to local needs.
      </p>
      <div class="ovh-panels">
        <article class="ovh-panel">
          <h3 class="ovh-panel__title">Development cooperation</h3>
          <ol class="ovh-rail">
            <li>Finding themes through local analysis</li>
            <li>Field study of relevance and feasibility</li>
            <li>Action plans based on that study</li>
            <li>Local preparation with government and specialist partners</li>
            <li>A system so the work continues after the team leaves</li>
            <li>Monitoring, evaluation, and results analysis</li>
            <li>Follow-up plans that reflect the evaluation</li>
          </ol>
        </article>
        <article class="ovh-panel">
          <h3 class="ovh-panel__title">Education expertise</h3>
          <ol class="ovh-rail">
            <li>Awareness and education activities fitted to the theme</li>
            <li>Pre-departure training (identity as a volunteer, global citizenship, subject expertise, health and safety, teamwork, and activity planning)</li>
            <li>Detailed plans led by the volunteers themselves (using expertise, problem-solving, adaptability, communication, language, research and analysis, and administration)</li>
          </ol>
        </article>
      </div>
    </div>
  </section>

  <section class="ov-health-section ov-health-section--alt">
    <div class="ov-health-wrap">
      <h2 class="ovh-block__title">Running the full life cycle of a volunteer program</h2>
      <p class="ov-health-desc ov-health-desc--left">
        Khayah runs the full volunteer cycle with manuals and systems, from recruitment through the field and back to sharing what was learned.
      </p>
      <ol class="ovh-life">
        <li><span class="ovh-life__no">1</span><span class="ovh-life__name">Outreach and recruitment</span></li>
        <li><span class="ovh-life__no">2</span><span class="ovh-life__name">Screening</span></li>
        <li><span class="ovh-life__no">3</span><span class="ovh-life__name">Selection</span></li>
        <li><span class="ovh-life__no">4</span><span class="ovh-life__name">Training in Korea, activity planning, and preparation at home and abroad</span></li>
        <li><span class="ovh-life__no">5</span><span class="ovh-life__name">Launch ceremony and dispatch</span></li>
        <li><span class="ovh-life__no">6</span><span class="ovh-life__name">Field leadership, support, and safety</span></li>
        <li><span class="ovh-life__no">7</span><span class="ovh-life__name">Results analysis</span></li>
        <li><span class="ovh-life__no">8</span><span class="ovh-life__name">Sharing and spread</span></li>
      </ol>
    </div>
  </section>

  <section class="ovh-gallery" aria-label="Volunteer fieldwork">
    <div class="ov-health-wrap">
      <div class="ovh-shot-row">
        <figure class="ovh-shot">
          <img src="/images/business/volunteer-group.jpg" alt="2026 Gyeonggi Youth Climate Envoys group photo in Mongolia" />
        </figure>
        <figure class="ovh-shot">
          <img src="/images/business/volunteer-field.jpg?v=2" alt="Volunteers planting a tree with a local partner" />
        </figure>
        <figure class="ovh-shot">
          <img src="/images/business/volunteer-launch.jpg" alt="2025 Gyeonggi Youth Climate Envoy launch ceremony" />
        </figure>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/domestic': {
    title: 'Domestic Programs',
    content: `
<div class="domestic-page">
  <section class="domestic-hero">
    <div class="dom-wrap">
      <p class="domestic-kicker">Domestic Programs</p>
      <h1 class="domestic-title">Khayah connects opportunities for learning and practice,<br />walking with our neighbors as they lead change in their own lives and communities.</h1>
      <p class="domestic-lead">
        We connect education and support needed in domestic communities, working together so that participants' voices lead to local change.
      </p>
      <div class="domestic-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="domestic-section">
    <div class="dom-wrap">
      <ol class="domestic-list" aria-label="Core domestic program areas">
        <li class="domestic-item">
          <div class="domestic-num" aria-hidden="true">01</div>
          <div class="domestic-body">
            <h2 class="domestic-h2">Values-Oriented &amp; Future-Oriented Education</h2>
            <p class="domestic-desc">
              We identify problems and issues hidden within Korea's current social structure and education system, develop ways to address them, and run education development projects that prepare new value creation and the future.
            </p>
          </div>
        </li>

        <li class="domestic-item">
          <div class="domestic-num" aria-hidden="true">02</div>
          <div class="domestic-body">
            <h2 class="domestic-h2">Human-Centered &amp; Eco-Friendly Education</h2>
            <p class="domestic-desc">
              Khayah respects people as dignified agents, not as instruments of development. In every program we consider the present and future of local communities and the natural environment, and we reject indiscriminate development that does not coexist with ecosystems. We practice education in which human growth and nature’s sustainability go together.
            </p>
          </div>
        </li>

        <li class="domestic-item">
          <div class="domestic-num" aria-hidden="true">03</div>
          <div class="domestic-body">
            <h2 class="domestic-h2">Development Cooperation from Korea to the World</h2>
            <p class="domestic-desc">
              Through career exploration and capacity building, social entrepreneurship and self-reliance, and climate and environment education, we connect experience and expertise built in Korea to overseas development cooperation. We work so that what participants learn — adolescents and youth, migrant workers, North Korean defector youth, and others — can be applied to each region’s social and cultural context and needs, and can contribute to local communities.
            </p>
          </div>
        </li>
      </ol>

    </div>
  </section>
</div>
`,
  },
  'business/domestic/education': {
    title: 'Education',
    content: `
<div class="edu-page">
  <section class="edu-ref-hero">
    <div class="edu-wrap">
      <p class="edu-ref-hero__kicker">Domestic Programs · Education</p>
      <h1 class="edu-ref-hero__title">Together with local residents, we widen access to education<br />and build a foundation for communities to grow on their own.</h1>
      <p class="edu-ref-hero__desc">
        Through education, Khayah helps create both individual growth and community transformation.
        For migrant workers, North Korean defector youth, adolescents, and many other neighbors,
        we offer education and experiential opportunities rooted in social value so they can build their capacity and share what they learn.
      </p>
      <div class="edu-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="edu-ref-section">
    <div class="edu-wrap">
      <div class="edu-ref-grid">
        <div>
          <p class="edu-ref-label"><span class="edu-ref-label__badge">1</span> Education Program</p>
          <h2 class="edu-ref-h2">Career Exploration and Future-Skills Support</h2>
          <p class="edu-ref-sub">Self-understanding / Life Design / Foundational job skills / Career experience &amp; mentoring / Social &amp; cultural experience</p>
          <p class="edu-ref-p">
            We provide step-by-step career education so adolescents and young adults can understand themselves and shape their futures.
            From self-understanding to community and the world of work, exploration and planning help them discover their potential
            and turn chosen futures into concrete action.
          </p>
        </div>
        <div class="edu-ref-media" aria-hidden="true">
          <img class="edu-ref-media__img" src="/images/business/domestic-edu-2.jpg" alt="" loading="lazy" />
          <div class="edu-ref-media__caption">Career exploration and future-skills support</div>
        </div>
      </div>
    </div>
  </section>

  <section class="edu-ref-section is-flipped" style="background:rgba(250,247,248,0.7)">
    <div class="edu-wrap">
      <div class="edu-ref-grid">
        <div class="edu-ref-media" aria-hidden="true">
          <img class="edu-ref-media__img" src="/images/business/domestic-edu-1.jpg" alt="" loading="lazy" />
          <div class="edu-ref-media__caption">Social-value entrepreneurship and self-reliance</div>
        </div>
        <div>
          <p class="edu-ref-label"><span class="edu-ref-label__badge">2</span> Education Program</p>
          <h2 class="edu-ref-h2">Social-Value Entrepreneurship and Self-Reliance</h2>
          <p class="edu-ref-sub">Social business education / Domestic &amp; international entrepreneurship / International development cooperation education</p>
          <p class="edu-ref-p">
            Grounded in social value and entrepreneurial spirit, we support entrepreneurship and self-reliance for migrant workers, North Korean defector youth, and young people who have had fewer education and career opportunities.
            We walk with participants as they discover their experience and strengths, develop community needs into business ideas, and seek new career and activity paths at home and abroad.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="edu-ref-section">
    <div class="edu-wrap">
      <div class="edu-ref-grid">
        <div>
          <p class="edu-ref-label"><span class="edu-ref-label__badge">3</span> Education Program</p>
          <h2 class="edu-ref-h2">Climate and Environment Awareness and Action</h2>
          <p class="edu-ref-sub">Climate &amp; environment education / Thematic book clubs / Awareness content production &amp; distribution / Climate-response volunteer training and action</p>
          <p class="edu-ref-p">
            We support the growth of global citizens who understand the climate crisis and practice change in daily life and local communities.
            Through related education, book clubs, content creation, and volunteering, we help people connect environmental issues to their own lives,
            so individual action can lead to community and international cooperation.
          </p>
        </div>
        <div class="edu-ref-media" aria-hidden="true">
          <img class="edu-ref-media__img" src="/images/business/domestic-edu-3.jpg" alt="" loading="lazy" />
          <div class="edu-ref-media__caption">Climate and environment awareness and action</div>
        </div>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/advocacy': {
    title: 'Research',
    content: `
<div class="adv-page">
  <section class="adv-hero">
    <div class="adv-wrap">
      <p class="adv-kicker">Research</p>
      <h1 class="adv-title">We study field experience and develop methods<br />of education and development cooperation,<br />connecting them to practice that creates lasting change.</h1>
      <p class="adv-lead">
        Khayah studies methods of education and development cooperation so that people’s growth and community change stay connected.
        Questions found in the field shape education models and how programs are run, and that experience is shared back with the field.
        We link practice at home and overseas with research, and build a foundation for change that lasts.
      </p>
      <div class="adv-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="adv-methods" aria-label="Research program subpages">
    <div class="adv-wrap">
      <div class="adv-hub-cards">
        <article class="adv-hub-card">
          <div class="adv-hub-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3.4 2 8.4l10 5 10-5-10-5Zm-7.2 7.3v4.8c0 1.5 3.6 4 7.2 4s7.2-2.5 7.2-4v-4.8l-7.2 3.6-7.2-3.6Z" />
            </svg>
          </div>
          <h2 class="adv-hub-card__title">Education research</h2>
          <p class="adv-hub-card__desc">Education models and learning methods, participatory development cooperation, and knowledge sharing through the academy.</p>
          <a class="adv-hub-card__btn" href="/khayah/en/business/advocacy/education-research">Learn more</a>
        </article>
        <article class="adv-hub-card">
          <div class="adv-hub-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <h2 class="adv-hub-card__title">Social business</h2>
          <p class="adv-hub-card__desc">We explore structures of operation and enterprise through which social value can continue as practice.</p>
          <a class="adv-hub-card__btn" href="/khayah/en/business/advocacy/social-business">Learn more</a>
        </article>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/advocacy/social-business': {
    title: 'Social business',
    content: `
<div class="adv-page">
  <section class="adv-hero">
    <div class="adv-wrap">
      <p class="adv-kicker">Research · Social business</p>
      <h1 class="adv-title">Social business</h1>
      <div class="adv-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="adv-study" aria-label="Social business">
    <div class="adv-wrap">
      <article class="adv-study__card adv-study__card--solo">
        <div class="adv-study__body">
          <h2 class="adv-study__title">Social value and sustainability</h2>
          <ul class="adv-tags">
            <li>Social business</li>
            <li>Color &amp; Comfort (social enterprise)</li>
            <li>Social impact</li>
          </ul>
          <p class="adv-study__desc">We explore how programs can be run so that social value continues as practice. Drawing on social business experience, we look at how self-reliance and social results can stay connected.</p>
        </div>
      </article>
    </div>
  </section>
</div>
`,
  },
  'business/advocacy/education-research': {
    title: 'Education research',
    content: `
<div class="adv-page">
  <section class="adv-hero">
    <div class="adv-wrap">
      <p class="adv-kicker">Research · Education research</p>
      <h1 class="adv-title">Education research</h1>
      <p class="adv-lead">We study education models and learning methods, participatory development cooperation, and knowledge sharing through the academy.</p>
      <div class="adv-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="adv-study" aria-label="Education research">
    <div class="adv-wrap">
      <ol class="adv-study__list">
        <li class="adv-study__card">
          <p class="adv-study__no">01</p>
          <div class="adv-study__body">
            <h2 class="adv-study__title">Education models and learning methods</h2>
            <ul class="adv-tags">
              <li>Dream Seekers</li>
              <li>Life Design</li>
              <li>E-learning (SEEM)</li>
              <li>Peer learning</li>
            </ul>
            <p class="adv-study__desc">We study education models that help participants understand themselves and apply what they learn to life. Field experience is shaped into curricula and content, then revised.</p>
          </div>
        </li>
        <li class="adv-study__card">
          <p class="adv-study__no">02</p>
          <div class="adv-study__body">
            <h2 class="adv-study__title">Participatory development cooperation</h2>
            <ul class="adv-tags">
              <li>International development cooperation</li>
              <li>Expert groups</li>
              <li>Perspectives and methods of development</li>
            </ul>
            <p class="adv-study__desc">We study how to research, plan, carry out, and evaluate programs on the basis of residents’ participation and leadership. The approach seeks to understand local context and strengthen local capacity.</p>
          </div>
        </li>
        <li class="adv-study__card">
          <p class="adv-study__no">03</p>
          <div class="adv-study__body">
            <h2 class="adv-study__title">Knowledge sharing and the academy</h2>
            <ul class="adv-tags">
              <li>Khayah Academy</li>
              <li>Education on development cooperation and ODA</li>
              <li>Lectures and seminars</li>
            </ul>
            <p class="adv-study__desc">Field experience and research are shared through lectures, seminars, and learning materials. Practitioners and participants learn together and build expertise in development cooperation.</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</div>
`,
  },
  'business/projects': {
    title: 'Active Projects',
    content: '<p>Explore Khayah’s ongoing work in Korea and overseas, and the stories behind each program.</p><p><a href="/khayah/en/business/projects/nepal">Nepal</a> · <a href="/khayah/en/business/projects/myanmar">Myanmar</a> · <a href="/khayah/en/business/projects/kyrgyzstan">Kyrgyzstan</a> · <a href="/khayah/en/business/projects/domestic">Domestic</a></p>',
  },
  'business/projects/nepal': {
    title: 'Nepal',
    content: '<p>We run local education, health, and community development programs in Nepal.</p>',
  },
  'business/projects/myanmar': {
    title: 'Myanmar',
    content: '<p>We run education and health programs in Myanmar, including Dream Library support for youth in urban slum villages.</p>',
  },
  'business/projects/kyrgyzstan': {
    title: 'Kyrgyzstan',
    content: '<p>We run programs in Kyrgyzstan including STEM capacity building for urban slum students and youth projects.</p>',
  },
  'business/projects/domestic': {
    title: 'Domestic',
    content: '<p>Information about our domestic programs.</p>',
  },
  'support/guide': {
    title: 'Donor Guide',
    content: DONOR_GUIDE_PAGE_HTML,
  },
  'support/apply': {
    title: 'Apply to Donate',
    content: '<p>Information about applying to donate and monthly giving. Contact: khayahinternational@gmail.com / 070.5121.2198</p>',
  },
  'news': {
    title: 'News',
    content: '<p>Find Khayah\'s latest updates, announcements, activity news, and annual newsletter.</p><p><a href="/khayah/en/news/announcements">Announcements</a> · <a href="/khayah/en/news/activities">Activities</a> · <a href="/khayah/en/news/newsletter">Newsletter</a> · <a href="/khayah/en/news/press">Press</a></p>',
  },
  'news/activities': {
    title: 'Activities',
    content: '<p>Stories from Khayah\'s daily work and programs on the ground.</p>',
  },
  'news/newsletter': {
    title: 'Annual Newsletter',
    content: '<p>Stories of change from communities around the world, shared through Khayah\'s annual newsletter.</p>',
  },
  'news/press': {
    title: 'Press',
    content: '<p>Media coverage and press releases.</p>',
  },
  'news/inquiry': {
    title: 'Contact Us',
    content: '',
  },
  'together': {
    title: 'Join Khayah',
    content: '<p>Ways to join Khayah. <a href="/khayah/en/news/announcements">Announcements</a> · <a href="/khayah/en/news/activities">Activities</a></p>',
  },
  'together/announcements': {
    title: 'Announcements',
    content: '<p>Announcements related to joining Khayah.</p>',
  },
  'together/news': {
    title: 'Khayah News',
    content: '<p>Khayah news listing.</p>',
  },
}
