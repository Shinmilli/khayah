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
    <svg class="vmv-hero-cross" viewBox="0 0 120 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="48" y="0" width="24" height="400" fill="#fff"/>
      <rect x="0" y="100" width="120" height="24" fill="#fff"/>
    </svg>
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
  <div class="intro-strip">
    <span class="intro-strip-label">KHAYAH Foundation</span>
    <div class="intro-strip-divider"></div>
    <span class="intro-strip-label">Sharing · Service · Love</span>
  </div>
  <div class="content">
    <div class="main-grid">
      <aside class="sidebar">
        <h2 class="sidebar-title">
          With a heart<br>
          <em>that walks together</em>
        </h2>
        <p class="sidebar-meta">
          Khayah (KHAYAH)<br>
          CEO Choi Soon-tae<br><br>
          For the practice of<br>
          sharing and service
        </p>
        <span class="sidebar-tag">Representative's Message</span>
      </aside>
      <article class="article">
        <p class="article-lead">
          Helping others is never as easy as it may seem when we hear or read about it somewhere. We must give up part of what we worked hard to earn, or carve out precious time from our lives. Yet the reward for that difficult work is unlike any other.
        </p>
        <p class="article-body">
          Since making sharing and service my life's work, one of the questions I am asked most often is, &lsquo;How did you end up doing this kind of work?&rsquo; People usually look as though they cannot quite understand. My answer is always simple: &lsquo;If you have the same experience I did, you will know the answer.&rsquo; It may sound matter-of-fact, but I have always been able to answer sincerely and with gratitude.
        </p>
        <p class="article-body">
          Most of us have helped an elderly person carrying a heavy load on the street at least once. It is not a difficult or extraordinary thing. How did it make you feel? In making sharing my vocation, I live every moment with that same feeling. Saving a life, watching a student grow up smiling because of my help — nothing in this world compares to that joy.
        </p>
        <p class="article-body">
          I ask you to look around you right now. Within just a few minutes, or a few hours, there are so many neighbors who could brighten with a smile through your attention and a small act of kindness. Do not hesitate to reach out to them. This is never something to put off until &lsquo;later,&rsquo; &lsquo;when I have more money,&rsquo; or &lsquo;when I have more time.&rsquo; Sharing is something you can do right now — even without money, even without much time, at any moment.
        </p>
        <p class="article-body">
          Every life in this world is a precious creation of God, and caring for those who suffer and helping them is a calling every person on this earth should carry in their heart. Like the name Khayah, which means to live again, I pray that true revival — Khayah — may sweep through your life as well.
        </p>
      </article>
    </div>
  </div>
  <section class="sig-section">
    <div class="sig-inner">
      <p class="sig-quote">&ldquo;Together with Khayah, I pray that<br>true sharing and true change<br>will come to your life as well.&rdquo;</p>
      <div class="sig-info">
        <p class="sig-role">CEO, KHAYAH</p>
        <p class="sig-name">Choi Soon-tae</p>
        <p class="sig-name-ko">최 순 태</p>
        <div class="sig-line"></div>
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
  'about/org-chart': {
    title: 'Org Chart',
    content: KHAYAH_ORG_BOARD_MERGED_HTML,
  },
  'about/directors': {
    title: 'Board of Directors / Expert Advisors',
    content: KHAYAH_ORG_BOARD_MERGED_HTML,
  },
  'business/overseas': {
    title: 'Overseas Programs',
    content: `
<div class="overseas-page">
  <section class="overseas-hero">
    <div class="ov-wrap">
      <p class="overseas-kicker">Overseas Programs</p>
      <h1 class="overseas-title">Khayah works so that marginalized neighbors around the world<br />can become agents of change.</h1>
      <p class="overseas-lead">
        Khayah goes beyond simple aid, pursuing development cooperation in which we learn and act together with local communities.
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
              Rather than a donor-beneficiary relationship, we learn from one another through participation and cooperation.
            </p>
          </div>
        </li>

        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">02</div>
          <div>
            <h2 class="overseas-h2">Integration with Local Communities</h2>
            <p class="overseas-desc">
              True change is possible only when local residents' will to participate and their right understanding of that change are supported.
              For this reason, Khayah makes integration with local communities an essential step in every project and fosters their voluntary participation.
            </p>
          </div>
        </li>

        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">03</div>
          <div>
            <h2 class="overseas-h2">Participatory Methodology</h2>
            <p class="overseas-desc">
              We use participatory methods that involve local residents throughout the entire project cycle — research, analysis, planning, implementation, and monitoring &amp; evaluation.
            </p>
          </div>
        </li>

        <li class="overseas-item">
          <div class="overseas-num" aria-hidden="true">04</div>
          <div>
            <h2 class="overseas-h2">Sustainability</h2>
            <p class="overseas-desc">
              We study the full project cycle and seek answers so that development cooperation can be sustainable.
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>

  <section class="overseas-cta" aria-label="Overseas program subpages">
    <div class="ov-wrap">
      <div class="overseas-cards">
        <div class="overseas-card">
          <div class="overseas-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3.4 2 8.4l10 5 10-5-10-5Zm-7.2 7.3v4.8c0 1.5 3.6 4 7.2 4s7.2-2.5 7.2-4v-4.8l-7.2 3.6-7.2-3.6Z"/>
            </svg>
          </div>
          <h2 class="overseas-card__title">Education</h2>
          <p class="overseas-card__desc">Khayah runs various education programs to build a foundation of local residents' will to participate and a right understanding of change.</p>
          <a class="overseas-card__btn" href="/business/overseas/education">Learn more</a>
        </div>

        <div class="overseas-card">
          <div class="overseas-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm1.1 5.6h-2.2v3.3H7.6v2.2h3.3v3.3h2.2v-3.3h3.3v-2.2h-3.3V7.6Z"/>
            </svg>
          </div>
          <h2 class="overseas-card__title">Health Care</h2>
          <p class="overseas-card__desc">Khayah focuses on building residents' capacity to take the lead in improving nutrition, public hygiene, and housing conditions.</p>
          <a class="overseas-card__btn" href="/business/overseas/health-care">Learn more</a>
        </div>

        <div class="overseas-card">
          <div class="overseas-icon" aria-hidden="true">
            <span class="material-symbols-outlined">public</span>
          </div>
          <h2 class="overseas-card__title">Active Projects</h2>
          <p class="overseas-card__desc">All of Khayah's overseas projects are people-centered, researched and carried out with the goal that communities and residents reach ultimate self-reliance.</p>
          <a class="overseas-card__btn" href="/business/projects">Learn more</a>
        </div>
      </div>
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
        <h2 class="ov-edu-head__ko">Foundational\nCapacity Building</h2>
        <div>
          <p class="ov-edu-head__en">Power to accept change</p>
          <p class="ov-edu-head__p">
            For a person or community to change, they must first have the capacity to accept that change.
            Khayah focuses on strengthening the foundational capacity of all participants through diverse programs,
            which becomes a great source of strength in the many hardships they face in life.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="Foundational capacity building components">
        <div class="ov-edu-table__row" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Life Skills</p>
            <p class="ov-edu-cell__p" role="cell">
              Basic education in communication, interpersonal relations, financial management, health care, problem-solving, and other essentials for daily life
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Reading Club (Dream Attic)</p>
            <p class="ov-edu-cell__p" role="cell">
              Participants read books provided through Life Skills education, discuss together, and broaden their thinking through mutual learning
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Mentoring</p>
            <p class="ov-edu-cell__p" role="cell">
              Drawing on a pool of local experts who work with Khayah, we provide diverse mentoring for youth in the fields they need
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

  <section class="ov-edu-section" style="background:rgba(0,0,0,0.03)">
    <div class="ov-edu-wrap">
      <div class="ov-edu-head">
        <h2 class="ov-edu-head__ko">Tailored\nVocational Training</h2>
        <div>
          <p class="ov-edu-head__en">Dream Seekers</p>
          <p class="ov-edu-head__p">
            Khayah designs tailored vocational skills programs after thorough research and analysis,
            taking into account the business environment in the supported region while respecting the diversity of local residents.
          </p>
        </div>
      </div>

      <div class="ov-edu-table" role="table" aria-label="Tailored vocational training components">
        <div class="ov-edu-table__row ov-edu-table__row--2" role="rowgroup">
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Participant-Tailored</p>
            <p class="ov-edu-cell__p" role="cell">
              Youth who have never had the chance to think about how to live or what career to choose, due to lack of proper education,
              are given opportunities through diverse programs to discover their aptitudes and prepare for work
            </p>
          </div>
          <div class="ov-edu-cell" role="row">
            <p class="ov-edu-cell__head" role="columnheader">Enterprise-Tailored</p>
            <p class="ov-edu-cell__p" role="cell">
              In partnership with promising industries and companies in the project country and region,
              we connect the poor with jobs and companies with trained skilled workers, contributing to local economic development
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
        <h2 class="ov-edu-head__ko">Education Quality\nImprovement</h2>
        <div>
          <p class="ov-edu-head__en">Better learning environment</p>
          <p class="ov-edu-head__p">
            The quality of learning is connected to the environment beyond the classroom.
            Khayah supports education suited to local conditions so that students and teachers can learn and grow in better environments.
          </p>
        </div>
      </div>

      <div class="ov-edu-quality" aria-label="Education quality improvement examples">
        <div class="ov-edu-qcard">
          <h3 class="ov-edu-qcard__title">Learning Environment Improvement</h3>
          <p class="ov-edu-qcard__p">
            We assess basic infrastructure in classrooms and learning spaces and work together on improvements that can be sustained on the ground.
          </p>
        </div>
        <div class="ov-edu-qcard">
          <h3 class="ov-edu-qcard__title">Teaching Capacity Building</h3>
          <p class="ov-edu-qcard__p">
            We strengthen the capacity of teachers and learning support staff and provide materials and methods so that student-centered lessons can spread.
          </p>
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
  'business/overseas/health-care': {
    title: 'Health Care',
    content: `
<div class="ov-health-page">
  <section class="ov-health-hero">
    <div class="ov-health-wrap">
      <p class="ov-health-kicker">Overseas Programs · Health Care</p>
      <h1 class="ov-health-title">We build residents' health capacity to improve nutrition,<br />public hygiene, and housing conditions.</h1>
      <p class="ov-health-desc">
        The regions Khayah supports are urban slum villages with extremely poor health environments even among developing countries.
        Rather than one-time medical service support, Khayah focuses on community-based participatory health care projects
        that guide residents to create clean health environments themselves — seeking more fundamental solutions.
      </p>
      <div class="ov-health-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="ovh-block ovh-block--ltr">
    <div class="ov-health-wrap">
      <div class="ovh-block__head ovh-block__head--cols-4">
        <h2 class="ovh-block__title">Community-Based\nParticipatory\nHealth Care</h2>
        <p class="ovh-block__desc">
          Building local residents' capacity for self-care through health promotion activities by community organizations linked to primary health care facilities
        </p>
      </div>

      <div class="ovh-cards ovh-cards--scroll" aria-label="Key activities" tabindex="0">
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 16c-2-4-7-5-12-3-3 1-5 4-5 8 0 1 0 2 1 3-2 1-4 4-5 7-2 4-2 9-1 14 1 7 6 13 11 13 2 0 3-1 5-1s2 1 5 1c5 0 10-6 11-13 1-5 1-10-1-14-1-3-3-6-5-7 1-1 1-2 1-3 0-4-2-7-5-8-5-2-10-1-12 3z"/><path d="M30 14c-1-3-1-5 0-7 2-1 4-1 5 1 1 2 0 4-1 6-1 1-3 1-4 0z"/></svg>
          </div>
          <p class="ovh-card__label">Nutrition improvement activities</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 8 8 28v28h18V40h12v16h18V28z"/></svg>
          </div>
          <p class="ovh-card__label">Public hygiene &amp; housing environment improvement</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 6 4 18l4 2v12l-4 2v6l28 12 28-12v-6l-4-2V20zM12 24l20 8 20-8v8L32 40 12 32z"/></svg>
          </div>
          <p class="ovh-card__label">Basic health education &amp; awareness activities</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 4 8 14v18c0 14 10 24 24 28 14-4 24-14 24-28V14zm-3 16h6v8h8v6h-8v8h-6v-8h-8v-6h8z"/></svg>
          </div>
          <p class="ovh-card__label">Region-specific disease prevention &amp; management</p>
        </div>
      </div>
    </div>
  </section>

  <section class="ovh-block ovh-block--rtl ovh-block--alt">
    <div class="ov-health-wrap">
      <div class="ovh-block__head ovh-block__head--cols-5">
        <p class="ovh-block__desc">We run programs to reduce maternal and infant mortality rates.</p>
        <h2 class="ovh-block__title">Maternal &amp; Child Health</h2>
      </div>

      <div class="ovh-cards ovh-cards--cols-5 ovh-cards--white" aria-label="Key activities">
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><circle cx="32" cy="12" r="6"/><path d="M40 26c0-3-3-6-8-6s-8 3-8 6v6c-3 2-6 6-6 12 0 5 3 8 6 8v8h16v-8c3 0 6-3 6-8 0-6-3-10-6-12z"/></svg>
          </div>
          <p class="ovh-card__label">Prenatal &amp; postnatal care</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 56C18 46 6 36 6 22c0-7 5-12 12-12 6 0 10 4 14 10 4-6 8-10 14-10 7 0 12 5 12 12 0 14-12 24-26 34z"/><circle cx="22" cy="22" r="3" fill="#fff"/><circle cx="42" cy="22" r="3" fill="#fff"/></svg>
          </div>
          <p class="ovh-card__label">Family planning &amp; reproductive health</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M8 56V22l24-12 24 12v34H40V40H24v16zm21-26h6v6h6v6h-6v6h-6v-6h-6v-6h6z"/></svg>
          </div>
          <p class="ovh-card__label">Support for facility-based delivery</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M22 4h20v8h-2v6c4 2 6 6 6 12v24c0 4-2 6-6 6H24c-4 0-6-2-6-6V30c0-6 2-10 6-12v-6h-2zm6 8v8h8v-8zm-4 18v6h16v-6zm0 12v6h16v-6z"/></svg>
          </div>
          <p class="ovh-card__label">Nutrition improvement for mothers &amp; infants</p>
        </div>
        <div class="ovh-card">
          <div class="ovh-card__icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="currentColor"><path d="M48 4 44 8l-4-4-4 4 4 4-20 20-4-2-4 4 14 14 4-4-2-4 20-20 4 4 4-4-4-4 4-4zM12 46l-6 6 4 4 6-6z"/></svg>
          </div>
          <p class="ovh-card__label">Infant immunization &amp; health management education</p>
        </div>
      </div>
    </div>
  </section>

  <section class="ovh-block ovh-block--center">
    <div class="ov-health-wrap">
      <div class="ovh-block__head">
        <h2 class="ovh-block__title">School Health</h2>
        <p class="ovh-block__desc">
          We run school-based health activities for healthy physical development and proper eating habits<br />among school-age children and adolescents.
        </p>
      </div>

      <ol class="ovh-numlist" aria-label="School health key activities">
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">Physical examinations</span></li>
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">Hygiene &amp; basic health education</span></li>
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">Adolescent sexual health education</span></li>
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">Health seminars for parents &amp; teachers</span></li>
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">Health booklet development &amp; distribution</span></li>
        <li class="ovh-numlist__item"><span class="ovh-numlist__label">Physical activity support · Health Scout wellness programs</span></li>
      </ol>
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
      <h1 class="domestic-title">Khayah works so that marginalized neighbors across Korea<br />can become agents of change.</h1>
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
              We honor human dignity while remembering that humans are also part of nature. Khayah rejects frameworks that treat people as resources or tools, and all projects are developed with environmental protection at their foundation.
            </p>
          </div>
        </li>

        <li class="domestic-item">
          <div class="domestic-num" aria-hidden="true">03</div>
          <div class="domestic-body">
            <h2 class="domestic-h2">Linking Domestic Programs to Overseas Development Cooperation</h2>
            <p class="domestic-desc">
              Programs such as skills and entrepreneurship training for migrant workers and first steps in social business for North and South Korean youth connect to overseas development cooperation — equipping participants with socially valuable skills and entrepreneurship that can contribute to local development when they work in developing countries.
            </p>
          </div>
        </li>
      </ol>

    </div>
  </section>

  <section class="domestic-cta" aria-label="Domestic program subpages">
    <div class="dom-wrap">
      <div class="domestic-cards">
        <div class="domestic-card">
          <div class="domestic-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3.4 2 8.4l10 5 10-5-10-5Zm-7.2 7.3v4.8c0 1.5 3.6 4 7.2 4s7.2-2.5 7.2-4v-4.8l-7.2 3.6-7.2-3.6Z"/>
            </svg>
          </div>
          <h2 class="domestic-card__title">Education</h2>
          <p class="domestic-card__desc">
            Khayah runs innovative education programs so that marginalized neighbors can grow with ways and values for thriving as members of society and nature.
          </p>
          <a class="domestic-card__btn" href="/business/domestic/education">Learn more</a>
        </div>

        <div class="domestic-card">
          <div class="domestic-card__icon" aria-hidden="true">
            <span class="material-symbols-outlined">public</span>
          </div>
          <h2 class="domestic-card__title">Active Projects</h2>
          <p class="domestic-card__desc">
            All of Khayah's domestic projects are researched and carried out with people, nature, and the future at their center.
          </p>
          <a class="domestic-card__btn" href="/business/projects">Learn more</a>
        </div>
      </div>
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
      <h1 class="edu-ref-hero__title">We provide diverse education programs<br />so our neighbors can carry their dreams and hope forward.</h1>
      <p class="edu-ref-hero__desc">
        Khayah seeks to create both individual growth and community transformation through education.
        For migrant workers, North Korean defector youth, adolescents, and many other neighbors in Korea,
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
          <h2 class="edu-ref-h2">Migrant Worker Rights &amp; Empowerment</h2>
          <p class="edu-ref-sub">Skills &amp; entrepreneurship training, cultural exploration, awareness programs</p>
          <p class="edu-ref-p">
            We provide migrant workers in Korea with skills and entrepreneurship training rooted in social value,
            so that through their activities after returning home they can contribute to local community development and sharing with those who are marginalized.
          </p>
        </div>
        <div class="edu-ref-media" aria-hidden="true">
          <img class="edu-ref-media__img" src="/images/business/domestic-edu-1.jpg" alt="" loading="lazy" />
          <div class="edu-ref-media__caption">Program on the ground</div>
        </div>
      </div>
    </div>
  </section>

  <section class="edu-ref-section is-flipped" style="background:rgba(250,247,248,0.7)">
    <div class="edu-wrap">
      <div class="edu-ref-grid">
        <div class="edu-ref-media" aria-hidden="true">
          <img class="edu-ref-media__img" src="/images/business/domestic-edu-2.jpg" alt="" loading="lazy" />
          <div class="edu-ref-media__caption">Education &amp; mentoring</div>
        </div>
        <div>
          <p class="edu-ref-label"><span class="edu-ref-label__badge">2</span> Education Program</p>
          <h2 class="edu-ref-h2">North Korean Defector Youth Entrepreneurship</h2>
          <p class="edu-ref-sub">Social business, domestic &amp; international entrepreneurship, international development cooperation education</p>
          <p class="edu-ref-p">
            Through social business education rooted in social value and entrepreneurial spirit,
            we help North Korean defector youth build pride as members of Korean society while exploring diverse paths at home and abroad.
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
          <h2 class="edu-ref-h2">Youth Future Education</h2>
          <p class="edu-ref-sub">Democratic citizenship &amp; global citizenship</p>
          <p class="edu-ref-p">
            A 2017 KDI (Korea Development Institute) survey found that 80% of Korean university students remember their high school years as a 'battlefield.'
            In a society where competition is taken for granted, we run programs that help young people grow into true democratic and global citizens.
          </p>
        </div>
        <div class="edu-ref-media" aria-hidden="true">
          <img class="edu-ref-media__img" src="/images/business/domestic-edu-3.jpg" alt="" loading="lazy" />
          <div class="edu-ref-media__caption">Youth growth program</div>
        </div>
      </div>
    </div>
  </section>
</div>
`,
  },
  'business/advocacy': {
    title: 'Advocacy',
    content: `
<div class="adv-page">
  <section class="adv-hero">
    <div class="adv-wrap">
      <p class="adv-kicker">Advocacy</p>
      <h1 class="adv-title">We nurture global citizens who understand<br />the values of respect, cooperation, and sharing.</h1>
      <p class="adv-desc">
        Khayah's advocacy helps the public and youth understand international development cooperation,
        learn the values of respect, cooperation, and sharing for neighbors around the world,
        and grow into responsible global citizens.
      </p>
      <div class="adv-divider" aria-hidden="true"></div>
    </div>
  </section>

  <section class="adv-block adv-block--ltr">
    <div class="adv-wrap">
      <div class="adv-block__head">
        <div class="adv-block__title-wrap">
          <p class="adv-block__en">International Development &amp; ODA</p>
          <h2 class="adv-block__title">International Development\nCooperation &amp; ODA</h2>
        </div>
        <p class="adv-block__desc">
          For elementary, middle, and high school students and the general public interested in overseas service and civic engagement,
          we introduce international development cooperation and Korea's ODA, examine their current state and challenges,
          and teach the mindset and methods for right cooperation — with the goal that all citizens embrace their responsibility as global citizens.
        </p>
      </div>
    </div>
  </section>

  <section class="adv-block adv-block--rtl adv-block--alt">
    <div class="adv-wrap">
      <div class="adv-block__head">
        <p class="adv-block__desc">
          Khayah believes that international development cooperation and NGO work can be practical tools for overseas missionaries.
          Through our M&amp;N program, we study professional mission approaches through development cooperation and NGO activity,
          and work with missionaries preparing for overseas assignment through lectures, seminars, and other methods
          to research right development and practical mission.
        </p>
        <div class="adv-block__title-wrap">
          <p class="adv-block__en">Mission &amp; NGOs</p>
          <h2 class="adv-block__title">M&amp;N Program</h2>
        </div>
      </div>

      <ol class="adv-numlist" aria-label="Mission & NGOs research topics">
        <li class="adv-numlist__item"><span class="adv-numlist__label">What is right development?</span></li>
        <li class="adv-numlist__item"><span class="adv-numlist__label">Help from outside vs. help from within</span></li>
        <li class="adv-numlist__item"><span class="adv-numlist__label">Relief vs. community development</span></li>
        <li class="adv-numlist__item"><span class="adv-numlist__label">Aid effectiveness vs. development effectiveness</span></li>
        <li class="adv-numlist__item"><span class="adv-numlist__label">Kingdom values and transformative development</span></li>
        <li class="adv-numlist__item"><span class="adv-numlist__label">Development cooperation and holistic approach</span></li>
        <li class="adv-numlist__item"><span class="adv-numlist__label">Self-reliance and sustainability</span></li>
        <li class="adv-numlist__item adv-numlist__item--wide">
          <span class="adv-numlist__label">
            Building professionalism in development cooperation
            <span class="adv-numlist__sub">(feasibility studies, project proposal planning and writing, budget management, results management, etc.)</span>
          </span>
        </li>
      </ol>
    </div>
  </section>
</div>
`,
  },
  'business/projects': {
    title: 'Active Projects',
    content: '<p>Explore our current projects by region and field.</p><p><a href="/business/projects/nepal">Nepal</a> · <a href="/business/projects/myanmar">Myanmar</a> · <a href="/business/projects/kyrgyzstan">Kyrgyzstan</a> · <a href="/business/projects/domestic">Domestic</a></p>',
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
    content: '<p>Information about applying to donate and monthly giving. Contact: khayahkorea@gmail.com / 031 689 3639</p>',
  },
  'news': {
    title: 'News',
    content: '<p>Find Khayah\'s latest updates, announcements, activity news, annual newsletter, and financial reports.</p><p><a href="/news/announcements">Announcements</a> · <a href="/news/activities">Activities</a> · <a href="/news/newsletter">Newsletter</a> · <a href="/news/press">Press</a> · <a href="/news/financial-report">Financial Report</a></p>',
  },
  'news/activities': {
    title: 'Activities',
    content: '<p>Stories from Khayah\'s daily work and programs on the ground.</p>',
  },
  'news/newsletter': {
    title: 'Annual Newsletter',
    content: '<p>Stories of change from communities around the world, shared through Khayah\'s annual newsletter.</p>',
  },
  'news/financial-report': {
    title: 'Financial Report',
    content: '<p>Annual financial reports and program reports.</p>',
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
    content: '<p>Ways to join Khayah. <a href="/news/announcements">Announcements</a> · <a href="/news/activities">Activities</a></p>',
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
