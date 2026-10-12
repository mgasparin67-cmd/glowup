import {subscriptionPlans} from '../lib/subscription-plans';
import {LockKeyhole,Check} from 'lucide-react';
export function SubscriptionPaywall(){
  return <section id="analysis" className="subscription-paywall" aria-labelledby="subscription-heading">
    <div className="subscription-copy"><LockKeyhole size={26} strokeWidth={1.5} aria-hidden="true"/>
      <h2 id="subscription-heading">Your skin.<br/><em>Your starting point.</em></h2>
      <p>Personalized skincare recommendations are included with a glowup subscription.</p>
      <p className="muted">Subscribe in the iPhone app, tell us about your skin, then take or upload a clear photo. Your answers and visible scan observations guide the ingredients and products to consider.</p>
    </div>
    <div className="subscription-plan"><h3>Choose your membership</h3>
      <ul>{['A questionnaire built around your skin concerns','Facial scan and visible skin observations','Personalized skincare recommendations with reasons','Optional progress check-ins and shareable cards'].map(item=><li key={item}><Check size={18} aria-hidden="true"/><span>{item}</span></li>)}</ul>
      <p className="subscription-availability">iPhone subscriptions are being prepared.</p>
      <div className="membership-options">{subscriptionPlans.map(plan=><article className="membership-option" key={plan.id}><h4>{plan.name}</h4><p className="membership-price"><strong>${plan.monthlyUsd.toFixed(2)}</strong><span>USD / month</span></p><p className="membership-allowance">{plan.scansPerMonth} scans per month</p><p className="fine-print">{plan.description}</p><button className="primary-button" disabled aria-describedby="purchase-availability">Choose {plan.id==='essential'?'Essential':'Plus'}</button></article>)}</div>
      <p id="purchase-availability" className="fine-print">Purchasing is not available in this browser preview. The iPhone app will show the App Store price and renewal terms before purchase.</p>
      <p className="fine-print">A scan provides cosmetic observations, not a medical diagnosis. Product suitability cannot be confirmed from a photo.</p>
    </div>
  </section>;
}
