import {AnalysisFlow} from '../components/analysis-flow';
import {loadCatalog} from '../lib/catalog';
import {MoveHorizontal,Droplets,Leaf,ArrowRight} from 'lucide-react';
export const dynamic='force-dynamic';

export default function Home(){
  return <>
    <a href="#analysis" className="skip-link">Skip to photo analysis</a>
    <header className="site-header">
      <a href="/" className="wordmark"><img src="/glowup-logo.png" width={2009} height={484} alt="glowup"/><sup>BETA</sup></a>
      <nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#progress">Your progress</a></nav>
      <span className="private-label"><i/>Private preview</span>
    </header>
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">A closer look at you</p>
          <h1>Understand your face.<br/><em>Care for your skin.</em></h1>
          <p className="hero-copy">Explore your facial proportions and visible skin details. Find a thoughtful starting point for your skincare.</p>
          <a className="hero-cta" href="#analysis">Get started <ArrowRight size={18} aria-hidden="true"/></a>
        </div>
        <figure className="hero-visual">
          <div className="portrait-frame"><img src="/glowup-editorial.webp" width={1000} height={1250} alt="" fetchPriority="high"/></div>
          <figcaption>Editorial illustration</figcaption>
        </figure>
      </section>
      <section id="how-it-works" className="benefit-strip" aria-label="How it works">
        <div className="benefit-intro"><span className="section-index">How it works</span><h2>A photo.<br/>{' '}A little perspective.</h2></div>
        <div className="benefit"><MoveHorizontal size={24} strokeWidth={1.5} aria-hidden="true"/><p><strong>Measured proportions</strong><span>Ratios calculated from facial landmarks, with their limits explained.</span></p></div>
        <div className="benefit"><Droplets size={24} strokeWidth={1.5} aria-hidden="true"/><p><strong>Skin, with context</strong><span>Visible observations shaped by your photo and your answers.</span></p></div>
        <div className="benefit"><Leaf size={24} strokeWidth={1.5} aria-hidden="true"/><p><strong>A starting point for care</strong><span>Cosmetic guidance to explore at your own pace. No beauty scores.</span></p></div>
      </section>
      <AnalysisFlow products={loadCatalog()}/>
    </main>
    <footer>
      <a href="/" className="wordmark"><img src="/glowup-logo.png" width={2009} height={484} alt="glowup"/></a>
      <p>A little clarity. Care at your own pace.</p>
      <span>Private preview · Cosmetic guidance only</span>
    </footer>
  </>;
}
