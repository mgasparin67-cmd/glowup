import {SkincareIntro} from '../components/skincare-intro';
import {env} from 'cloudflare:workers';
import {headers} from 'next/headers';
import {hasActiveSubscription} from '../lib/server/subscriptions';
import {SubscriptionPaywall} from '../components/subscription-paywall';
import {AnalysisFlow} from '../components/analysis-flow';
import {loadCatalog} from '../lib/catalog';
import {MoveHorizontal,Droplets,Leaf,ArrowRight} from 'lucide-react';
export const dynamic='force-dynamic';

export default async function Home(){
  const identity=(await headers()).get('oai-authenticated-user-id')??'';
  const subscribed=await hasActiveSubscription(identity,env);
  return <>
    <a href="#analysis" className="skip-link">Skip to membership</a>
    <header className="site-header">
      <a href="/" className="wordmark"><img src="/glowup-liquid-logo.png" width={1400} height={388} alt="glowup"/></a>
      <nav aria-label="Main navigation"><a href="#how-it-works">Overview</a><a href="#analysis">Membership</a></nav>
      <span className="private-label"><i/>Private preview</span>
    </header>
    <main>
      <section className="hero hero-text-only">
        <div className="hero-content">
          <img className="hero-app-icon" src="/glowup-liquid-icon.png" width={380} height={380} alt=""/>
          <h1>Understand your face.<br/><em>Care for your skin.</em></h1>
          <p className="hero-copy">Explore your facial proportions and visible skin details. Find a thoughtful starting point for your skincare.</p>
          <a className="hero-cta" href="#analysis">Explore membership <ArrowRight size={18} aria-hidden="true"/></a>
        </div>
      </section>
      <section id="how-it-works" className="benefit-strip" aria-label="How it works">
        <div className="benefit-intro"><h2>A photo.<br/>{' '}A little perspective.</h2></div>
        <div className="benefit"><MoveHorizontal size={24} strokeWidth={1.5} aria-hidden="true"/><p><strong>Measured proportions</strong><span>Ratios calculated from facial landmarks, with their limits explained.</span></p></div>
        <div className="benefit"><Droplets size={24} strokeWidth={1.5} aria-hidden="true"/><p><strong>Skin, with context</strong><span>Visible observations shaped by your photo and your answers.</span></p></div>
        <div className="benefit"><Leaf size={24} strokeWidth={1.5} aria-hidden="true"/><p><strong>A starting point for care</strong><span>Cosmetic guidance to explore at your own pace. No beauty scores.</span></p></div>
      </section>
      <SkincareIntro/>
      {subscribed?<AnalysisFlow products={loadCatalog()}/>:<SubscriptionPaywall/>}
    </main>
    <footer>
      <a href="/" className="wordmark"><img src="/glowup-liquid-logo.png" width={1400} height={388} alt="glowup"/></a>
      <p>A little clarity. Care at your own pace.</p>
      <span>Private preview · Cosmetic guidance only</span>
    </footer>
  </>;
}
