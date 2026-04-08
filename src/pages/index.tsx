import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Hi, I'm Arjun.
        </Heading>
        <p className="hero__subtitle">
          Software Engineer specializing in Android Development, AI Safety, and Systems Thinking.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/blog">
            Explore My Blog 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

function ProjectsSection() {
  return (
    <section className={clsx('padding-vert--xl', styles.projectsSection)}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--xl">Featured Projects 💡</Heading>
        <div className="row">
          <div className="col col--6">
            <div className={clsx('card', styles.projectCard)}>
              <div className="card__header">
                <h3>Peely</h3>
              </div>
              <div className="card__body">
                <p>
                  A modern calorie tracker application built with <strong>Jetpack Compose</strong>.
                  Focusing on high-performance UI and seamless user experience for nutritional management.
                </p>
              </div>
              <div className="card__footer">
                <span className="badge badge--primary">Android</span>
                <span className="badge badge--secondary margin-left--sm">Kotlin</span>
              </div>
            </div>
          </div>
          <div className="col col--6">
            <div className={clsx('card', styles.projectCard)}>
              <div className="card__header">
                <h3>Open & Safe AI</h3>
              </div>
              <div className="card__body">
                <p>
                  Exploring mechanistic interpretability and <strong>on-device AI alignment</strong>.
                  Focused on building safe, sovereign, and transparent systems that respect user privacy and security.
                </p>
              </div>
              <div className="card__footer">
                <span className="badge badge--primary">On-Device AI</span>
                <span className="badge badge--secondary margin-left--sm">Safety</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <Heading as="h2" className="text--center margin-bottom--lg">Systems-First Philosophy</Heading>
            <div className={styles.philosophyText}>
              <p className="text--center">
                I approach engineering through a <strong>systems-first lens</strong>. From optimizing Android HAL to 
                designing AI alignment protocols, I break complex problems down to their fundamental first principles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title={`Arjun - Android & AI Safety`}
      description="Portfolio and technical blog of Arjun, an Android Engineer and AI Safety Researcher.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <ProjectsSection />
        <PhilosophySection />
      </main>
    </Layout>
  );
}
