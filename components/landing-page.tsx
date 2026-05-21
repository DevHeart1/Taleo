"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cake,
  Check,
  Clock,
  Gift,
  Heart,
  HeartCrack,
  Lock,
  Mic,
  Minus,
  Play,
  Plus,
  Printer,
  ShieldCheck,
  ShieldHalf,
  Sparkles,
  Star,
  Volume2,
  WandSparkles,
} from "lucide-react";
import { TaleoLogo } from "@/components/taleo-logo";
import { Cloud, HillsBand, Sparkle, Tree } from "@/components/landscape-decoration";
import {
  BenefitFantasyIllustration,
  BenefitFrictionIllustration,
  BenefitPayoffIllustration,
  BenefitSafetyIllustration,
} from "@/components/benefit-illustrations";
import {
  StepBookScene,
  StepMicScene,
  StepProfileCard,
} from "@/components/step-illustrations";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./landing-page.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PRIMARY_CTA = "Start a free story";

const TRUST_BADGES = [
  { icon: ShieldHalf, label: "Parent controls" },
  { icon: Heart, label: "Kid-led stories" },
  { icon: Lock, label: "No ads or feeds" },
];

const BENTO_CARDS = [
  {
    icon: Mic,
    title: "One tap becomes a story",
    caption: "A tired bedtime ask turns into a voice-led ritual.",
    metric: "00:34",
    metricLabel: "idea captured",
    tone: styles.bentoPurple,
    Art: BenefitFrictionIllustration,
  },
  {
    icon: Heart,
    title: "Their world shows up",
    caption: "Names, favorites, and wild ideas become the setting.",
    metric: "Maya",
    metricLabel: "hero mode",
    tone: styles.bentoCoral,
    Art: BenefitFantasyIllustration,
  },
  {
    icon: ShieldCheck,
    title: "Guardrails stay on",
    caption: "No feed, no ads, no open-ended browsing.",
    metric: "Safe",
    metricLabel: "story space",
    tone: styles.bentoTeal,
    Art: BenefitSafetyIllustration,
  },
  {
    icon: Sparkles,
    title: "Learning sneaks in",
    caption: "Listening, vocabulary, and confidence hide inside play.",
    metric: "+12",
    metricLabel: "new words",
    tone: styles.bentoAmber,
    Art: BenefitPayoffIllustration,
  },
];

const STEPS = [
  {
    n: "01",
    title: "Set the world",
    body: "Add their name, age, and favorite things once. Taleo keeps the story familiar without making bedtime feel repetitive.",
    Art: StepProfileCard,
  },
  {
    n: "02",
    title: "Let them speak",
    body: "They tap once and say the adventure out loud. A dragon bakery, a moon picnic, a mermaid detective: all valid.",
    Art: StepMicScene,
  },
  {
    n: "03",
    title: "Read the book",
    body: "A narrated, illustrated bedtime book appears in minutes, ready to save, replay, share, or print.",
    Art: StepBookScene,
  },
];

const THEMES = [
  { label: "Dragon Rider", image: "/bedtime-universe/dragon-rider.png" },
  { label: "Ocean Explorer", image: "/bedtime-universe/ocean-explorer.png" },
  { label: "Fairy Princess", image: "/bedtime-universe/fairy-princess.png" },
  { label: "Space Ranger", image: "/bedtime-universe/space-ranger.png" },
  { label: "Wizard School", image: "/bedtime-universe/wizard-school.png" },
  { label: "Jungle Adventure", image: "/bedtime-universe/jungle-adventure.png" },
  { label: "Dinosaur Friend", image: "/bedtime-universe/dinosaur-friend.png" },
  { label: "Mermaid Quest", image: "/bedtime-universe/mermaid-quest.png" },
] as const;

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "/month",
    tagline: "Try one calmer bedtime.",
    features: [
      "1 illustrated bedtime story",
      "4 narrated scenes",
      "Shareable story link",
      "No credit card needed",
    ],
    cta: "Start free",
    href: "/play",
    featured: false,
  },
  {
    name: "Taleo+",
    price: "$9",
    cadence: "/month",
    badge: "Most loved",
    tagline: "For the nights when one story is never enough.",
    features: [
      "Unlimited illustrated stories",
      "Multi-voice narration",
      "Save, print, and share PDFs",
      "Up to 3 kid profiles",
      "Cancel anytime",
    ],
    cta: "Start 7-day trial",
    href: "/play",
    featured: true,
    finePrint: "Then $9/mo. Cancel anytime.",
  },
  {
    name: "Forever gift",
    price: "$129",
    cadence: " once",
    tagline: "A keepsake gift for families who love bedtime stories.",
    features: [
      "Everything in Taleo+",
      "Lifetime access",
      "Giftable code",
      "Priority support",
    ],
    cta: "Send the gift",
    href: "/play",
    featured: false,
    ctaIcon: Gift,
  },
];

const FAQS = [
  {
    icon: Cake,
    iconBg: styles.faqIconPurple,
    q: "How old does my kid need to be?",
    a: "Taleo is designed for ages 1-7. Voice prompts, vocabulary, and story length adapt based on the age you set in their profile.",
  },
  {
    icon: Clock,
    iconBg: styles.faqIconCoral,
    q: "Do I have to sit with them the whole time?",
    a: "No. Taleo is voice-driven, so your child can tap once, talk, listen, and receive a finished illustrated book while you stay nearby.",
  },
  {
    icon: Lock,
    iconBg: styles.faqIconTeal,
    q: "Is this safe? What about their voice and data?",
    a: "Taleo has no ads, no public feed, and no open browsing. Voice is used to create the current story experience and the product is built for parent trust.",
  },
  {
    icon: Printer,
    iconBg: styles.faqIconAmber,
    q: "Can I print or share the stories?",
    a: "On Taleo+ you get a print-ready PDF for every story plus a shareable link for grandparents, friends, and keepsake moments.",
  },
  {
    icon: HeartCrack,
    iconBg: styles.faqIconPink,
    q: "What if my kid does not love a story?",
    a: "Change the topic, regenerate, or pick a different story trait. Taleo is meant to follow their imagination, not lock them into one idea.",
  },
];

function LandscapeBackdrop() {
  return (
    <div className={styles.landscape} aria-hidden="true">
      <Cloud className={`${styles.cloud} ${styles.cloud1}`} />
      <Cloud className={`${styles.cloud} ${styles.cloud2}`} />
      <Cloud className={`${styles.cloud} ${styles.cloud3}`} />
      <Sparkle className={`${styles.sparkle} ${styles.sparkleA}`} color="#8b5cf6" />
      <Sparkle className={`${styles.sparkle} ${styles.sparkleB}`} color="#fb7185" />
      <Sparkle className={`${styles.sparkle} ${styles.sparkleC}`} color="#f8a12a" />
      <Tree className={`${styles.tree} ${styles.treeBig}`} />
      <Tree className={`${styles.tree} ${styles.treeSmall}`} />
      <HillsBand className={styles.hillsBand} />
    </div>
  );
}

export function LandingPage() {
  const pageRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from(`.${styles.nav}`, {
        y: -16,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(`.${styles.heroCopy} > *`, {
        y: 26,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from(`.${styles.heroStudio}`, {
        y: 34,
        scale: 0.96,
        opacity: 0,
        duration: 1,
        delay: 0.12,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>(`.${styles.section}`).forEach((section) => {
        gsap.from(section.querySelectorAll(`.${styles.sectionEyebrow}, .${styles.sectionTitle}`), {
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
          },
          y: 24,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        });
      });

      gsap.utils.toArray<HTMLElement>(
        `.${styles.bentoCard}, .${styles.step}, .${styles.priceCard}, .${styles.faqItem}`,
      ).forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
          },
          y: 34,
          opacity: 0,
          scale: 0.98,
          duration: 0.65,
          delay: (index % 4) * 0.04,
          ease: "power3.out",
        });
      });

      if (bentoRef.current) {
        gsap.to(bentoRef.current.querySelectorAll(`.${styles.bentoArt}`), {
          scrollTrigger: {
            trigger: bentoRef.current,
            start: "top 70%",
            end: "bottom 20%",
            scrub: 0.6,
          },
          y: -18,
          stagger: 0.08,
          ease: "none",
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main className={styles.page} ref={pageRef}>
      <LandscapeBackdrop />

      <div className={styles.container}>
        <nav className={styles.nav} aria-label="Primary">
          <Link className={styles.brand} href="/" aria-label="Taleo home">
            <TaleoLogo className={styles.brandLogo} title="Taleo" />
          </Link>
          <div className={styles.navLinks}>
            <a href="#why">Why Taleo</a>
            <a href="#how">How it works</a>
            <a href="#worlds">Story worlds</a>
            <a href="#pricing">Pricing</a>
          </div>
          <Link className={styles.navCta} href="/play">
            Start free <ArrowRight size={16} />
          </Link>
        </nav>

        <section className={styles.hero} ref={heroRef}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>
              <Sparkles size={15} /> Voice-first bedtime stories
            </p>
            <h1 className={styles.heroTitle}>
              Make bedtime feel like <em>their story</em>, not another negotiation.
            </h1>
            <p className={styles.heroLede}>
              Taleo turns one spoken idea into a narrated, illustrated book starring your child,
              so the last moment of the day feels personal, calm, and worth repeating.
            </p>
            <div className={styles.heroCtas}>
              <Link className={styles.btnPrimary} href="/play">
                <Mic size={20} />
                {PRIMARY_CTA}
              </Link>
              <a className={styles.btnSecondary} href="#why">
                <Play size={16} fill="currentColor" />
                Watch the magic
              </a>
            </div>
            <ul className={styles.trustRow}>
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon size={16} />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.heroStudio} aria-hidden="true">
            <div className={styles.deviceShell}>
              <div className={styles.deviceTopbar}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.storyPreview}>
                <Image
                  src="/bedtime-universe/dragon-rider.png"
                  alt=""
                  fill
                  sizes="(max-width: 960px) 86vw, 430px"
                  priority
                  className={styles.storyPreviewImage}
                />
                <div className={styles.storyOverlay}>
                  <span>Maya&apos;s sky dragon</span>
                  <strong>Scene 3 of 4</strong>
                </div>
              </div>
              <div className={styles.voiceComposer}>
                <button type="button" aria-label="Preview voice input" tabIndex={-1}>
                  <Mic size={18} />
                </button>
                <div className={styles.voiceWaves}>
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span key={i} />
                  ))}
                </div>
                <span className={styles.voiceStatus}>listening</span>
              </div>
            </div>

            <div className={`${styles.heroChip} ${styles.heroChipOne}`}>
              <Star size={15} />
              4 cozy scenes
            </div>
            <div className={`${styles.heroChip} ${styles.heroChipTwo}`}>
              <Volume2 size={15} />
              narrated aloud
            </div>
            <div className={`${styles.heroChip} ${styles.heroChipThree}`}>
              <ShieldCheck size={15} />
              parent-safe
            </div>
          </div>
        </section>

        <section className={styles.section} id="why">
          <header className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>
              <Sparkles size={12} /> Show, not tell
            </span>
            <h2 className={styles.sectionTitle}>
              Four tiny moments that change the whole bedtime mood.
            </h2>
          </header>

          <div className={styles.bentoGrid} ref={bentoRef}>
            {BENTO_CARDS.map(({ icon: Icon, title, caption, metric, metricLabel, tone, Art }, index) => (
              <article className={`${styles.bentoCard} ${tone}`} key={title}>
                <div className={styles.bentoCardTop}>
                  <span className={styles.bentoIcon}>
                    <Icon size={22} />
                  </span>
                  <span className={styles.bentoMetric}>
                    <strong>{metric}</strong>
                    {metricLabel}
                  </span>
                </div>
                <div className={styles.bentoStage}>
                  <Art className={styles.bentoArt} />
                </div>
                <div className={styles.bentoCopy}>
                  <h3>{title}</h3>
                  <p>{caption}</p>
                </div>
                <div className={styles.bentoGlow} />
                <span className={`${styles.bentoSpark} ${styles[`bentoSpark${index + 1}`]}`} />
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} id="how">
          <header className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>
              <Sparkles size={12} /> How it works
            </span>
            <h2 className={styles.sectionTitle}>
              A premium storybook studio, simple enough for bedtime.
            </h2>
          </header>

          <div className={styles.steps}>
            {STEPS.map(({ n, title, body, Art }) => (
              <article className={styles.step} key={n}>
                <span className={styles.stepNumber}>{n}</span>
                <Art className={styles.stepArt} />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} id="worlds">
          <header className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>
              <Sparkles size={12} /> Story worlds
            </span>
            <h2 className={styles.sectionTitle}>
              The fantasy changes every night. The comfort stays the same.
            </h2>
          </header>

          <div className={styles.themeRail}>
            {THEMES.map((theme) => (
              <article className={styles.themeCard} key={theme.label}>
                <Image
                  src={theme.image}
                  alt={theme.label}
                  fill
                  sizes="(max-width: 680px) 64vw, 220px"
                  className={styles.themeImage}
                />
                <span>{theme.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} id="pricing">
          <header className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>
              <Sparkles size={12} /> Pricing
            </span>
            <h2 className={styles.sectionTitle}>
              Start free. Upgrade when it becomes the routine.
            </h2>
          </header>

          <div className={styles.pricing}>
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`${styles.priceCard} ${
                  plan.featured ? styles.priceFeatured : ""
                }`.trim()}
              >
                {plan.badge ? (
                  <span className={styles.priceBadge}>
                    <Sparkles size={12} /> {plan.badge}
                  </span>
                ) : null}
                <h3 className={styles.priceTitle}>{plan.name}</h3>
                <div className={styles.priceAmount}>
                  {plan.price}
                  <span>{plan.cadence}</span>
                </div>
                <p className={styles.priceTagline}>{plan.tagline}</p>
                <ul className={styles.priceFeatures}>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={15} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link className={styles.priceCta} href={plan.href}>
                  {plan.cta}
                  {plan.ctaIcon ? <plan.ctaIcon size={16} /> : <ArrowRight size={16} />}
                </Link>
                {plan.finePrint ? (
                  <p className={styles.priceFinePrint}>{plan.finePrint}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} id="faq">
          <header className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>
              <Sparkles size={12} /> FAQ
            </span>
            <h2 className={styles.sectionTitle}>Parent questions, answered plainly.</h2>
          </header>

          <div className={styles.faq}>
            {FAQS.map((faq, i) => {
              const FaqIcon = faq.icon;
              return (
                <details className={styles.faqItem} key={faq.q} open={i === 0}>
                  <summary>
                    <span className={styles.faqQuestion}>{faq.q}</span>
                    <span className={styles.faqToggle} aria-hidden="true">
                      <Plus className={styles.faqPlus} size={14} />
                      <Minus className={styles.faqMinus} size={14} />
                    </span>
                  </summary>
                  <div className={styles.faqBody}>
                    <span className={`${styles.faqAccentIcon} ${faq.iconBg}`}>
                      <FaqIcon size={22} />
                    </span>
                    <p>{faq.a}</p>
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.finalCtaInner}>
            <WandSparkles size={34} />
            <h2>Tonight can feel softer.</h2>
            <p>
              One tap, one spoken idea, and a bedtime book that helps your child feel seen.
            </p>
            <Link className={styles.btnPrimary} href="/play">
              <Mic size={20} />
              {PRIMARY_CTA}
            </Link>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>Taleo - Made with care for bedtime</span>
          <div className={styles.footerLinks}>
            <Link href="/play">Start a story</Link>
            <Link href="/stories">My library</Link>
            <Link href="/settings">Parent settings</Link>
            <a href="mailto:hello@taleo.app">Contact</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
