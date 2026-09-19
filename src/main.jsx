import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { ShieldCheck, HeartPulse, CarFront, Users, UsersRound, Bike, ArrowRight, Phone, MessageCircle, CheckCircle2, Menu, X, BookOpen, Mail, ChevronDown, LockKeyhole, UserRoundPlus, TrendingUp, Clock3, Headphones, Stethoscope, Plane, LifeBuoy, FileCheck, Hospital, ClipboardCheck, CircleHelp, IndianRupee, BedDouble, Baby, Award, Building2, Repeat, SlidersHorizontal, Gauge, PlusCircle, Percent, Wrench, CalendarClock, UserCheck, CircleAlert, Scale, ShieldPlus, Wallet, Loader2 } from 'lucide-react';
import { supabase } from './supabase';
import ReviewYourPolicy from './ReviewYourPolicy';
import './styles.css';

const phone = '9891510642', wa = '919891510642', email = 'info@insurancegyani.in';
const YOUTUBE_URL = import.meta.env.VITE_YOUTUBE_URL || 'https://youtube.com/@insurancegyani?si=R4Vbv_k_DFikjhw2';
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/insurancegyani001?igsh=cTZlYml2MTl2cnly';
const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/company/insurance-gyani/';
const socials = [['YouTube', 'youtube', YOUTUBE_URL], ['Instagram', 'instagram', INSTAGRAM_URL], ['LinkedIn', 'linkedin', LINKEDIN_URL]];
const SocialIcon = {
  youtube: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg>,
  instagram: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  linkedin: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z"/></svg>
};
function SocialLinks({variant=''}){return <div className={'social-links '+variant}>{socials.map(([label,key,url])=><a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label} title={label} data-testid={'social-'+key}>{SocialIcon[key]}</a>)}</div>}
function waLink(type){const msg='Hi Insurance Gyani, I am interested in '+type+'. Please help me compare suitable options.';return 'https://wa.me/'+wa+'?text='+encodeURIComponent(msg)}
const SITE_URL=(import.meta.env.VITE_SITE_URL||'https://www.insurancegyani.in').replace(/\/+$/,'');
function setMetaTag(attr,key,content){let el=document.head.querySelector('meta['+attr+'="'+key+'"]');if(!el){el=document.createElement('meta');el.setAttribute(attr,key);document.head.appendChild(el)}el.setAttribute('content',content)}
function setCanonical(href){let el=document.head.querySelector('link[rel="canonical"]');if(!el){el=document.createElement('link');el.setAttribute('rel','canonical');document.head.appendChild(el)}el.setAttribute('href',href)}
function useSeo({title,description,path=''}){
  useEffect(()=>{
    const url=SITE_URL+(path||'');
    if(title){document.title=title;setMetaTag('property','og:title',title);setMetaTag('name','twitter:title',title)}
    if(description){setMetaTag('name','description',description);setMetaTag('property','og:description',description);setMetaTag('name','twitter:description',description)}
    setMetaTag('property','og:url',url);setCanonical(url);
    window.scrollTo(0,0);
  },[title,description,path]);
}
const insuranceNav=[['Health Insurance','/health-insurance'],['Life Insurance','/life-insurance'],['Motor Insurance','/motor-insurance'],['Other Insurance','/other-insurance']];
const products=[
  {title:'Health Insurance',path:'/health-insurance',icon:HeartPulse,description:'Protect yourself and your family against unexpected medical expenses.',features:['Hospitalisation','Family Floater','Senior Citizen','Critical Illness']},
  {title:'Life Insurance',path:'/life-insurance',icon:ShieldCheck,description:'Create financial protection for the people who depend on you.',features:['Term Insurance','Family Protection','Income Protection','Long Term Planning']},
  {title:'Motor Insurance',path:'/motor-insurance',icon:CarFront,description:'Protect your car or two-wheeler from unexpected financial losses.',features:['Car Insurance','Bike Insurance','Own Damage','Third Party']}
];

function Header({quote}){
  const[open,setOpen]=useState(false);
  const location=useLocation();
  useEffect(()=>setOpen(false),[location.pathname]);
  return <header className="site-header"><div className="container nav">
    <Link className="brand" to="/" aria-label="Insurance Gyani home"><img className="brand-logo" src="/insurance-gyani-logo.png" alt="Insurance Gyani logo"/><span className="brand-word">Insurance<span>GYANI</span></span></Link>
    <button className="mobile-toggle" aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    <nav className={open?'nav-menu open':'nav-menu'}>
      <Link className="nav-link" to="/">Home</Link>
      {insuranceNav.slice(0,3).map(([label,path])=><Link key={path} className="nav-link" to={path}>{label.replace(' Insurance','')}</Link>)}
      <Link className="nav-link" to="/review-your-policy">Review Your Policy</Link>
      <Link className="nav-link" to="/why-insurance-gyani">Why Us</Link>
      <Link className="nav-link" to="/become-insurance-advisor">Become Advisor</Link>
      <Link className="nav-link" to="/blogs">Blogs</Link>
      <Link className="nav-link" to="/contact">Contact</Link>
    </nav>
    <button className="btn primary top-cta" onClick={()=>quote('Health Insurance')}>Get Free Quote <ArrowRight size={16}/></button>
  </div></header>;
}

function Lead({close,initialType='Health Insurance',source='homepage',blogSlug='',submitLabel='GET PERSONALISED GUIDANCE'}){
  const[sent,setSent]=useState(false),[busy,setBusy]=useState(false),[err,setErr]=useState('');
  const[f,setF]=useState({name:'',mobile:'',city:'',insurance_type:initialType,consent:false});
  const set=(key,value)=>setF(current=>({...current,[key]:value}));
  async function submit(event){
    event.preventDefault();
    if(busy)return;
    setErr('');
    if(!f.name.trim()){setErr('Please enter your full name.');return}
    if(!/^[6-9]\d{9}$/.test(f.mobile)){setErr('Please enter a valid 10-digit mobile number.');return}
    if(!f.city.trim()){setErr('Please enter your city.');return}
    if(!f.consent){setErr('Please accept the consent to continue.');return}
    setBusy(true);
    try{
      if(!supabase){await new Promise(r=>setTimeout(r,450));throw Error('Our system is not able to save your request right now. Please call us at '+phone+'.')}
       const{consent,...payload}=f;
       const{error}=await supabase.from('leads').insert([{...payload,source,blog_slug:blogSlug||null}]);
      if(error)throw error;
      setSent(true);
    }catch(error){console.error(error);setErr(error.message||'Unable to submit right now. Please call us directly at '+phone+'.')}
    finally{setBusy(false)}
  }
  return <div className="backdrop" role="dialog" aria-modal="true" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}>
    <button className="modal-close" aria-label="Close form" onClick={close} data-testid="lead-close"><X size={18}/></button>
    {sent?<div className="success" data-testid="lead-success"><CheckCircle2 size={54}/><h2>Request received</h2><p>Thank you! Your request has been received. Our Insurance Gyani team will contact you shortly.</p><button className="btn primary" onClick={close} data-testid="lead-done">Done</button></div>:<>
      <small>FREE INSURANCE ASSISTANCE</small><h2>Tell us what you need</h2><p className="modal-intro">Share a few details and we will get in touch with clear, relevant guidance.</p>
      <form className="lead-form" onSubmit={submit} noValidate>
        <input required placeholder="Full name" value={f.name} onChange={e=>set('name',e.target.value)} data-testid="lead-name"/>
        <input required inputMode="numeric" pattern="[6-9][0-9]{9}" placeholder="10-digit mobile" value={f.mobile} onChange={e=>set('mobile',e.target.value.replace(/\D/g,'').slice(0,10))} data-testid="lead-mobile"/>
        <select value={f.insurance_type} onChange={e=>set('insurance_type',e.target.value)} data-testid="lead-type">{['Health Insurance','Life Insurance','Motor Insurance','Travel Insurance','Personal Accident','Other'].map(x=><option key={x}>{x}</option>)}</select>
        <input required placeholder="City" value={f.city} onChange={e=>set('city',e.target.value)} data-testid="lead-city"/>
        <label className="check-label"><input type="checkbox" checked={f.consent} onChange={e=>set('consent',e.target.checked)} data-testid="lead-consent"/> <span>I agree to be contacted regarding my insurance requirement.</span></label>
        {err&&<div className="form-error" data-testid="lead-error"><CircleAlert size={16}/> {err}</div>}
        <button disabled={busy} className="btn primary full wide" data-testid="lead-submit">{busy?<><Loader2 size={16} className="spin"/> Submitting...</>:<>{submitLabel} <ArrowRight size={16}/></>}</button>
      </form>
    </>}</div></div>;
}

function AdvisorLead(){
  const[sent,setSent]=useState(false),[busy,setBusy]=useState(false),[err,setErr]=useState('');
  const[f,setF]=useState({name:'',mobile:'',email:'',city:'',experience:'',employment:'',message:'',consent:false});
  const set=(key,value)=>setF(current=>({...current,[key]:value}));
  async function submit(event){
    event.preventDefault();
    if(busy)return;
    setErr('');
    if(!f.name.trim()){setErr('Please enter your full name.');return}
    if(!/^[6-9]\d{9}$/.test(f.mobile)){setErr('Please enter a valid 10-digit mobile number.');return}
    if(!f.city.trim()){setErr('Please enter your city.');return}
    if(!f.consent){setErr('Please accept the consent to continue.');return}
    setBusy(true);
    try{
      if(!supabase){await new Promise(r=>setTimeout(r,450));throw Error('Our system is not able to save your details right now. Please call us at '+phone+'.')}
      const{consent,...payload}=f;
      const{error}=await supabase.from('advisor_leads').insert([payload]);
      if(error)throw error;
      setSent(true);
    }catch(error){console.error(error);setErr(error.message||'Unable to submit right now. Please call us at '+phone+'.')}
    finally{setBusy(false)}
  }
  return <div className="advisor-form">{sent?<div className="success"><CheckCircle2 size={50}/><h3>Thank you for your interest.</h3><p>We have received your details. Our team will get in touch with you.</p></div>:<>
    <div className="form-head"><span className="eyebrow">Start your insurance career</span><h2>Become an Insurance Advisor</h2><p>Leave your details and our team will contact you about the opportunity.</p></div>
    <form className="form-grid" onSubmit={submit} noValidate>
      <input required placeholder="Full name" value={f.name} onChange={e=>set('name',e.target.value)}/>
      <input required inputMode="numeric" pattern="[6-9][0-9]{9}" placeholder="10-digit mobile" value={f.mobile} onChange={e=>set('mobile',e.target.value.replace(/\D/g,'').slice(0,10))}/>
      <input type="email" placeholder="Email" value={f.email} onChange={e=>set('email',e.target.value)}/>
      <input required placeholder="City" value={f.city} onChange={e=>set('city',e.target.value)}/>
      <select value={f.experience} onChange={e=>set('experience',e.target.value)}><option value="">Insurance experience</option><option>New to insurance</option><option>Already an advisor</option><option>Sales / financial services experience</option></select>
      <select value={f.employment} onChange={e=>set('employment',e.target.value)}><option value="">Current work status</option><option>Full-time job</option><option>Part-time / business</option><option>Self-employed</option><option>Looking for an opportunity</option></select>
      <textarea className="wide" placeholder="Tell us a little about yourself" value={f.message} onChange={e=>set('message',e.target.value)}/>
      <label className="check-label"><input type="checkbox" checked={f.consent} onChange={e=>set('consent',e.target.checked)}/><span>I agree to be contacted about the insurance advisor opportunity.</span></label>
      {err&&<div className="form-error wide" data-testid="advisor-error"><CircleAlert size={16}/> {err}</div>}
      <button disabled={busy} className="btn primary full wide" data-testid="advisor-submit">{busy?<><Loader2 size={16} className="spin"/> Submitting...</>:<>Register Your Interest <ArrowRight size={16}/></>}</button>
    </form>
  </>}</div>
}

function ProductCards({quote}){
  return <div className="product-grid">{products.map(product=>{const Icon=product.icon;return <article className="product-card" key={product.path}><div className="product-icon"><Icon size={25}/></div><h3>{product.title}</h3><p>{product.description}</p><ul className="feature-list">{product.features.map(feature=><li key={feature}>{feature}</li>)}</ul><Link className="text-link" to={product.path}>Explore {product.title} <ArrowRight size={15}/></Link></article>})}</div>
}

const reasons=[
  ['Clarity First',BookOpen,'We explain important terms, limits, waiting periods and exclusions in simple language.'],
  ['Need Based Guidance',Users,'We start with your age, family, budget and protection goals, not a one-size-fits-all pitch.'],
  ['Coverage Awareness',ShieldCheck,'Benefits are only one part of a policy. Understanding conditions matters just as much.'],
  ['Personalised Assistance',Headphones,'Ask questions and get help that is relevant to the cover you are considering.'],
  ['Service Guidance',LifeBuoy,'Insurance does not end at purchase. We make renewals and service questions easier.'],
  ['Long Term Relationship',TrendingUp,'Good protection is about resilience today and continuity for tomorrow.']
];

function Finder({quote}){
  const options=[['Health',HeartPulse,'Health Insurance'],['Family',UsersRound,'Life Insurance'],['Car',CarFront,'Motor Insurance'],['Bike',Bike,'Motor Insurance']];
  return <section className="finder-band"><div className="container"><div className="finder-head"><span className="eyebrow">Quick insurance finder</span><h2>Let's Find the Right Insurance for You</h2><p>Tell us what you want to protect and we'll help you understand your options.</p></div><div className="finder-options">{options.map(([label,Icon,type])=><button className="finder-option" key={label} onClick={()=>quote(type,'insurance-finder')}><Icon size={26}/><span>{label}</span></button>)}</div></div></section>
}

function WhySection({link=true}){
  return <section className="section"><div className="container why-layout"><div><span className="eyebrow">Why Insurance Gyani</span><h2>Insurance can be complicated. Understanding it should not be.</h2><p>We are built around a simple idea: people should be able to understand their choices before they choose protection.</p>{link&&<Link className="btn secondary" to="/why-insurance-gyani">Why Insurance Gyani <ArrowRight size={16}/></Link>}</div><div className="why-grid">{reasons.map(([title,Icon,text])=><article className="reason-card" key={title}><Icon size={22}/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
}

function Process(){
  const steps=[['01','Tell Us Your Requirement','Share a few details about what you want to protect.'],['02','Understand Your Options','Discuss relevant choices, terms and questions with our team.'],['03','Choose Your Protection','Move ahead only when the cover makes sense to you.'],['04','Get Ongoing Assistance','Keep a clear point of contact for future questions.']];
  return <section className="process-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">A clear path forward</span><h2>How it works</h2></div><p>No pressure, no confusing hand-offs. Just a considered conversation.</p></div><div className="process-grid">{steps.map(([number,title,text])=><div className="process-step" key={number}><div className="step-number">{number}</div><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
}

function BlogsPreview(){
  const[posts,setPosts]=useState([]),[loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;(async()=>{if(!supabase){setLoading(false);return}const{data}=await supabase.from('blogs').select('*').eq('published',true).order('published_at',{ascending:false}).limit(3);if(active)setPosts(data||[]);setLoading(false)})();return()=>{active=false}},[]);
  const cards=posts.length?posts:[{title:'Understanding health insurance before you buy',category:'Health Insurance',excerpt:'A practical starting point for thinking about family health cover.'},{title:'Term insurance: the protection conversation',category:'Life Insurance',excerpt:'Learn the role term insurance can play in long-term family planning.'},{title:'Motor insurance terms worth knowing',category:'Motor Insurance',excerpt:'IDV, own damage and third-party cover explained clearly.'}];
  return <section className="section light-band"><div className="container"><div className="section-heading"><div><span className="eyebrow">Insurance knowledge</span><h2>Before you buy insurance, know this.</h2></div><Link className="text-link" to="/blogs">Visit Knowledge Center <ArrowRight size={15}/></Link></div>{loading?<div className="empty-state">Loading the latest guidance...</div>:<div className="blogs-grid">{cards.map((post,index)=><article className="blog-card" key={post.slug||post.title}><div className="blog-art"><BookOpen size={30}/></div><div className="blog-content"><span className="category">{post.category||'Insurance Tips'}</span><h3>{post.title}</h3><p>{post.excerpt}</p>{post.slug&&<Link className="text-link" to={'/blog/'+post.slug}>Read article <ArrowRight size={15}/></Link>}</div></article>)}</div>}</div></section>
}

function AdvisorBand(){
  return <section className="advisor-band"><div className="container advisor-layout"><div><span className="eyebrow">A career with purpose</span><h2>Build your career in insurance.</h2><p>Explore an opportunity to become an Insurance Advisor and build your professional network in the insurance industry.</p><ul className="benefit-list">{[['Flexible Opportunity',Clock3],['Build Your Network',Users],['Learn Insurance',BookOpen],['Grow Your Business',TrendingUp]].map(([text,Icon])=><li key={text}><Icon/>{text}</li>)}</ul><Link className="btn primary" to="/become-insurance-advisor">Become an Insurance Advisor <ArrowRight size={16}/></Link></div><div className="advisor-callout"><UserRoundPlus size={38}/><h3>Your network can become your opportunity.</h3><p>Whether you are new to insurance or already working in sales, learn more about the advisor opportunity with our team.</p><Link className="btn white" to="/become-insurance-advisor">Explore the opportunity <ArrowRight size={16}/></Link></div></div></section>
}

function CTA({quote,heading='Not sure which insurance you need?',text='Tell us your requirement. We will help you understand your options.',button='GET FREE QUOTE',type='Health Insurance',source='homepage',blogSlug=''}){return <section className="cta"><div className="container cta-panel"><div><span className="eyebrow">Need help?</span><h2>{heading}</h2><p>{text}</p></div><button className="btn white" onClick={()=>quote(type,source,blogSlug)}>{button} <ArrowRight size={16}/></button></div></section>}

function TrustSection(){
  const points=['Simple Insurance Explanations','Requirement-Based Guidance','Health, Life & Motor Insurance','Help Understanding Policy Features','Claims Process Guidance','Call & WhatsApp Assistance'];
  return <section className="section trust-section"><div className="container trust-panel"><div><span className="eyebrow">A clearer conversation</span><h2>Why Talk to Insurance Gyani?</h2><p>Enter your next insurance conversation with context, useful questions and guidance that starts with your requirement.</p></div><div className="trust-points">{points.map(point=><div key={point}><CheckCircle2 size={19}/><span>{point}</span></div>)}</div></div></section>
}

function ClaimsSupport({quote}){
  useEffect(()=>{
    document.title='Claims Support & Guidance | Insurance Gyani';
    let meta=document.querySelector('meta[name="description"]');
    if(!meta){meta=document.createElement('meta');meta.name='description';document.head.appendChild(meta)}
    meta.content='Understand health and motor insurance claim processes, documentation and common claim questions with Insurance Gyani.';
    return()=>{document.title='Insurance Gyani'}
  },[]);
  const sections=[
    ['How a Health Insurance Claim Generally Works',FileCheck,'A claim usually begins when you inform the insurer or their claims partner, share the required details and submit documents. The insurer reviews the request against the policy terms before communicating its official decision.'],
    ['Cashless Claim',Hospital,'For a cashless request, you generally use a network hospital and ask the hospital desk to coordinate pre-authorisation with the insurer or TPA. Approval depends on the policy, documents and the insurer’s assessment.'],
    ['Reimbursement Claim',ClipboardCheck,'With reimbursement, you generally pay the eligible hospital expense first and submit the bills and supporting records for review. Keep original documents and check the policy’s timelines and exclusions.'],
    ['Motor Insurance Claim',CarFront,'After an accident or loss, prioritise safety and inform the insurer promptly. Depending on the policy, an inspection, repair estimate, FIR or other documents may be needed before the claim is assessed.'],
    ['Important Documents',FileCheck,'Commonly requested records can include the policy details, claim form, identity and bank information, hospital bills and reports, discharge summary, repair estimates, photographs or an FIR. Requirements vary by claim and policy.'],
    ['What to Do When a Claim Issue Arises',Phone,'Ask the insurer or TPA for the reason, reference number and next step in writing. Keep a record of calls and documents, review the policy terms, and use the insurer’s official grievance process when appropriate.']
  ];
  const questions=[['What is a cashless claim?','A cashless claim generally means the insurer or TPA coordinates eligible payment directly with a network hospital, subject to pre-authorisation and the policy terms.'],['What is a reimbursement claim?','You generally pay the expense and submit the required records for the insurer to assess the request under the policy.'],['What documents are generally required for a health insurance claim?','Depending on the claim, hospitals bills, reports, prescriptions, discharge summary, claim form, policy details and identity or bank records may be requested. Check with the insurer for the official list.'],['What should I do if a cashless request is not approved?','Ask for the reason and next steps, keep the reference details, and contact the insurer for the official decision. You may need to understand whether reimbursement or another process applies under your policy.'],['How does a motor insurance claim generally work?','You generally notify the insurer, share the incident details, arrange inspection when required and follow the approved repair or documentation process under the policy.'],['What should I check before submitting documents?','Check names, dates, policy numbers, signatures, bills and copies against the insurer’s instructions. Keep a complete copy of everything submitted.']];
  return <><section className="claims-hero"><div className="container"><span className="eyebrow">Insurance guidance</span><h1>Claims Support &amp; Guidance</h1><p>Facing a claim-related question? Understand the process, documents and important steps before you proceed.</p><div className="guidance-note"><CircleHelp size={19}/><span>Information and guidance to help you understand the claims process.</span></div></div></section><section className="section"><div className="container"><div className="claims-grid">{sections.map(([title,Icon,text])=><article className="claims-card" key={title}><Icon size={25}/><h2>{title}</h2><p>{text}</p></article>)}</div></div></section><section className="section light-band faq-page"><div className="container narrow"><span className="eyebrow">Claims FAQ</span><h2>Common questions, explained generally.</h2><div className="faq-list">{questions.map(([question,answer])=><details key={question}><summary>{question}<ChevronDown size={18}/></summary><p>{answer}</p></details>)}</div></div></section><CTA quote={quote} heading="Need help understanding your claim process?" text="Share your requirement and our team can help you understand the general process and next steps." button="GET CLAIM GUIDANCE" type="Other" source="claims-support"/></>
}

function HelpCTA({quote}){
  return <section className="cta help-cta"><div className="container cta-panel"><div><span className="eyebrow">Talk to our team</span><h2>Have an Insurance Question?</h2><p>Whether you're exploring a new policy, reviewing existing coverage or trying to understand a claim process, you can share your requirement with us.</p><a className="help-email" href={'mailto:'+email}>{email}</a><SocialLinks variant="help-social"/></div><div className="help-actions"><a className="btn white" href={'tel:'+phone}><Phone size={16}/> CALL {phone}</a><a className="btn secondary" href={'https://wa.me/'+wa} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WHATSAPP</a><button className="btn primary" onClick={()=>quote('Health Insurance','homepage')}>GET GUIDANCE <ArrowRight size={16}/></button></div></div></section>
}

function AdminBlogs(){
  const blank={title:'',slug:'',category:'Health Insurance',excerpt:'',cover_image:'',content:'',seo_title:'',meta_description:'',keywords:'',published:false,published_at:''};
  const[session,setSession]=useState(undefined),[posts,setPosts]=useState([]),[form,setForm]=useState(blank),[editing,setEditing]=useState(null),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
  const categories=['Health Insurance','Life Insurance','Motor Insurance','Claims','Insurance Tips','Insurance FAQs'];
  useEffect(()=>{
    if(!supabase){setSession(null);return}
    let active=true;
    supabase.auth.getSession().then(({data})=>{if(active){setSession(data.session);if(data.session)load(data.session)}})
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>{setSession(next);if(next)load(next);else setPosts([])});
    return()=>{active=false;subscription.unsubscribe()}
  },[]);
  async function load(){if(!supabase)return;const{data,error}=await supabase.from('blogs').select('*').order('created_at',{ascending:false});if(error)setMessage(error.message);else setPosts(data||[])}
  const set=(key,value)=>setForm(current=>({...current,[key]:value}));
  function edit(post){setEditing(post.id);setForm({...blank,...post,published_at:post.published_at?String(post.published_at).slice(0,10):''});window.scrollTo({top:0,behavior:'smooth'})}
  function reset(){setEditing(null);setForm(blank)}
  async function save(event){
    event.preventDefault();setBusy(true);setMessage('');
    const payload={...form,slug:form.slug||form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),published_at:form.published?(form.published_at||new Date().toISOString()):null};
    const result=editing?await supabase.from('blogs').update(payload).eq('id',editing):await supabase.from('blogs').insert([payload]);
    if(result.error)setMessage(result.error.message);else{setMessage(editing?'Blog updated.':'Blog created.');reset();await load()}
    setBusy(false)
  }
  async function remove(id){if(!window.confirm('Delete this blog?'))return;const{error}=await supabase.from('blogs').delete().eq('id',id);if(error)setMessage(error.message);else{setMessage('Blog deleted.');await load()}}
  if(session===undefined)return <section className="section"><div className="container narrow"><div className="empty-state">Checking admin access...</div></div></section>;
  if(!session)return <section className="section"><div className="container narrow admin-locked"><span className="eyebrow">Protected workspace</span><h1>Blog Management</h1><p className="lead">This area is ready for Supabase Auth administrators. Sign in through your existing Supabase Auth setup, then return here to create and manage published articles.</p><div className="guidance-note"><LockKeyhole size={19}/><span>Public visitors can only read blogs where <strong>published = true</strong>.</span></div><p className="muted">Setup note: enable Supabase Auth and mark approved users with <code>app_metadata.role = 'admin'</code>. The accompanying schema includes the protected policy required for blog management.</p></div></section>;
  return <section className="section"><div className="container admin-page"><div className="section-heading"><div><span className="eyebrow">Protected workspace</span><h1>Blog Management</h1></div><span className="admin-user">{session.user.email}</span></div>{message&&<div className="admin-message">{message}</div>}<form className="admin-form" onSubmit={save}><input required placeholder="Title" value={form.title} onChange={e=>set('title',e.target.value)}/><input placeholder="Slug (optional)" value={form.slug} onChange={e=>set('slug',e.target.value)}/><select value={form.category} onChange={e=>set('category',e.target.value)}>{categories.map(category=><option key={category}>{category}</option>)}</select><input placeholder="Cover Image URL" value={form.cover_image} onChange={e=>set('cover_image',e.target.value)}/><input className="wide" placeholder="Short Description" value={form.excerpt} onChange={e=>set('excerpt',e.target.value)}/><textarea className="wide" required placeholder="Content" value={form.content} onChange={e=>set('content',e.target.value)}/><input placeholder="SEO Title" value={form.seo_title} onChange={e=>set('seo_title',e.target.value)}/><input placeholder="SEO Description" value={form.meta_description} onChange={e=>set('meta_description',e.target.value)}/><input placeholder="Tags" value={form.keywords} onChange={e=>set('keywords',e.target.value)}/><input type="date" value={form.published_at} onChange={e=>set('published_at',e.target.value)}/><label className="check-label"><input type="checkbox" checked={form.published} onChange={e=>set('published',e.target.checked)}/><span>Published</span></label><div className="admin-form-actions"><button className="btn primary" disabled={busy}>{busy?'Saving...':editing?'Update Blog':'Create Blog'}</button>{editing&&<button type="button" className="btn secondary" onClick={reset}>Cancel</button>}</div></form><div className="admin-list"><h2>Articles</h2>{posts.length?posts.map(post=><article className="admin-row" key={post.id}><div><span className="category">{post.category}</span><h3>{post.title}</h3><small>{post.published?'Published':'Draft'} · {post.slug}</small></div><div className="admin-row-actions"><button className="btn secondary" onClick={()=>edit(post)}>Edit</button><button className="btn secondary danger" onClick={()=>remove(post.id)}>Delete</button></div></article>):<div className="empty-state">No articles yet.</div>}</div></div></section>
}

function Home({quote}){
  useSeo({title:'Insurance Gyani | Insurance Made Simple',description:'Insurance Gyani provides simple, personalised guidance for health, term life, motor and other insurance. Understand and compare your options before you buy.',path:'/'});
  return <><main><section className="hero"><div className="container hero-grid"><div><span className="eyebrow">Insurance made simple</span><h1>Protect What Matters.<em>Plan What’s Ahead.</em></h1><p className="hero-copy">Get personalised guidance for Health, Life and Motor Insurance — understand your options and make an informed decision.</p><div className="actions"><button className="btn primary" onClick={()=>quote('Health Insurance','homepage')}>Get Free Quote <ArrowRight size={16}/></button><a className="btn secondary" href={'tel:'+phone}><Phone size={16}/> Talk to an Expert</a></div><div className="trust-row"><span><CheckCircle2/> Clear guidance</span><span><CheckCircle2/> Easy process</span><span><CheckCircle2/> Continued support</span></div></div><div className="hero-visual"><div className="hero-panel"><div className="hero-orb"><ShieldCheck size={67}/></div><h3>Protection, with perspective.</h3><p>Understand coverage, exclusions and policy terms before you decide.</p></div><div className="floating-product"><HeartPulse/><b>Health</b><small>Protection</small></div><div className="floating-product"><CarFront/><b>Motor</b><small>Assistance</small></div></div></div></section><section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Insurance solutions</span><h2>Protection for the things that matter.</h2></div><p>Explore the basics first, then have a conversation about what fits your life.</p></div><ProductCards quote={quote}/></div></section><Finder quote={quote}/><WhySection/><TrustSection/><Process/><section className="section"><div className="container knowledge-grid"><div className="knowledge-list">{[['What is Health Insurance?',HeartPulse,'Start with hospitalisation, family cover and the terms that shape a policy.'],['What is Term Insurance?',ShieldCheck,'Understand financial protection for the people who depend on you.'],['What is Motor Insurance?',CarFront,'Know the difference between own damage, IDV and third-party cover.'],['What is a Waiting Period?',Clock3,'A simple explanation of when specific benefits become available.']].map(([title,Icon,text])=><article className="knowledge-card" key={title}><Icon size={22}/><h3>{title}</h3><p>{text}</p></article>)}</div><div className="knowledge-aside"><span className="eyebrow">Insurance Gyani Knowledge Center</span><h2>Good questions lead to better protection.</h2><p className="muted">Read straightforward guides written to help you enter an insurance conversation with confidence.</p><Link className="btn secondary" to="/blogs">Browse all guides <ArrowRight size={16}/></Link></div></div></section><AdvisorBand/><BlogsPreview/><CTA quote={quote}/></main></>
}

function IpIcon({Icon}){return <span className="ip-ic"><Icon size={22}/></span>}

const whyIgPoints=[
  ['01','Compare Before You Buy','Understand important differences between available options.'],
  ['02','Clear Guidance','Simple explanation of coverage, exclusions and important conditions.'],
  ['03','Personalised Assistance','Get help based on your requirement instead of choosing only on premium.'],
  ['04','No-Obligation Guidance','Understand your options before making a decision.']
];
function WhyIG(){
  return <section className="section why-ig-band"><div className="container">
    <div className="section-heading"><div><span className="eyebrow">Why Insurance Gyani</span><h2>Why Insurance Gyani?</h2></div><p>Honest, simple guidance that helps you decide with confidence.</p></div>
    <div className="whyig-grid" data-testid="whyig-grid">{whyIgPoints.map(([n,t,d])=><article className="glass-card whyig-card" key={n}><span className="premium-num">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
  </div></section>
}
const journeySteps=[[BookOpen,'Understand','Learn what actually matters before you buy.'],[SlidersHorizontal,'Compare','See how options differ, beyond just the premium.'],[Headphones,'Get Guidance','Personalised, no-obligation help for your decision.']];
function Journey({quote,type,source}){
  return <section className="section"><div className="container">
    <div className="section-heading"><div><span className="eyebrow">Simple process</span><h2>Understand → Compare → Get Guidance</h2></div><p>A clear path to choosing the right cover with confidence.</p></div>
    <div className="journey-grid" data-testid="journey-grid">{journeySteps.map(([Icon,t,d],i)=><article className="glass-card journey-step" key={t}><span className="premium-num">{i+1}</span><IpIcon Icon={Icon}/><h3>{t}</h3><p>{d}</p></article>)}</div>
    <div className="journey-cta">
      <button className="btn primary" onClick={()=>quote(type,source)} data-testid="journey-compare-cta">Compare Plans <ArrowRight size={16}/></button>
      <button className="btn secondary" onClick={()=>quote(type,source)} data-testid="journey-guidance-cta">Get Personalised Guidance</button>
      <a className="btn secondary" href={waLink(type)} target="_blank" rel="noreferrer" data-testid="journey-whatsapp-cta"><MessageCircle size={16}/> Talk to an Expert</a>
    </div>
  </div></section>
}

function InsurancePage({cfg,quote}){
  useSeo({title:cfg.title+' | Insurance Gyani',description:cfg.meta,path:cfg.path});
  return <div data-testid={cfg.testid}>
    <section className="ip-hero"><div className="container ip-hero-grid">
      <div>
        <span className="eyebrow">{cfg.eyebrow}</span>
        <h1>{cfg.heroTitle}</h1>
        <p className="ip-hero-copy">{cfg.heroCopy}</p>
        <ul className="ip-hero-points">{cfg.heroPoints.map(p=><li key={p}><CheckCircle2 size={17}/>{p}</li>)}</ul>
        <div className="actions">
          <button className="btn primary" onClick={()=>quote(cfg.type,cfg.source)} data-testid="ip-hero-cta">{cfg.cta} <ArrowRight size={16}/></button>
          <a className="btn secondary" href={waLink(cfg.type)} target="_blank" rel="noreferrer" data-testid="ip-whatsapp-cta"><MessageCircle size={16}/> Talk to an Expert</a>
        </div>
      </div>
      <aside className="ip-hero-card glass-card">
        <span className="ip-badge">{cfg.badge}</span>
        <h3>{cfg.cardTitle}</h3>
        <p>{cfg.cardText}</p>
        <div className="ip-hero-stats">{cfg.stats.map(([n,l])=><div key={l}><b>{n}</b><span>{l}</span></div>)}</div>
      </aside>
    </div></section>

    <section className="section"><div className="container">
      <div className="section-heading"><div><span className="eyebrow">Understand it first</span><h2>{cfg.explainHeading}</h2></div><p>{cfg.explainSub}</p></div>
      <div className="explain-grid">{cfg.explain.map(([Icon,t,d])=><article className="glass-card explain-card" key={t}><IpIcon Icon={Icon}/><h3>{t}</h3><p>{d}</p></article>)}</div>
    </div></section>

    <section className="section light-band"><div className="container">
      <div className="section-heading"><div><span className="eyebrow">Compare before you buy</span><h2>{cfg.compareHeading}</h2></div><p>{cfg.compareSub}</p></div>
      <div className="compare-grid">{cfg.compare.map(([Icon,t,d])=><article className="glass-card compare-card" key={t}><IpIcon Icon={Icon}/><div><h3>{t}</h3><p>{d}</p></div></article>)}</div>
      <div className="compare-cta"><button className="btn primary" onClick={()=>quote(cfg.type,cfg.source)} data-testid="ip-compare-cta">{cfg.compareCta} <ArrowRight size={16}/></button></div>
    </div></section>

    <Journey quote={quote} type={cfg.type} source={cfg.source}/>

    <section className="section"><div className="container">
      <div className="premium-grid">
        <div className="premium-intro glass-dark">
          <span className="ip-badge dark">{cfg.beyondBadge}</span>
          <h2>{cfg.beyondTitle}</h2>
          <p>{cfg.beyondText}</p>
          <button className="btn primary" onClick={()=>quote(cfg.type,cfg.source)} data-testid="ip-beyond-cta">{cfg.beyondCta} <ArrowRight size={16}/></button>
        </div>
        {cfg.beyond.map(([num,Icon,t,d])=><article className="glass-card premium-card" key={num}>
          <div className="premium-card-top"><span className="premium-num">{num}</span><IpIcon Icon={Icon}/></div>
          <h3>{t}</h3><p>{d}</p>
        </article>)}
      </div>
    </div></section>

    <WhyIG/>

    <CTA quote={quote} heading={cfg.ctaHeading} text={cfg.ctaText} button={cfg.cta} type={cfg.type} source={cfg.source}/>
  </div>
}

const healthCfg={
  title:'Health Insurance',testid:'health-page',type:'Health Insurance',source:'health-page',path:'/health-insurance',
  meta:'Understand health insurance, compare multiple plans and know what to check before buying with personalised guidance from Insurance Gyani.',
  eyebrow:'Health Insurance guidance',
  heroTitle:'Compare Health Plans With Clarity.',
  heroCopy:'Understand your coverage before you buy. Insurance Gyani helps you compare multiple health insurers and plans, and get personalised assistance for your family.',
  heroPoints:['Compare multiple insurers & plans','Understand coverage, not just premium','Personalised, need-based guidance'],
  cta:'Compare Health Plans',
  badge:'WHY IT MATTERS',cardTitle:'Protection when it matters most.',cardText:'A single hospitalisation can affect years of savings. The right health cover keeps your finances steady while you focus on recovery.',
  stats:[['Family','Floater options'],['Cashless','Network hospitals'],['Tax','Section 80D*']],
  explainHeading:'Health insurance, explained simply.',explainSub:'Start with the basics, then compare confidently.',
  explain:[
    [HeartPulse,'What is Health Insurance?','A health insurance policy helps cover eligible hospitalisation and medical expenses as per the policy terms, so a medical event does not become a financial one.'],
    [ShieldPlus,'Why do I need it?','Medical costs rise every year. Cover protects your savings, gives access to quality treatment and offers cashless convenience at network hospitals.'],
    [FileCheck,'What does it generally cover?','Typically in-patient hospitalisation, pre & post hospitalisation, day-care procedures and more, subject to the sum insured, limits and policy wording.'],
    [SlidersHorizontal,'What should I check?','Look beyond premium: sum insured, room-rent limits, waiting periods, exclusions, restoration, no claim bonus and network hospitals.']
  ],
  compareHeading:'Compare Multiple Health Insurance Options',compareSub:'Understand the differences before you choose.',
  compareCta:'Compare Plans',
  compare:[
    [IndianRupee,'Premium','What you pay yearly. The lowest premium is not always the best value once you check the cover.'],
    [ShieldCheck,'Sum Insured','The maximum cover available in a policy year. Choose an amount that suits your city and family.'],
    [BedDouble,'Room Rent','Room category limits can affect the whole bill. Prefer plans with no or high room-rent capping.'],
    [Clock3,'Waiting Period','Time before certain conditions are covered. Shorter, clearer waiting periods are better.'],
    [Stethoscope,'Pre-existing Disease','How and when existing conditions are covered. Compare the waiting period across plans.'],
    [Baby,'Maternity & OPD','Maternity, newborn and OPD benefits differ widely. Check limits and applicable waiting periods.'],
    [Repeat,'Restoration','Restores your sum insured after it is used in a policy year, useful for families.'],
    [Award,'No Claim Bonus','Rewards claim-free years by increasing your cover, without raising the premium.'],
    [Building2,'Network Hospitals','A wider cashless network means smoother treatment near you.'],
    [ClipboardCheck,'Claims','Claim process, documentation and settlement approach matter as much as the price.']
  ],
  beyondBadge:'BEFORE YOU BUY',beyondTitle:'Look past the premium.',beyondText:'Ask what changes the experience. A lower premium can mean higher out-of-pocket costs later. These are the details worth comparing before you choose.',beyondCta:'Get Personalised Guidance',
  beyond:[
    ['01',IndianRupee,'Premium','Compare value, not just the sticker price. Understand what you actually get for the premium you pay.'],
    ['02',ShieldCheck,'Sum Insured','Pick a cover that reflects rising medical costs in your city and your family size.'],
    ['03',BedDouble,'Room Rent','Room-rent limits can silently reduce your claim. Prefer flexible or no capping.'],
    ['04',Clock3,'Waiting Period','Know the initial, specific-disease and pre-existing waiting periods before you buy.'],
    ['05',Stethoscope,'Pre-existing Disease','Understand how existing conditions are treated and when they become payable.'],
    ['06',Baby,'Maternity & OPD','Check maternity, newborn and OPD benefits along with their limits and conditions.'],
    ['07',Award,'NCB, Restoration & Hospitals','No claim bonus, restoration and the cashless network together shape your real experience.']
  ],
  ctaHeading:'Not sure which health plan fits your family?',ctaText:'Share your requirement and compare multiple health insurance options with clear, unbiased guidance.'
};

const termCfg={
  title:'Term Insurance',testid:'term-page',type:'Life Insurance',source:'life-page',path:'/life-insurance',
  meta:'Understand term insurance, sum assured, policy term, riders and claim settlement, and compare before buying with Insurance Gyani.',
  eyebrow:'Term Insurance guidance',
  heroTitle:'Secure Your Family’s Future.',
  heroCopy:'Term insurance provides pure life cover at an affordable premium. Insurance Gyani helps you understand sum assured, tenure and riders, and compare before you choose.',
  heroPoints:['High life cover, affordable premium','Understand riders & eligibility','Compare claim settlement approach'],
  cta:'Compare Term Plans',
  badge:'WHY IT MATTERS',cardTitle:'Protection for those who depend on you.',cardText:'If something happens to you, term insurance pays your nominee a lump sum, helping your family stay financially secure and continue their plans.',
  stats:[['High','Sum assured'],['Fixed','Policy term'],['Tax','Section 80C*']],
  explainHeading:'Term insurance, explained simply.',explainSub:'A clear foundation before you compare plans.',
  explain:[
    [ShieldCheck,'What is Term Insurance?','A term plan provides life cover for a chosen period. If the insured passes away during the term, the nominee receives the sum assured, subject to policy terms.'],
    [Users,'Why is it important?','It replaces your income and protects your family’s goals, loans and lifestyle when they need it most.'],
    [IndianRupee,'How much cover & premium?','Choose a sum assured that covers income, liabilities and future goals. Term plans offer large cover at a relatively low premium.'],
    [SlidersHorizontal,'What should I compare?','Sum assured, policy term, premium, riders, eligibility, exclusions and the insurer’s claim settlement track record.']
  ],
  compareHeading:'Compare Multiple Term Insurance Options',compareSub:'Understand the differences before you choose.',
  compareCta:'Compare Plans',
  compare:[
    [ShieldCheck,'Sum Assured','The life cover paid to your nominee. Match it to income, loans and long-term family goals.'],
    [CalendarClock,'Policy Term','How long the cover lasts. Ideally cover your working years and key liabilities.'],
    [IndianRupee,'Premium','Cost of the cover. Compare value and payment options, not just the lowest figure.'],
    [ClipboardCheck,'Claim Settlement','Understand the insurer’s claim approach and required documentation before choosing.'],
    [PlusCircle,'Riders','Optional add-ons like critical illness or accidental cover that strengthen protection.'],
    [UserCheck,'Eligibility','Age, income and health criteria that affect approval and premium.'],
    [CircleAlert,'Exclusions','Important conditions and situations that may not be payable. Always read the wording.']
  ],
  beyondBadge:'BEFORE YOU BUY',beyondTitle:'Look beyond the premium.',beyondText:'Ask what changes the experience. The cheapest term plan is not always the strongest. These are the details worth comparing before you decide.',beyondCta:'Get Personalised Guidance',
  beyond:[
    ['01',ShieldCheck,'Sum Assured','Choose cover that truly protects your family’s income and future goals.'],
    ['02',CalendarClock,'Policy Term','Align the term with your working years and outstanding liabilities.'],
    ['03',IndianRupee,'Premium','Balance affordability with the right cover and reliable long-term payment.'],
    ['04',ClipboardCheck,'Claim Considerations','Honest disclosures and clear documentation make claims smoother for your nominee.'],
    ['05',PlusCircle,'Riders','Add critical illness or accidental cover where it strengthens your protection.'],
    ['06',UserCheck,'Eligibility','Understand the age, income and health factors that shape your plan.'],
    ['07',CircleAlert,'Exclusions','Know the important conditions and exclusions before you sign.']
  ],
  ctaHeading:'Planning protection for your family?',ctaText:'Share your requirement and compare multiple term insurance options with clear, unbiased guidance.'
};

const motorCfg={
  title:'Motor Insurance',testid:'motor-page',type:'Motor Insurance',source:'motor-page',path:'/motor-insurance',
  meta:'Understand motor insurance, IDV, add-ons, third-party and own damage cover, and compare before buying with Insurance Gyani.',
  eyebrow:'Motor Insurance guidance',
  heroTitle:'Drive Protected. Compare Smart.',
  heroCopy:'Third-party cover is mandatory, but comprehensive protection keeps you truly secure. Insurance Gyani helps you understand IDV, add-ons and compare before you renew or buy.',
  heroPoints:['Third-party & comprehensive cover','Understand IDV, add-ons & NCB','Cashless garage guidance'],
  cta:'Compare Motor Plans',
  badge:'WHY IT MATTERS',cardTitle:'Protection on every road.',cardText:'An accident, theft or third-party liability can be costly. The right motor policy protects your vehicle and shields you from unexpected expenses.',
  stats:[['Legal','Third-party cover'],['Own','Damage protection'],['Cashless','Network garages']],
  explainHeading:'Motor insurance, explained simply.',explainSub:'Know the essentials before you compare.',
  explain:[
    [CarFront,'What is Motor Insurance?','A motor policy covers financial losses from accidents, theft, damage and third-party liability for your car or two-wheeler, as per the policy terms.'],
    [Scale,'Why is it required?','Third-party motor insurance is mandatory by law. Comprehensive cover additionally protects your own vehicle against damage and theft.'],
    [ShieldCheck,'What does it cover?','Third-party liability, own damage, theft and, with add-ons, benefits like zero depreciation, roadside assistance and engine protection.'],
    [SlidersHorizontal,'What should I compare?','IDV, premium, add-ons, deductibles, no claim bonus and the cashless garage network before you buy or renew.']
  ],
  compareHeading:'Compare Multiple Motor Insurance Options',compareSub:'Understand the differences before you choose.',
  compareCta:'Compare Plans',
  compare:[
    [Gauge,'IDV','Insured Declared Value — the current market value of your vehicle and the maximum claim on total loss.'],
    [IndianRupee,'Premium','What you pay for the cover. Compare it against the IDV and included benefits.'],
    [Scale,'Third-party Cover','Mandatory cover for injury or damage caused to others. Check the liability protection.'],
    [CarFront,'Own Damage','Covers damage to your own vehicle from accidents, fire or natural events.'],
    [PlusCircle,'Add-ons','Zero depreciation, roadside assistance, engine and consumables cover that boost protection.'],
    [Percent,'Deductible','The portion you pay per claim. A lower deductible can mean a higher premium.'],
    [Award,'No Claim Bonus','A discount for claim-free years that can significantly reduce renewal premium.'],
    [Wrench,'Garage & Claims','Cashless network garages and a smooth claim process make repairs stress-free.']
  ],
  beyondBadge:'BEFORE YOU BUY',beyondTitle:'Look beyond the premium.',beyondText:'Ask what changes the experience. A cheap policy with the wrong IDV or missing add-ons can cost more at claim time. Compare these details first.',beyondCta:'Get Personalised Guidance',
  beyond:[
    ['01',Gauge,'IDV','Set the right insured value — too low reduces your claim, too high raises the premium.'],
    ['02',IndianRupee,'Premium','Compare value against IDV and the benefits actually included.'],
    ['03',Scale,'Third-party Cover','Ensure adequate legal liability protection, which is mandatory.'],
    ['04',CarFront,'Own Damage','Protect your own vehicle against accidents, fire and natural calamities.'],
    ['05',PlusCircle,'Add-ons','Choose zero depreciation, roadside assistance and engine cover where they matter.'],
    ['06',Percent,'Deductible','Understand how much you pay per claim and how it affects your premium.'],
    ['07',Award,'NCB & Garages','No claim bonus and a strong cashless garage network shape your real experience.']
  ],
  ctaHeading:'Looking for the right motor cover?',ctaText:'Share your requirement and compare multiple motor insurance options with clear, unbiased guidance.'
};

function Product({type,quote}){
  const data={Health:['Health Insurance','Protect yourself and your family against unexpected medical expenses.',['Individual Health Insurance','Family Health Insurance','Senior Citizen Health Insurance','Maternity Insurance','Critical Illness Insurance','Top-up & Super Top-up','Personal Accident Insurance','Health Insurance Portability'],HeartPulse],Life:['Life Insurance','Create financial protection for the people who depend on you.',['Term Insurance','Life Protection','Family Financial Protection','Income Protection','Long-term Protection'],ShieldCheck],Motor:['Motor Insurance','Protect your car or two-wheeler from unexpected financial losses.',['Car Insurance','Two-Wheeler Insurance','Comprehensive Insurance','Third Party Insurance','Own Damage','Motor Renewal'],CarFront],Other:['Other Insurance','Explore protection for travel, accidents and other everyday risks.',['Travel Insurance','Personal Accident Insurance','Other Protection Requirements'],Plane]}[type];
  const Icon=data[3];
  const cta={Health:['Not sure which health insurance is right for you?','GET PERSONAL GUIDANCE','health-page'],Life:['Planning protection for your family?','TALK TO AN EXPERT','life-page'],Motor:['Looking for the right motor cover?','GET A QUOTE','motor-page'],Other:['Have an insurance question?','GET PERSONAL GUIDANCE','other-insurance']}[type];
  return <><section className="inner-hero"><div className="container"><span className="eyebrow">Insurance education</span><h1>{data[0]}</h1><p>{data[1]}</p><button className="btn primary" onClick={()=>quote(data[0],cta[2])}>Get Free Quote <ArrowRight size={16}/></button></div></section><section className="section"><div className="container product-detail"><div><span className="eyebrow">What you can explore</span><h2>Know the cover before you choose.</h2><ul className="explore-list">{data[2].map(item=><li key={item}><CheckCircle2/>{item}</li>)}</ul></div><div className="info-card"><Icon size={35} color="var(--gold)"/><h3>Make an informed decision.</h3><p>Coverage, exclusions, waiting periods, eligibility and underwriting can vary by insurer and product. Always review the policy wording and ask questions before moving ahead.</p><button className="btn primary" onClick={()=>quote(data[0],cta[2])}>Discuss Your Requirement <ArrowRight size={16}/></button></div></div></section><CTA quote={quote} heading={cta[0]} button={cta[1]} type={data[0]} source={cta[2]}/></>
}

function WhyUs({quote}){
  return <><section className="why-hero"><div className="container"><span className="eyebrow">Our approach</span><h1>Why Insurance Gyani?</h1><p>Because insurance should be understood before it is purchased.</p></div></section><WhySection link={false}/><Process/><CTA quote={quote}/></>
}

function BecomeAdvisor(){
  const benefits=[['Build relationships',Users,'Work with individuals and families and build a professional client network.'],['Flexible opportunity',Clock3,'Explore an opportunity that can fit around your existing commitments.'],['Learn insurance',BookOpen,'Develop product knowledge and customer communication abilities.'],['Grow over time',TrendingUp,'Build your client base and work towards long-term professional growth.']];
  return <><section className="advisor-hero"><div className="container advisor-hero-grid"><div><span className="eyebrow">Career opportunity</span><h1>Build your own <em>insurance career.</em></h1><p>Explore an opportunity to become an insurance advisor and build meaningful client relationships while growing your professional journey.</p><a className="btn primary" href="#advisor-form">Register Your Interest <ArrowRight size={16}/></a></div><div className="career-card"><UserRoundPlus size={47}/><h3>Your network can become your opportunity.</h3><p>Whether you are new to insurance or already working in sales, learn more about the advisor opportunity with our team.</p><div className="career-points"><span><Users/> Build your network</span><span><TrendingUp/> Grow your business</span><span><BookOpen/> Learn insurance</span></div></div></div></section><section className="section"><div className="container"><span className="eyebrow">Why become an advisor</span><h2>A professional opportunity with people at the centre.</h2><div className="advisor-benefits">{benefits.map(([title,Icon,text])=><div key={title}><Icon size={24}/><h3>{title}</h3><p>{text}</p></div>)}</div></div></section><section className="section light-band"><div className="container advisor-process"><div><span className="eyebrow">How it works</span><h2>Simple first step.</h2></div><div className="process-list">{['Share your details','Discuss the opportunity','Complete applicable onboarding and training','Start building your advisor journey'].map((text,index)=><div key={text}><b>0{index+1}</b><span>{text}</span><ArrowRight/></div>)}</div></div></section><section className="section" id="advisor-form"><div className="container advisor-form-wrap"><AdvisorLead/></div></section></>
}

function About({quote}){
  const help=[['Health Insurance',HeartPulse,'Understand medical cover, waiting periods and family protection.'],['Life Insurance',ShieldCheck,'Explore financial protection and long-term planning.'],['Motor Insurance',CarFront,'Make sense of car, bike, own-damage and third-party cover.'],['Insurance Education',BookOpen,'Build a clearer foundation before a policy conversation.'],['Insurance Guidance',Stethoscope,'Ask better questions about your needs and options.'],['Customer Assistance',Headphones,'Find a considered point of contact for service questions.']];
  return <><section className="inner-hero"><div className="container"><span className="eyebrow">About Insurance Gyani</span><h1>Insurance, in a language people can use.</h1><p>Insurance Gyani is an insurance education and assistance platform created to make insurance easier to understand.</p></div></section><section className="section"><div className="container about-intro"><div><span className="eyebrow">Our mission</span><h2>Make protection decisions feel more informed.</h2><p>To make insurance easier to understand and help people make more informed protection decisions.</p></div><div className="mission-card"><ShieldCheck size={34}/><h3>Understand first. Choose with confidence.</h3><p>We believe an insurance conversation should leave you clearer, not more overwhelmed.</p><SocialLinks variant="about-social"/></div></div></section><section className="section light-band"><div className="container"><span className="eyebrow">What we help with</span><h2>Guidance across the protection journey.</h2><div className="help-grid">{help.map(([title,Icon,text])=><article className="help-card" key={title}><Icon size={23}/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section><CTA quote={quote}/></>
}

function Contact({quote}){
  return <><section className="contact"><div className="container contact-layout"><div><span className="eyebrow">Contact Insurance Gyani</span><h1>Let’s talk about your insurance requirement.</h1><p className="contact-intro">Need help with health, life, motor or other insurance? Get in touch with our team.</p><div className="contact-items"><a className="contact-item" href={'tel:'+phone}><Phone/><span><strong>Call us</strong>{phone}</span></a><a className="contact-item" href={'mailto:'+email}><Mail/><span><strong>Email</strong>{email}</span></a><a className="contact-item" href={'https://wa.me/'+wa} target="_blank" rel="noreferrer"><MessageCircle/><span><strong>WhatsApp</strong>Chat with us</span></a></div><div className="contact-social"><span className="social-label">Follow Insurance Gyani</span><SocialLinks/></div><div className="contact-actions"><a className="btn primary" href={'tel:'+phone}><Phone size={16}/> Call Now</a><a className="btn secondary" href={'https://wa.me/'+wa} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a><button className="btn secondary" onClick={()=>quote('Health Insurance','contact')}>Get Free Quote <ArrowRight size={16}/></button></div></div><div className="contact-card"><LockKeyhole size={30}/><h3>Your information stays private.</h3><p>We use submitted details only to respond to your insurance requirement. Do not share sensitive financial or identity documents through the public lead form.</p><button className="btn primary full" onClick={()=>quote('Health Insurance','contact')}>Start Your Requirement <ArrowRight size={16}/></button></div></div></section><HelpCTA quote={quote}/></>
}

function Blogs({quote}){
  const[posts,setPosts]=useState([]),[loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;(async()=>{if(!supabase){setLoading(false);return}const{data}=await supabase.from('blogs').select('*').eq('published',true).order('published_at',{ascending:false});if(active)setPosts(data||[]);setLoading(false)})();return()=>{active=false}},[]);
  return <><section className="section"><div className="container"><span className="eyebrow">Insurance Gyani Knowledge Center</span><h1>Insurance, explained clearly.</h1><p className="lead">Simple explanations and practical education for health, life, motor and everyday protection questions.</p><p className="lead" style={{ marginTop: '12px' }}><Link to="/review-your-policy" className="text-link">Want to understand your current policy better? Review your policy with us <ArrowRight size={15}/></Link></p>{loading?<div className="empty-state">Loading published articles...</div>:posts.length?<div className="blogs-grid">{posts.map(post=><article className="blog-card" key={post.slug}><div className="blog-art">{post.cover_image?<img src={post.cover_image} alt="" />:<BookOpen size={30}/>}</div><div className="blog-content"><span className="category">{post.category||'Insurance Tips'}</span><h3>{post.title}</h3><p>{post.excerpt}</p><Link className="text-link" to={'/blog/'+post.slug}>Read article <ArrowRight size={15}/></Link></div></article>)}</div>:<div className="empty-state">New articles are on the way. In the meantime, call us for help understanding your insurance requirement.</div>}</div></section><CTA quote={quote} heading="Still confused about your insurance?" text="Get personalised guidance based on your requirement." button="GET PERSONALISED GUIDANCE" source="blog"/></>
}

function Post({quote}){
  const{slug}=useParams(),[post,setPost]=useState(null),[loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;(async()=>{if(!supabase){setLoading(false);return}const{data}=await supabase.from('blogs').select('*').eq('slug',slug).eq('published',true).single();if(active)setPost(data||null);setLoading(false)})();return()=>{active=false}},[slug]);
  if(loading)return <section className="section narrow"><div className="empty-state">Loading article...</div></section>;
  if(!post)return <section className="section narrow"><span className="eyebrow">Knowledge Center</span><h1>Article not found</h1><Link className="btn secondary" to="/blogs">Back to Blogs <ArrowRight size={16}/></Link></section>;
  return <><section className="section"><div className="container article"><span className="eyebrow">{post.category||'Insurance Tips'}</span><h1>{post.title}</h1><p className="lead">{post.excerpt}</p>{String(post.content||'').split('\n').filter(Boolean).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div></section><CTA quote={quote} heading="Still confused about your insurance?" text="Get personalised guidance based on your requirement." button="GET PERSONALISED GUIDANCE" source="blog" blogSlug={post.slug}/></>
}

function FAQs({quote}){
  const questions=[['How do I choose the right health insurance?','Start with who needs cover, the likely medical needs, your budget, hospital preferences and the policy terms that matter. Compare coverage and exclusions, not just premium.'],['What is a waiting period?','It is the time you may need to wait before a specific condition or benefit is covered. The duration and applicability depend on the policy wording.'],['What is a family floater?','A family floater provides one shared sum insured for covered members of a family. Check eligibility, limits and how claims affect the remaining cover.'],['Can I port my health insurance policy?','Portability may allow you to move to another insurer at renewal while carrying certain continuity benefits. Start the process within the applicable renewal window.'],['What is term insurance?','Term insurance is life protection for a defined policy term. If the insured person dies during the term, the policy pays the applicable death benefit to the nominee, subject to its terms.'],['What is comprehensive motor insurance?','It generally combines third-party liability with own-damage protection, subject to deductibles, exclusions, IDV and add-ons in the policy.'],['Can I get help after buying a policy?','You can contact Insurance Gyani with questions about renewals, policy terms and service requirements. Always keep your policy documents accessible.']];
  return <><section className="section faq-page"><div className="container narrow"><span className="eyebrow">Frequently asked questions</span><h1>Clear answers to common questions.</h1><p className="lead">Use these as a starting point, then review the policy wording for your specific product.</p><div className="faq-list">{questions.map(([question,answer])=><details key={question}><summary>{question}<ChevronDown size={18}/></summary><p>{answer}</p></details>)}</div></div></section><CTA quote={quote} heading="Can't find your answer?" text="Share your question and our team can help you understand the general insurance process." button="ASK AN INSURANCE EXPERT" source="faq"/></>
}

function Legal({title}){
  return <section className="section"><div className="container narrow"><span className="eyebrow">Insurance Gyani</span><h1>{title}</h1><p className="lead">Insurance information on this website is educational and for general guidance. Product availability, benefits, exclusions, eligibility, underwriting and policy terms are subject to the respective insurer and policy wording.</p><h3>Website use</h3><p className="muted">Please use this website responsibly and do not submit sensitive identity or financial documents through the public lead form.</p><h3>Questions</h3><p className="muted">For help with your insurance requirement, call <a className="text-link" href={'tel:'+phone}>{phone}</a> or email <a className="text-link" href={'mailto:'+email}>{email}</a>.</p></div></section>
}

function Footer(){
  return <footer className="site-footer"><div className="container"><div className="footer-grid"><div><Link className="footer-brand" to="/"><img src="/insurance-gyani-logo-white-bg.png" alt="Insurance Gyani logo"/><span className="brand-word">Insurance<span>GYANI</span></span></Link><p className="footer-copy">Understand Insurance. Choose With Confidence.</p><div className="footer-contact"><a href={'tel:'+phone}>{phone}</a><a href={'mailto:'+email}>{email}</a></div><SocialLinks variant="footer-social"/></div><div className="footer-col"><h4>INSURANCE</h4><div className="footer-links">{insuranceNav.map(([label,path])=><Link key={path} to={path}>{label}</Link>)}<Link to="/other-insurance">Personal Accident</Link><Link to="/other-insurance">Travel Insurance</Link></div></div><div className="footer-col"><h4>COMPANY</h4><div className="footer-links"><Link to="/about">About Insurance Gyani</Link><Link to="/why-insurance-gyani">Why Insurance Gyani</Link><Link to="/become-insurance-advisor">Become Insurance Advisor</Link><Link to="/contact">Contact Us</Link></div></div><div className="footer-col"><h4>RESOURCES</h4><div className="footer-links"><Link to="/blogs">Blogs</Link><Link to="/faqs">Insurance FAQs</Link><Link to="/blogs">Insurance Guides</Link><Link to="/claims-support">Claims Support</Link><Link to="/blogs">Insurance Glossary</Link></div></div></div><div className="footer-bottom"><span>Insurance is the subject matter of solicitation.</span><div><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms">Terms &amp; Conditions</Link><Link to="/disclaimer">Disclaimer</Link><span>© 2026 Insurance Gyani. All Rights Reserved.</span></div></div></div></footer>
}

function Layout({children,quote}){return <><Header quote={quote}/>{children}<div className="float-actions"><a href={'tel:'+phone} aria-label="Call Insurance Gyani"><Phone size={20}/></a><a href={'https://wa.me/'+wa} target="_blank" rel="noreferrer" aria-label="WhatsApp Insurance Gyani"><MessageCircle size={20}/></a></div><Footer/></>}

function NotFound(){
  useSeo({title:'Page Not Found | Insurance Gyani',description:'The page you are looking for does not exist. Return to the Insurance Gyani homepage.',path:'/404'});
  return <section className="notfound"><div className="container nf-inner">
    <span className="ip-badge">ERROR 404</span>
    <h1 data-testid="notfound-title">Oops! This page doesn't exist.</h1>
    <p>The page you are looking for may have been moved, renamed or is no longer available.</p>
    <Link className="btn primary" to="/" data-testid="notfound-home"><ShieldCheck size={16}/> Back to Home</Link>
  </div></section>
}

function App(){
  const[leadType,setLeadType]=useState('Health Insurance'),[leadSource,setLeadSource]=useState('homepage'),[blogSlug,setBlogSlug]=useState(''),[show,setShow]=useState(false);
  const quote=(type,source='homepage',slug='')=>{setLeadType(type||'Health Insurance');setLeadSource(source);setBlogSlug(slug);setShow(true)};
  return <Layout quote={quote}><Routes><Route path="/" element={<Home quote={quote}/>}/><Route path="/health-insurance" element={<InsurancePage cfg={healthCfg} quote={quote}/>}/><Route path="/life-insurance" element={<InsurancePage cfg={termCfg} quote={quote}/>}/><Route path="/motor-insurance" element={<InsurancePage cfg={motorCfg} quote={quote}/>}/><Route path="/other-insurance" element={<Product type="Other" quote={quote}/>}/><Route path="/review-your-policy" element={<ReviewYourPolicy/>}/><Route path="/why-insurance-gyani" element={<WhyUs quote={quote}/>}/><Route path="/become-insurance-advisor" element={<BecomeAdvisor/>}/><Route path="/about" element={<About quote={quote}/>}/><Route path="/blogs" element={<Blogs quote={quote}/>}/><Route path="/blog/:slug" element={<Post quote={quote}/>}/><Route path="/claims-support" element={<ClaimsSupport quote={quote}/>}/><Route path="/contact" element={<Contact quote={quote}/>}/><Route path="/faqs" element={<FAQs quote={quote}/>}/><Route path="/admin/blogs" element={<AdminBlogs/>}/><Route path="/privacy-policy" element={<Legal title="Privacy Policy"/>}/><Route path="/terms" element={<Legal title="Terms & Conditions"/>}/><Route path="/disclaimer" element={<Legal title="Disclaimer"/>}/><Route path="*" element={<NotFound/>}/></Routes>{show&&<Lead initialType={leadType} source={leadSource} blogSlug={blogSlug} submitLabel={leadSource==='claims-support'?'GET CLAIM GUIDANCE':'GET PERSONALISED GUIDANCE'} close={()=>setShow(false)}/>}</Layout>
}

createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);