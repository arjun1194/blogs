import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Android Development',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        6+ years of experience building high-performance Android applications
        using Kotlin, Jetpack Compose, and advanced system architecture.
        Ex-Flipkart developer focused on UI/UX and scalable mobile systems.
      </>
    ),
  },
  {
    title: 'Open & On-Device AI',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Deeply interested in building <strong>open, safe, and on-device AI</strong> systems. 
        Focusing on mechanistic interpretability and alignment to ensure 
        sovereign and secure AI development.
      </>
    ),
  },
  {
    title: 'Systems & First Principles',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Approaching complex engineering challenges through a systems-first lens.
        Passionate about game theory, first principles analysis, and solving
        deep technical problems.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
