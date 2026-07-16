import { useEffect, useRef, useState, type ReactElement } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import nexustradeVideo from '../assets/videos/nexustrade.mp4';
import planoraVideo from '../assets/videos/planora.mp4';
import {
  Github,
  ArrowUpRight,
  ChevronDown,
  Target,
  Layers,
  Compass,
  Network,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ImageIcon,
  Play,
  type LucideIcon,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const GOLD = '#D4A853';
const INK = '#F0EDE6';
const MUTE = '#8A8A9A';

/* ── Types ───────────────────────────────────────────────────────── */

interface ProjectLink {
  label: 'Source' | 'Live Demo';
  url: string;
}

interface DecisionItem {
  title: string;
  detail: string;
}

interface CaseStudy {
  overview: string;
  problem: string;
  solution: string;
  /** Drop the real architecture diagram at this path in /public/media/. Falls back to a generated diagram until it exists. */
  architectureImage: string;
  decisions: DecisionItem[];
  challenges: DecisionItem[];
  implementation: string[];
  lessonsLearned: string[];
  /** Optional extra screenshots — only rendered when non-empty. Drop images in /public/media/. */
  screenshots?: string[];
}

interface Project {
  id: 'nexustrade' | 'planora';
  featured: boolean;
  eyebrow: string;
  title: string;
  valueLine: string;
  /** What it does, not what it's built with — a handful of capabilities, not a tech-tag wall. */
  capabilities: string[];
  stack: string[];
  links: ProjectLink[];
  /** Drop an autoplaying mobile-app preview (mp4/webm, portrait) at this path in /public/media/. */
  videoSrc: string;
  caseStudy: CaseStudy;
}

/* ── Data ────────────────────────────────────────────────────────── */

const projects: Project[] = [
  {
    id: 'nexustrade',
    featured: true,
    eyebrow: 'Featured · Distributed Systems',
    title: 'NexusTrade',
    valueLine:
      'A cryptocurrency exchange simulated as nine cooperating services — event-driven, horizontally decomposed, built to mirror how real exchanges scale.',
    capabilities: [
      'Event-Driven Architecture',
      'Real-Time Order Matching',
      'Distributed Consistency',
      'Live Market Data',
    ],
    stack: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Kafka', 'WebSockets', 'JWT', 'Docker'],
    links: [{ label: 'Source', url: 'https://github.com/ahsanrind01/NexusTrade' }],
    videoSrc: nexustradeVideo,
    caseStudy: {
      overview:
        'A from-scratch simulation of a crypto exchange, split into nine independently deployable services sitting behind a single API gateway — built to learn and demonstrate the architecture real exchanges run in production.',
      problem:
        'Centralized trading backends buckle under concurrent order flow because matching, wallets, and ledger writes all fight over the same database and the same locks. One slow query anywhere becomes a slow exchange everywhere.',
      solution:
        'Split matching, wallets, and ledger writes into nine services that share no database and communicate only through Kafka events — so one slow or failing service can never take the whole exchange down with it. An in-memory matching engine handles price-time-priority matching at microsecond latency, streaming depth and price updates to clients over WebSockets.',
      architectureImage: '/media/nexustrade-architecture.png',
      decisions: [
        {
          title: 'Event-driven over request/response',
          detail: 'Kafka as the backbone so wallet, ledger, and order services stay consistent without distributed transactions.',
        },
        {
          title: 'In-memory matching engine',
          detail: 'The order book lives in memory for microsecond-level matching, with WebSockets streaming price and depth to clients live.',
        },
        {
          title: 'Redis for speed, Postgres for truth',
          detail: 'Balances are cached in Redis for fast reads, but every cent is reconciled against an append-only Postgres ledger of record.',
        },
      ],
      challenges: [
        {
          title: 'Balance drift under concurrency',
          detail: 'Idempotent event consumers and scheduled reconciliation jobs keep cached balances honest against the ledger.',
        },
        {
          title: 'Simulating real liquidity',
          detail: 'A liquidity bot places counter-orders continuously so the book never sits empty during testing.',
        },
        {
          title: 'Exactly-once-ish processing',
          detail: 'Kafka consumer offsets plus idempotency keys prevent double-processing across services with no shared transactions.',
        },
      ],
      implementation: [
        'Type-safe schema and queries across every service via Drizzle ORM.',
        'The matching engine runs as a deterministic reducer over incoming order events, making it fully reproducible in tests.',
        'Stripe handles funding deposits into the wallet service.',
      ],
      lessonsLearned: [
        "Idempotency isn't optional in event-driven systems — Kafka's at-least-once delivery means every consumer has to expect and safely ignore duplicates.",
        'Caches lie eventually. Redis balances are fast, but only the append-only Postgres ledger is ever allowed to be the source of truth.',
        'Running a liquidity bot taught more about market microstructure than any tutorial — someone has to sit on both sides of every trade.',
      ],
      screenshots: [],
    },
  },
  {
    id: 'planora',
    featured: false,
    eyebrow: 'Secondary · Full-Stack Marketplace',
    title: 'Planora',
    valueLine:
      'One app, two experiences — customers book local services instantly, while business owners run their entire operation from the same codebase.',
    capabilities: ['Role-Based Experiences', 'Real-Time Chat', 'Payment-Gated Bookings', 'Push Notifications'],
    stack: ['React', 'React Native', 'Node.js', 'Express', 'MongoDB', 'Firebase'],
    links: [
      { label: 'Live Demo', url: 'https://appetize.io/app/ios/com.ahsanrind.mobileapp?device=iphone15promax&osVersion=17.2&toolbar=true' },
      { label: 'Source', url: 'https://github.com/ahsanrind01/Planora' },
    ],
    videoSrc: planoraVideo,
    caseStudy: {
      overview:
        'A mobile-first, two-sided marketplace where a single codebase serves two completely different experiences — customers booking appointments, and business owners running their shop — split cleanly by role at the routing layer.',
      problem:
        'Most marketplace side-projects only build the consumer half. The harder, more valuable problem is the operator side — schedules, real-time conversations with customers, and getting paid — without maintaining two separate apps.',
      solution:
        'One React Native/Expo app routes each user into a customer flow or a manager flow based on role, backed by a single Node/Express API, MongoDB for data, and Socket.IO for realtime chat — one deployable app instead of two, with Stripe PaymentIntents confirming payment before any booking is ever persisted.',
      architectureImage: '/media/planora-architecture.png',
      decisions: [
        {
          title: 'Shared codebase, split by role',
          detail: 'One deployable app instead of two, cutting duplication between the customer and business-owner experiences.',
        },
        {
          title: 'Decoupled chat delivery',
          detail: 'An internal event bus sits between Socket.IO and the notification system, so a dropped socket never means a lost message.',
        },
        {
          title: 'Payment-gated bookings',
          detail: 'Stripe PaymentIntents confirm payment before a booking is ever persisted — no such thing as an unpaid confirmed booking.',
        },
      ],
      challenges: [
        {
          title: 'One codebase, two UX paths',
          detail: 'Keeping shared logic readable across very different customer and manager flows without duplicating it.',
        },
        {
          title: 'Reliable realtime on mobile',
          detail: 'Real-time chat had to stay consistent across the spotty connections mobile networks are known for.',
        },
        {
          title: 'Exactly-once notifications',
          detail: 'Push (Expo) and email (SendGrid) had to fire exactly once per booking-lifecycle event, not zero or two.',
        },
      ],
      implementation: [
        'Expo push tokens registered per device and tied to booking-lifecycle events.',
        'JWT auth issues role-scoped tokens shared across both the customer and manager flows.',
        'A booking-lifecycle state machine drives every downstream notification.',
      ],
      lessonsLearned: [
        'Shared code is only a win if both flows stay legible on their own — some duplication was the more honest choice.',
        'Mobile sockets drop constantly; decoupling delivery from Socket.IO with an event bus paid for itself within the first week.',
        'Gating bookings on confirmed payment upfront eliminated an entire class of support tickets before they could exist.',
      ],
      screenshots: [],
    },
  },
];

/* ── Fallback architecture diagrams (shown until a real diagram image is added, or on load error) ── */

function PlanoraDiagram() {
  return (
    <svg viewBox="0 0 400 150" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
      <line x1="82" y1="75" x2="200" y2="75" stroke={GOLD} strokeOpacity="0.35" strokeWidth="1" />
      <line x1="200" y1="75" x2="318" y2="75" stroke={GOLD} strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="200" cy="75" r="30" fill="rgba(212,168,83,0.06)" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1.2" />
      <text x="200" y="72" textAnchor="middle" fill={INK} fontSize="9" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.5">
        PLANORA
      </text>
      <text x="200" y="83" textAnchor="middle" fill={MUTE} fontSize="7" fontFamily="'JetBrains Mono', monospace">
        API
      </text>
      <circle cx="60" cy="75" r="26" fill="rgba(240,237,230,0.03)" stroke={INK} strokeOpacity="0.18" strokeWidth="1" />
      <text x="60" y="73" textAnchor="middle" fill={INK} fontSize="7.5" fontFamily="'JetBrains Mono', monospace">
        CUSTOMER
      </text>
      <text x="60" y="83" textAnchor="middle" fill={MUTE} fontSize="6.5" fontFamily="'JetBrains Mono', monospace">
        book &amp; pay
      </text>
      <circle cx="340" cy="75" r="26" fill="rgba(240,237,230,0.03)" stroke={INK} strokeOpacity="0.18" strokeWidth="1" />
      <text x="340" y="73" textAnchor="middle" fill={INK} fontSize="7.5" fontFamily="'JetBrains Mono', monospace">
        MANAGER
      </text>
      <text x="340" y="83" textAnchor="middle" fill={MUTE} fontSize="6.5" fontFamily="'JetBrains Mono', monospace">
        run business
      </text>
      <g transform="translate(141,40)">
        <rect width="18" height="14" rx="3" fill="none" stroke={GOLD} strokeOpacity="0.55" strokeWidth="1" />
        <text x="9" y="26" textAnchor="middle" fill={MUTE} fontSize="6" fontFamily="'JetBrains Mono', monospace">chat</text>
      </g>
      <g transform="translate(241,40)">
        <rect width="18" height="14" rx="3" fill="none" stroke={GOLD} strokeOpacity="0.55" strokeWidth="1" />
        <text x="9" y="26" textAnchor="middle" fill={MUTE} fontSize="6" fontFamily="'JetBrains Mono', monospace">pay</text>
      </g>
    </svg>
  );
}

function NexusTradeDiagram() {
  const services = [
    { label: 'AUTH', x: 60 },
    { label: 'ORDERS', x: 140 },
    { label: 'WALLET', x: 200 },
    { label: 'LEDGER', x: 260 },
    { label: 'MARKET', x: 340 },
  ];
  return (
    <svg viewBox="0 0 400 150" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
      <rect x="150" y="18" width="100" height="26" rx="4" fill="rgba(212,168,83,0.08)" stroke={GOLD} strokeOpacity="0.55" strokeWidth="1" />
      <text x="200" y="35" textAnchor="middle" fill={INK} fontSize="8.5" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.5">
        API GATEWAY
      </text>
      {services.map((s) => (
        <line key={`l-${s.label}`} x1="200" y1="44" x2={s.x} y2="92" stroke={INK} strokeOpacity="0.14" strokeWidth="1" />
      ))}
      {services.map((s) => (
        <g key={s.label}>
          <circle cx={s.x} cy="104" r="20" fill="rgba(240,237,230,0.03)" stroke={INK} strokeOpacity="0.2" strokeWidth="1" />
          <text x={s.x} y="107" textAnchor="middle" fill={INK} fontSize="6.3" fontFamily="'JetBrains Mono', monospace">
            {s.label}
          </text>
        </g>
      ))}
      <line x1="30" y1="134" x2="370" y2="134" stroke={GOLD} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 4" />
      <text x="200" y="147" textAnchor="middle" fill={GOLD} fontSize="6.5" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.6">
        KAFKA EVENT BUS
      </text>
    </svg>
  );
}

const fallbackDiagrams: Record<Project['id'], () => ReactElement> = {
  planora: PlanoraDiagram,
  nexustrade: NexusTradeDiagram,
};

/* ── iPhone 13 Pro Max mockup ────────────────────────────────────────
   Real screen ratio (428:926 pt). Both previews are mobile-app captures,
   so they play inside an actual phone frame instead of a cropped
   background video — reads as a product, not stretched b-roll. */

function PhoneMockup({
  src,
  title,
  widthClamp,
}: {
  src: string;
  title: string;
  /** CSS clamp() string controlling the frame's width; height follows from the fixed aspect ratio. */
  widthClamp: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="relative mx-auto"
      style={{
        width: widthClamp,
        aspectRatio: '428 / 926',
        animation: 'phoneFloatY 6s ease-in-out infinite',
      }}
    >
      {/* ambient glow behind the device */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '-14%',
          background: 'radial-gradient(closest-side, rgba(212,168,83,0.16), transparent 72%)',
          filter: 'blur(4px)',
        }}
      />

      {/* bezel */}
      <div
        className="relative w-full h-full"
        style={{
          borderRadius: '19%',
          background: 'linear-gradient(155deg, #2a2a30 0%, #101013 38%, #0a0a0c 100%)',
          padding: '3.1%',
          boxShadow:
            '0 50px 90px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        {/* side controls */}
        <span
          className="absolute"
          style={{ left: '-1.5px', top: '17%', width: '3px', height: '5%', borderRadius: '2px', background: '#3a3a40' }}
        />
        <span
          className="absolute"
          style={{ left: '-1.5px', top: '25%', width: '3px', height: '8%', borderRadius: '2px', background: '#3a3a40' }}
        />
        <span
          className="absolute"
          style={{ left: '-1.5px', top: '35%', width: '3px', height: '8%', borderRadius: '2px', background: '#3a3a40' }}
        />
        <span
          className="absolute"
          style={{ right: '-1.5px', top: '22%', width: '3px', height: '11%', borderRadius: '2px', background: '#3a3a40' }}
        />

        {/* screen */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ borderRadius: '16.5%', background: '#000' }}
        >
          {!failed ? (
            <video
              src={src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={`${title} product preview`}
              onError={() => setFailed(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2.5"
              style={{ background: 'radial-gradient(circle at 50% 40%, rgba(212,168,83,0.1), transparent 65%)' }}
            >
              <span
                className="flex items-center justify-center rounded-full"
                style={{ width: 36, height: 36, border: '1px solid rgba(212, 168, 83, 0.4)' }}
              >
                <Play size={13} color={GOLD} fill={GOLD} />
              </span>
              <p className="font-mono uppercase tracking-[0.1em] text-center px-4" style={{ fontSize: 9, color: MUTE }}>
                Preview coming soon
              </p>
            </div>
          )}

          {/* notch */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: '2.2%', width: '34%', height: '3.6%', borderRadius: '999px', background: '#000' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Plain video preview + graceful fallback ────────────────────────
   Used for Planora's square frame — no phone chrome, just the clip. */

function VideoPreview({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2.5"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(212,168,83,0.07), transparent 65%), rgba(255,255,255,0.015)',
        }}
      >
        <span
          className="flex items-center justify-center rounded-full"
          style={{ width: 40, height: 40, border: '1px solid rgba(212, 168, 83, 0.4)' }}
        >
          <Play size={14} color={GOLD} fill={GOLD} />
        </span>
        <p className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 10, color: MUTE }}>
          Preview coming soon
        </p>
      </div>
    );
  }

  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={`${title} product preview`}
      onError={() => setFailed(true)}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.025]"
    />
  );
}

/* ── Small presentational bits ──────────────────────────────────── */

function SectionHeading({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={13} color={GOLD} strokeWidth={1.8} />
      <h4
        className="font-mono uppercase tracking-[0.12em]"
        style={{ fontSize: 11, color: GOLD, fontWeight: 500 }}
      >
        {children}
      </h4>
    </div>
  );
}

function DecisionList({ items }: { items: DecisionItem[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li
          key={item.title}
          className="pl-4"
          style={{ borderLeft: `1px solid rgba(212, 168, 83, 0.3)` }}
        >
          <p className="font-space text-[13px] font-medium" style={{ color: INK }}>
            {item.title}
          </p>
          <p className="text-[12.5px] mt-1" style={{ color: MUTE, lineHeight: 1.6 }}>
            {item.detail}
          </p>
        </li>
      ))}
    </ul>
  );
}

function CapabilityTags({ items, size = 'md' }: { items: string[]; size?: 'md' | 'sm' }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((cap) => (
        <span
          key={cap}
          className="font-space font-medium"
          style={{
            fontSize: size === 'md' ? 11.5 : 10.5,
            color: GOLD,
            border: '1px solid rgba(212, 168, 83, 0.3)',
            background: 'rgba(212, 168, 83, 0.06)',
            borderRadius: '20px',
            padding: size === 'md' ? '6px 13px' : '5px 11px',
            letterSpacing: '0.01em',
          }}
        >
          {cap}
        </span>
      ))}
    </div>
  );
}

function StackLine({ items }: { items: string[] }) {
  return (
    <p className="font-mono" style={{ fontSize: 10.5, color: 'rgba(138, 138, 154, 0.65)', letterSpacing: '0.02em' }}>
      {items.join('  ·  ')}
    </p>
  );
}

function ActionLinks({ project, expanded, onToggle }: { project: Project; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {project.links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-space text-[12.5px] uppercase tracking-[0.06em] px-3.5 py-2 rounded-md transition-all duration-300"
          style={{ color: INK, border: '1px solid rgba(240, 237, 230, 0.14)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212, 168, 83, 0.45)';
            e.currentTarget.style.color = GOLD;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(240, 237, 230, 0.14)';
            e.currentTarget.style.color = INK;
          }}
        >
          {link.label === 'Source' ? <Github size={13} /> : <ArrowUpRight size={13} />}
          {link.label}
        </a>
      ))}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="inline-flex items-center gap-1.5 font-space text-[12.5px] uppercase tracking-[0.06em] px-3.5 py-2 rounded-md transition-all duration-300 ml-auto sm:ml-0"
        style={{
          color: expanded ? '#07070A' : GOLD,
          background: expanded ? GOLD : 'rgba(212, 168, 83, 0.08)',
          border: '1px solid rgba(212, 168, 83, 0.45)',
        }}
      >
        {expanded ? 'Close Case Study' : 'View Engineering Case Study'}
        <ChevronDown
          size={13}
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      </button>
    </div>
  );
}

/* ── Expandable engineering case study — shared by both cards ─────── */

function CaseStudyPanel({ project, expanded }: { project: Project; expanded: boolean }) {
  const [archImageFailed, setArchImageFailed] = useState(false);
  const ArchFallback = fallbackDiagrams[project.id];
  const cs = project.caseStudy;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: expanded ? '1fr' : '0fr',
        transition: 'grid-template-rows 560ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        borderTop: expanded ? '1px solid rgba(240, 237, 230, 0.08)' : 'none',
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        <div
          className="p-7 md:p-10"
          style={{
            opacity: expanded ? 1 : 0,
            transform: expanded ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'opacity 420ms ease 140ms, transform 420ms ease 140ms',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="md:col-span-2">
              <SectionHeading icon={Layers}>Project Overview</SectionHeading>
              <p style={{ color: INK, opacity: 0.85, fontSize: 13.5, lineHeight: 1.7 }}>{cs.overview}</p>
            </div>

            <div>
              <SectionHeading icon={Target}>The Problem</SectionHeading>
              <p style={{ color: MUTE, fontSize: 13, lineHeight: 1.7 }}>{cs.problem}</p>
            </div>
            <div>
              <SectionHeading icon={Compass}>The Solution</SectionHeading>
              <p style={{ color: MUTE, fontSize: 13, lineHeight: 1.7 }}>{cs.solution}</p>
            </div>

            <div className="md:col-span-2">
              <SectionHeading icon={Network}>Architecture Diagram</SectionHeading>
              <div
                className="relative rounded-lg overflow-hidden"
                style={{
                  border: '1px solid rgba(240, 237, 230, 0.1)',
                  background: 'rgba(255,255,255,0.015)',
                  minHeight: 220,
                }}
              >
                {!archImageFailed ? (
                  <img
                    src={cs.architectureImage}
                    alt={`${project.title} architecture diagram`}
                    onError={() => setArchImageFailed(true)}
                    className="w-full h-auto block"
                  />
                ) : (
                  <div className="p-8">
                    <ArchFallback />
                  </div>
                )}
              </div>
            </div>

            <div>
              <SectionHeading icon={Lightbulb}>Engineering Decisions</SectionHeading>
              <DecisionList items={cs.decisions} />
            </div>
            <div>
              <SectionHeading icon={AlertTriangle}>Technical Challenges</SectionHeading>
              <DecisionList items={cs.challenges} />
            </div>

            <div>
              <SectionHeading icon={Sparkles}>Interesting Implementation Details</SectionHeading>
              <ul className="flex flex-col gap-2">
                {cs.implementation.map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <span style={{ color: GOLD, fontSize: 13, lineHeight: 1.6 }}>·</span>
                    <span style={{ color: MUTE, fontSize: 13, lineHeight: 1.6 }}>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading icon={BookOpen}>Lessons Learned</SectionHeading>
              <ul className="flex flex-col gap-2">
                {cs.lessonsLearned.map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <span style={{ color: GOLD, fontSize: 13, lineHeight: 1.6 }}>·</span>
                    <span style={{ color: MUTE, fontSize: 13, lineHeight: 1.6 }}>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {cs.screenshots && cs.screenshots.length > 0 && (
              <div className="md:col-span-2">
                <SectionHeading icon={ImageIcon}>Additional Screenshots</SectionHeading>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {cs.screenshots.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${project.title} screenshot`}
                      className="w-full rounded-md object-cover"
                      style={{ border: '1px solid rgba(240, 237, 230, 0.1)', aspectRatio: '16/10' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── NexusTrade — primary, cinematic treatment ──────────────────────
   Content on the left, a large floating iPhone 13 Pro Max on the right
   playing the app capture — the visual anchor of the section. */

function FeaturedProjectCard({ project, cardRef }: { project: Project; cardRef: (el: HTMLDivElement | null) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      ref={cardRef}
      className="rounded-lg overflow-hidden"
      style={{
        border: '1px solid rgba(212, 168, 83, 0.28)',
        background: 'rgba(212, 168, 83, 0.025)',
        boxShadow: '0 40px 100px rgba(212, 168, 83, 0.08)',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center">
        {/* Content */}
        <div className="p-8 md:p-12 lg:p-14 order-2 lg:order-1">
          <span
            className="inline-block font-mono uppercase tracking-[0.14em] px-2.5 py-1 rounded-sm mb-6"
            style={{ fontSize: 10, color: GOLD, border: '1px solid rgba(212, 168, 83, 0.4)', background: 'rgba(212, 168, 83, 0.06)' }}
          >
            {project.eyebrow}
          </span>

          <h3
            className="font-space font-bold"
            style={{
              fontSize: 'clamp(36px, 4.4vw, 58px)',
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              color: INK,
            }}
          >
            {project.title}
          </h3>

          <p className="mt-5 mb-6" style={{ fontSize: 15.5, color: MUTE, lineHeight: 1.6, maxWidth: 480 }}>
            {project.valueLine}
          </p>

          <div className="mb-6">
            <CapabilityTags items={project.capabilities} />
          </div>

          <div className="mb-8">
            <StackLine items={project.stack} />
          </div>

          <ActionLinks project={project} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
        </div>

        {/* Phone preview */}
        <div className="relative flex items-center justify-center p-10 md:p-14 order-1 lg:order-2">
          <PhoneMockup src={project.videoSrc} title={project.title} widthClamp="clamp(220px, 21vw, 300px)" />
        </div>
      </div>

      <CaseStudyPanel project={project} expanded={expanded} />
    </div>
  );
}

/* ── Planora — compact, secondary card ──────────────────────────── */

function CompactProjectCard({ project, cardRef }: { project: Project; cardRef: (el: HTMLDivElement | null) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      ref={cardRef}
      className="rounded-lg overflow-hidden"
      style={{ border: '1px solid rgba(240, 237, 230, 0.08)' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr]">
        {/* Video preview — plain square frame, no phone chrome, just larger than before */}
        <div
          className="relative overflow-hidden group"
          style={{
            aspectRatio: '1 / 1',
            minHeight: 320,
            borderRight: '1px solid rgba(240, 237, 230, 0.08)',
            background:
              'radial-gradient(circle at 1px 1px, rgba(240,237,230,0.06) 1px, transparent 0) top left / 18px 18px, rgba(255,255,255,0.015)',
          }}
        >
          <VideoPreview src={project.videoSrc} title={project.title} />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(7,7,10,0) 60%, rgba(7,7,10,0.5) 100%)' }}
          />
        </div>

        {/* Content panel */}
        <div className="flex flex-col justify-center p-7 md:p-8">
          <p className="font-mono uppercase tracking-[0.12em] mb-2" style={{ fontSize: 10.5, color: MUTE }}>
            {project.eyebrow}
          </p>
          <h3
            className="font-space font-semibold"
            style={{
              fontSize: 'clamp(22px, 2.2vw, 28px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: INK,
            }}
            
          >
            {project.title}
          </h3>
          <p className="mt-3" style={{ fontSize: 13.5, color: MUTE, lineHeight: 1.6, maxWidth: 460 }}>
            {project.valueLine}
          </p>

          <div className="mt-5">
            <CapabilityTags items={project.capabilities} size="sm" />
          </div>

          <div className="mt-4 mb-6">
            <StackLine items={project.stack} />
          </div>

          <ActionLinks project={project} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
        </div>
      </div>

      <CaseStudyPanel project={project} expanded={expanded} />
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────── */

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll('.work-header'), {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      data-nav-watch
      data-bg-theme="dark"
      className="relative z-10"
      style={{
        background: 'rgba(7, 7, 10, 0.93)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      {/* Local keyframe for the phone mockups' slow float — scoped by a unique name to avoid collisions. */}
      <style>{`
        @keyframes phoneFloatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="phoneFloatY"] { animation: none !important; }
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-[120px]">
        {/* Section header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p
              className="work-header font-mono text-[11px] font-medium uppercase tracking-[0.14em] mb-4"
              style={{ color: GOLD }}
            >
              SELECTED WORK
            </p>
            <h2
              className="work-header font-space font-bold uppercase"
              style={{
                fontSize: 'clamp(40px, 6vw, 64px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: INK,
              }}
            >
              PROJECTS
            </h2>
          </div>
          <p
            className="work-header font-mono text-[12px] max-w-[280px]"
            style={{ color: MUTE, lineHeight: 1.6 }}
          >
            Two full-stack systems, built solo — one distributed trading engine, one mobile marketplace.
          </p>
        </div>

        {/* Project showcase — NexusTrade leads, full-width and cinematic; Planora follows, compact */}
        <div className="flex flex-col gap-8">
          <FeaturedProjectCard
            project={projects[0]}
            cardRef={(el) => {
              cardsRef.current[0] = el;
            }}
          />
          <CompactProjectCard
            project={projects[1]}
            cardRef={(el) => {
              cardsRef.current[1] = el;
            }}
          />
        </div>

        {/* Explore more */}
        <a
          href="https://github.com/ahsanrind01"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 mt-8 py-10 px-8 rounded-md transition-all duration-[450ms]"
          style={{
            border: '1px dashed rgba(240, 237, 230, 0.15)',
            transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212, 168, 83, 0.4)';
            e.currentTarget.style.background = 'rgba(212, 168, 83, 0.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(240, 237, 230, 0.15)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <h3
            className="font-space font-semibold transition-colors duration-300"
            style={{ fontSize: 'clamp(18px, 2vw, 24px)', letterSpacing: '-0.01em', color: MUTE }}
          >
            More on GitHub
          </h3>
          <ArrowUpRight size={18} color={GOLD} />
        </a>
      </div>
    </section>
  );
}
