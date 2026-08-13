import React,{useEffect,useRef,useState}from'react';
import{createRoot}from'react-dom/client';
import{BrowserRouter,Routes,Route,Link,useLocation,useParams}from'react-router-dom';
import{ShieldCheck,HeartPulse,CarFront,Users,UsersRound,Bike,ArrowRight,Phone,MessageCircle,CheckCircle2,Menu,X,BookOpen,Mail,ChevronDown,LockKeyhole,UserRoundPlus,TrendingUp,Clock3,Headphones,Stethoscope,Plane,LifeBuoy,FileCheck,Hospital,ClipboardCheck,CircleHelp}from'lucide-react';
import{supabase}from'./supabase';
import'./styles.css';

const phone='9891510642',wa='919891510642',email='hello@insurancegyani.in';
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
      <Link className="nav-link" to="/why-insurance-gyani">Why Us</Link>
      <Link className="nav-link" to="/become-insurance-advisor">Become Advisor</Link>
      <Link className="nav-link" to="/blogs">Blogs</Link>
      <Link className="nav-link" to="/contact">Contact</Link>
    </nav>
    <button className="btn primary top-cta" onClick={()=>quote('Health Insurance')}>Get Free Quote <ArrowRight size={16}/></button>
  </div></header>;
}

function Lead({close,initialType='Health Insurance',source='homepage',blogSlug='',submitLabel='GET PERSONALISED GUIDANCE'}){
  const[sent,setSent]=useState(false),[busy,setBusy]=useState(false);
  const[f,setF]=useState({name:'',mobile:'',city:'',insurance_type:initialType,consent:false});
  const set=(key,value)=>setF(current=>({...current,[key]:value}));
  async function submit(event){
    event.preventDefault();
    if(!f.consent){window.alert('Please accept the consent.');return}
    setBusy(true);
    try{
      if(!supabase)throw Error('Database not configured');
       const{error}=await supabase.from('leads').insert([{...f,source,blog_slug:blogSlug||null}]);
      if(error)throw error;
      setSent(true);
     }catch(error){if(import.meta.env.DEV)console.error('Insurance lead submission failed:',error);window.alert("We couldn't submit your request right now. Please try again or call 9891510642.")}
    finally{setBusy(false)}
  }
  return <div className="backdrop" role="dialog" aria-modal="true"><div className="modal">
    <button className="modal-close" aria-label="Close form" onClick={close}><X size={18}/></button>
     {sent?<div className="success"><CheckCircle2 size={54}/><h2>Request Received</h2><p>Thank you for sharing your requirement.</p><p>Our Insurance Gyani team will get in touch with you shortly.</p><div className="success-actions"><a className="btn primary" href={'tel:'+phone}><Phone size={16}/> CALL NOW</a><a className="btn secondary" href={'https://wa.me/'+wa} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WHATSAPP</a></div><button className="btn secondary" onClick={close}>Close</button></div>:<>
      <small>FREE INSURANCE ASSISTANCE</small><h2>Tell us what you need</h2><p className="modal-intro">Share a few details and we will get in touch with clear, relevant guidance.</p>
      <form className="lead-form" onSubmit={submit}>
        <input required placeholder="Full name" value={f.name} onChange={e=>set('name',e.target.value)}/>
        <input required pattern="[0-9]{10}" placeholder="10-digit mobile" value={f.mobile} onChange={e=>set('mobile',e.target.value.replace(/\D/g,'').slice(0,10))}/>
        <select value={f.insurance_type} onChange={e=>set('insurance_type',e.target.value)}>{['Health Insurance','Life Insurance','Motor Insurance','Travel Insurance','Personal Accident','Other'].map(x=><option key={x}>{x}</option>)}</select>
        <input required placeholder="City" value={f.city} onChange={e=>set('city',e.target.value)}/>
        <label className="check-label"><input type="checkbox" checked={f.consent} onChange={e=>set('consent',e.target.checked)}/> <span>I agree to be contacted regarding my insurance requirement.</span></label>
        <button disabled={busy} className="btn primary full wide">{busy?'Submitting...':submitLabel} <ArrowRight size={16}/></button>
      </form>
    </>}</div></div>;
}

function formatDate(value){
  if(!value)return '—';
  const date=new Date(value);
  return Number.isNaN(date.getTime())?'—':date.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
}

function leadWhatsApp(mobile){
  const digits=String(mobile||'').replace(/\D/g,'');
  return 'https://wa.me/'+(digits.length===10?'91'+digits:digits);
}

function useAdminSession(){
  const[session,setSession]=useState(undefined);
  useEffect(()=>{
    if(!supabase){setSession(null);return}
    let active=true;
    supabase.auth.getSession().then(({data})=>{if(active)setSession(data.session)});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>setSession(next));
    return()=>{active=false;subscription.unsubscribe()}
  },[]);
  return session;
}

const leadStatuses=['New','Contacted','Follow-up','Interested','Converted','Not Interested'];
const advisorStatuses=['New','Contacted','Follow-up','Interested','Joined','Not Interested'];
const leadTypes=[['Health','Health Insurance'],['Life','Life Insurance'],['Motor','Motor Insurance'],['Personal Accident','Personal Accident'],['Travel','Travel Insurance'],['Other','Other']];

function AdminLocked({title,description}){
  return <section className="section"><div className="container narrow admin-locked"><span className="eyebrow">Protected workspace</span><h1>{title}</h1><p className="lead">{description}</p><div className="guidance-note"><LockKeyhole size={19}/><span>Admin data is available only to an authenticated Supabase administrator.</span></div><p className="muted">Setup note: enable Supabase Auth and mark approved users with <code>app_metadata.role = 'admin'</code>. The schema includes protected policies for this dashboard.</p></div></section>
}

function AdminLeads(){
  const session=useAdminSession(),[leads,setLeads]=useState([]),[statusFilter,setStatusFilter]=useState('All'),[typeFilter,setTypeFilter]=useState('All'),[search,setSearch]=useState(''),[message,setMessage]=useState('');
  useEffect(()=>{if(session)loadLeads()},[session]);
  async function loadLeads(){
    const{data,error}=await supabase.from('leads').select('id,name,mobile,insurance_type,city,source,created_at,status').order('created_at',{ascending:false});
    if(error)setMessage(error.message);else setLeads(data||[]);
  }
  async function updateStatus(id,status){
    const{error}=await supabase.from('leads').update({status}).eq('id',id);
    if(error)setMessage(error.message);else setLeads(current=>current.map(lead=>lead.id===id?{...lead,status}:lead));
  }
  if(session===undefined)return <section className="section"><div className="container narrow"><div className="empty-state">Checking admin access...</div></div></section>;
  if(!session)return <AdminLocked title="Lead Management" description="This dashboard is ready for authenticated administrators. Sign in through your existing Supabase Auth setup, then return here to review and update insurance enquiries."/>;
  const query=search.trim().toLowerCase();
  const filtered=leads.filter(lead=>(statusFilter==='All'||(lead.status||'New')===statusFilter)&&(typeFilter==='All'||lead.insurance_type===typeFilter)&&(!query||String(lead.name||'').toLowerCase().includes(query)||String(lead.mobile||'').includes(query)));
  return <section className="section"><div className="container admin-page"><div className="section-heading"><div><span className="eyebrow">Protected workspace</span><h1>Lead Management</h1></div><span className="admin-user">{session.user.email}</span></div>{message&&<div className="admin-message">{message}</div>}<div className="admin-filters"><input aria-label="Search leads" placeholder="Search by name or mobile" value={search} onChange={e=>setSearch(e.target.value)}/><select aria-label="Filter by status" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All</option>{leadStatuses.map(status=><option key={status}>{status}</option>)}</select><select aria-label="Filter by insurance type" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}><option>All</option>{leadTypes.map(([label,value])=><option key={value} value={value}>{label}</option>)}</select></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Mobile</th><th>Insurance Type</th><th>City</th><th>Source</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filtered.length?filtered.map(lead=><tr key={lead.id}><td>{lead.name}</td><td><a className="admin-phone" href={'tel:'+lead.mobile}>{lead.mobile}</a></td><td>{lead.insurance_type}</td><td>{lead.city||'—'}</td><td>{lead.source||'homepage'}</td><td>{formatDate(lead.created_at)}</td><td><select value={lead.status||'New'} onChange={e=>updateStatus(lead.id,e.target.value)}>{leadStatuses.map(status=><option key={status}>{status}</option>)}</select></td><td><div className="admin-row-actions"><a className="btn secondary" href={'tel:'+lead.mobile}>CALL</a><a className="btn secondary" href={leadWhatsApp(lead.mobile)} target="_blank" rel="noreferrer">WHATSAPP</a></div></td></tr>):<tr><td colSpan="8"><div className="empty-state">No leads match these filters.</div></td></tr>}</tbody></table></div></div></section>
}

function AdminAdvisorLeads(){
  const session=useAdminSession(),[leads,setLeads]=useState([]),[statusFilter,setStatusFilter]=useState('All'),[message,setMessage]=useState('');
  useEffect(()=>{if(session)loadLeads()},[session]);
  async function loadLeads(){
    const{data,error}=await supabase.from('advisor_leads').select('id,name,mobile,email,city,experience,status,created_at').order('created_at',{ascending:false});
    if(error)setMessage(error.message);else setLeads(data||[]);
  }
  async function updateStatus(id,status){
    const{error}=await supabase.from('advisor_leads').update({status}).eq('id',id);
    if(error)setMessage(error.message);else setLeads(current=>current.map(lead=>lead.id===id?{...lead,status}:lead));
  }
  if(session===undefined)return <section className="section"><div className="container narrow"><div className="empty-state">Checking admin access...</div></div></section>;
  if(!session)return <AdminLocked title="Advisor Lead Management" description="This dashboard is ready for authenticated administrators. Sign in through your existing Supabase Auth setup, then return here to review advisor enquiries."/>;
  const filtered=leads.filter(lead=>statusFilter==='All'||(lead.status||'New')===statusFilter);
  return <section className="section"><div className="container admin-page"><div className="section-heading"><div><span className="eyebrow">Protected workspace</span><h1>Advisor Leads</h1></div><span className="admin-user">{session.user.email}</span></div>{message&&<div className="admin-message">{message}</div>}<div className="admin-filters"><select aria-label="Filter advisor leads by status" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All</option>{advisorStatuses.map(status=><option key={status}>{status}</option>)}</select></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Mobile</th><th>Email</th><th>City</th><th>Experience</th><th>Status</th><th>Date</th></tr></thead><tbody>{filtered.length?filtered.map(lead=><tr key={lead.id}><td>{lead.name}</td><td><a className="admin-phone" href={'tel:'+lead.mobile}>{lead.mobile}</a></td><td>{lead.email||'—'}</td><td>{lead.city||'—'}</td><td>{lead.experience||'—'}</td><td><select value={lead.status||'New'} onChange={e=>updateStatus(lead.id,e.target.value)}>{advisorStatuses.map(status=><option key={status}>{status}</option>)}</select></td><td>{formatDate(lead.created_at)}</td></tr>):<tr><td colSpan="7"><div className="empty-state">No advisor leads match this filter.</div></td></tr>}</tbody></table></div></div></section>
}

function AdvisorLead(){
  const[sent,setSent]=useState(false),[busy,setBusy]=useState(false);
  const[f,setF]=useState({name:'',mobile:'',email:'',city:'',experience:'',employment:'',message:'',consent:false});
  const set=(key,value)=>setF(current=>({...current,[key]:value}));
  async function submit(event){
    event.preventDefault();
    if(!f.consent){window.alert('Please accept the consent.');return}
    setBusy(true);
    try{
      if(!supabase)throw Error('Database not configured');
      const{error}=await supabase.from('advisor_leads').insert([f]);
      if(error)throw error;
      setSent(true);
    }catch(error){console.error(error);window.alert('Unable to submit right now. Please call us at 9891510642.')}
    finally{setBusy(false)}
  }
  return <div className="advisor-form">{sent?<div className="success"><CheckCircle2 size={50}/><h3>Thank you for your interest.</h3><p>We have received your details. Our team will get in touch with you.</p></div>:<>
    <div className="form-head"><span className="eyebrow">Start your insurance career</span><h2>Become an Insurance Advisor</h2><p>Leave your details and our team will contact you about the opportunity.</p></div>
    <form className="form-grid" onSubmit={submit}>
      <input required placeholder="Full name" value={f.name} onChange={e=>set('name',e.target.value)}/>
      <input required pattern="[0-9]{10}" placeholder="10-digit mobile" value={f.mobile} onChange={e=>set('mobile',e.target.value.replace(/\D/g,'').slice(0,10))}/>
      <input type="email" placeholder="Email" value={f.email} onChange={e=>set('email',e.target.value)}/>
      <input required placeholder="City" value={f.city} onChange={e=>set('city',e.target.value)}/>
      <select value={f.experience} onChange={e=>set('experience',e.target.value)}><option value="">Insurance experience</option><option>New to insurance</option><option>Already an advisor</option><option>Sales / financial services experience</option></select>
      <select value={f.employment} onChange={e=>set('employment',e.target.value)}><option value="">Current work status</option><option>Full-time job</option><option>Part-time / business</option><option>Self-employed</option><option>Looking for an opportunity</option></select>
      <textarea className="wide" placeholder="Tell us a little about yourself" value={f.message} onChange={e=>set('message',e.target.value)}/>
      <label className="check-label"><input type="checkbox" checked={f.consent} onChange={e=>set('consent',e.target.checked)}/><span>I agree to be contacted about the insurance advisor opportunity.</span></label>
      <button disabled={busy} className="btn primary full wide">{busy?'Submitting...':'Register Your Interest'} <ArrowRight size={16}/></button>
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
  return <section className="cta help-cta"><div className="container cta-panel"><div><span className="eyebrow">Talk to our team</span><h2>Have an Insurance Question?</h2><p>Whether you're exploring a new policy, reviewing existing coverage or trying to understand a claim process, you can share your requirement with us.</p><a className="help-email" href={'mailto:'+email}>{email}</a></div><div className="help-actions"><a className="btn white" href={'tel:'+phone}><Phone size={16}/> CALL {phone}</a><a className="btn secondary" href={'https://wa.me/'+wa} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WHATSAPP</a><button className="btn primary" onClick={()=>quote('Health Insurance','homepage')}>GET GUIDANCE <ArrowRight size={16}/></button></div></div></section>
}

function escapeHtml(value){
  return String(value||'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function inlineMarkdown(value){
  let html=escapeHtml(value);
  html=html.replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/gi,'<img class="article-inline-image" src="$2" alt="$1" />');
  html=html.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/gi,'<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  html=html.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/__([^_]+)__/g,'<strong>$1</strong>');
  html=html.replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/_([^_]+)_/g,'<em>$1</em>');
  return html;
}

function renderBlogContent(content){
  const elements=[],lines=String(content||'').split(/\r?\n/);
  let listType=null,items=[];
  const flushList=()=>{
    if(!listType||!items.length)return;
    const Tag=listType==='ol'?'ol':'ul';
    elements.push(<Tag className="article-list" key={'list-'+elements.length}>{items.map((item,index)=><li key={index} dangerouslySetInnerHTML={{__html:inlineMarkdown(item)}}/>)}</Tag>);
    listType=null;items=[]
  };
  lines.forEach((line,index)=>{
    const trimmed=line.trim();
    if(/^[-*]\s+/.test(trimmed)){if(listType!=='ul'){flushList();listType='ul'}items.push(trimmed.replace(/^[-*]\s+/,''));return}
    if(/^\d+\.\s+/.test(trimmed)){if(listType!=='ol'){flushList();listType='ol'}items.push(trimmed.replace(/^\d+\.\s+/,''));return}
    flushList();
    if(!trimmed)return;
    if(/^###\s+/.test(trimmed))elements.push(<h3 key={index} dangerouslySetInnerHTML={{__html:inlineMarkdown(trimmed.replace(/^###\s+/,''))}}/>);
    else if(/^##\s+/.test(trimmed))elements.push(<h2 key={index} dangerouslySetInnerHTML={{__html:inlineMarkdown(trimmed.replace(/^##\s+/,''))}}/>);
    else if(/^#\s+/.test(trimmed))elements.push(<h2 key={index} dangerouslySetInnerHTML={{__html:inlineMarkdown(trimmed.replace(/^#\s+/,''))}}/>);
    else elements.push(<p key={index} dangerouslySetInnerHTML={{__html:inlineMarkdown(trimmed)}}/>)
  });
  flushList();
  return elements;
}

function AdminBlogs(){
  const blank={title:'',slug:'',category:'Health Insurance',excerpt:'',cover_image:'',content:'',seo_title:'',meta_description:'',keywords:'',published:false,published_at:''};
  const session=useAdminSession(),[posts,setPosts]=useState([]),[form,setForm]=useState(blank),[editing,setEditing]=useState(null),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
  const contentRef=useRef(null),categories=['Health Insurance','Life Insurance','Motor Insurance','Claims','Insurance Tips','Insurance FAQs'];
  useEffect(()=>{if(session)load()},[session]);
  async function load(){if(!supabase)return;const{data,error}=await supabase.from('blogs').select('*').order('created_at',{ascending:false});if(error)setMessage(error.message);else setPosts(data||[])}
  const set=(key,value)=>setForm(current=>({...current,[key]:value}));
  function edit(post){setEditing(post.id);setForm({...blank,...post,published_at:post.published_at?String(post.published_at).slice(0,10):''});window.scrollTo({top:0,behavior:'smooth'})}
  function reset(){setEditing(null);setForm(blank)}
  function insertMarkdown(before,after='',placeholder='text'){
    const element=contentRef.current;
    if(!element)return;
    const start=element.selectionStart,end=element.selectionEnd,selected=form.content.slice(start,end)||placeholder;
    const next=form.content.slice(0,start)+before+selected+after+form.content.slice(end);
    set('content',next);
    requestAnimationFrame(()=>{element.focus();const cursor=start+before.length+selected.length+after.length;element.setSelectionRange(cursor,cursor)})
  }
  async function save(event,publishOverride=form.published){
    event.preventDefault();setBusy(true);setMessage('');
    const slug=form.slug||form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    const published=publishOverride;
    const payload={title:form.title,slug,category:form.category,excerpt:form.excerpt,cover_image:form.cover_image,content:form.content,seo_title:form.seo_title,meta_description:form.meta_description,keywords:form.keywords,published,published_at:published?(form.published_at||new Date().toISOString()):null,updated_at:new Date().toISOString()};
    const result=editing?await supabase.from('blogs').update(payload).eq('id',editing):await supabase.from('blogs').insert([payload]);
    if(result.error)setMessage(result.error.message);else{setMessage(editing?(published?'Blog published.':'Draft saved.'):'Blog created.');reset();await load()}
    setBusy(false)
  }
  async function togglePublished(post){
    const published=!post.published,{error}=await supabase.from('blogs').update({published,published_at:published?(post.published_at||new Date().toISOString()):null,updated_at:new Date().toISOString()}).eq('id',post.id);
    if(error)setMessage(error.message);else{setMessage(published?'Blog published.':'Blog unpublished.');await load()}
  }
  async function remove(id){if(!window.confirm('Delete this blog?'))return;const{error}=await supabase.from('blogs').delete().eq('id',id);if(error)setMessage(error.message);else{setMessage('Blog deleted.');await load()}}
  if(session===undefined)return <section className="section"><div className="container narrow"><div className="empty-state">Checking admin access...</div></div></section>;
  if(!session)return <AdminLocked title="Blog Management" description="This area is ready for Supabase Auth administrators. Sign in through your existing Supabase Auth setup, then return here to create and manage published articles."/>;
  return <section className="section"><div className="container admin-page"><div className="section-heading"><div><span className="eyebrow">Protected workspace</span><h1>Blog Management</h1></div><span className="admin-user">{session.user.email}</span></div>{message&&<div className="admin-message">{message}</div>}<form className="admin-form" onSubmit={e=>save(e,form.published)}><input required placeholder="Blog Title" value={form.title} onChange={e=>set('title',e.target.value)}/><input placeholder="Slug (optional)" value={form.slug} onChange={e=>set('slug',e.target.value)}/><select value={form.category} onChange={e=>set('category',e.target.value)}>{categories.map(category=><option key={category}>{category}</option>)}</select><input placeholder="Cover Image URL" value={form.cover_image} onChange={e=>set('cover_image',e.target.value)}/><input className="wide" placeholder="Short Description" value={form.excerpt} onChange={e=>set('excerpt',e.target.value)}/><div className="editor-field wide"><div className="editor-toolbar"><button type="button" onClick={()=>insertMarkdown('## ','','Heading')}>Heading</button><button type="button" onClick={()=>insertMarkdown('','','Paragraph')}>Paragraph</button><button type="button" onClick={()=>insertMarkdown('**','**','bold')}>Bold</button><button type="button" onClick={()=>insertMarkdown('*','*','italic')}>Italic</button><button type="button" onClick={()=>insertMarkdown('- ','','bullet item')}>Bullet List</button><button type="button" onClick={()=>insertMarkdown('1. ','','numbered item')}>Numbered List</button><button type="button" onClick={()=>insertMarkdown('[','](https://example.com)','link text')}>Link</button><button type="button" onClick={()=>insertMarkdown('![',' ](https://example.com/image.jpg)','image alt text')}>Image</button></div><textarea ref={contentRef} required placeholder="Blog Content — use the toolbar for basic formatting" value={form.content} onChange={e=>set('content',e.target.value)}/></div><input placeholder="SEO Title" value={form.seo_title} onChange={e=>set('seo_title',e.target.value)}/><input placeholder="SEO Description" value={form.meta_description} onChange={e=>set('meta_description',e.target.value)}/><input placeholder="Tags" value={form.keywords} onChange={e=>set('keywords',e.target.value)}/><input type="date" value={form.published_at} onChange={e=>set('published_at',e.target.value)}/><label className="check-label"><input type="checkbox" checked={form.published} onChange={e=>set('published',e.target.checked)}/><span>Published</span></label><div className="admin-form-actions"><button type="button" className="btn secondary" disabled={busy} onClick={e=>save(e,false)}>Save Draft</button><button type="button" className="btn primary" disabled={busy} onClick={e=>save(e,true)}>{busy?'Saving...':editing?'Publish / Update':'Publish'}</button>{editing&&<button type="button" className="btn secondary" onClick={reset}>Cancel</button>}</div></form><div className="admin-list"><h2>Articles</h2>{posts.length?posts.map(post=><article className="admin-row" key={post.id}><div><span className="category">{post.category}</span><h3>{post.title}</h3><small>{post.published?'Published':'Draft'} · {formatDate(post.published_at||post.created_at)} · {post.slug}</small></div><div className="admin-row-actions"><button className="btn secondary" onClick={()=>edit(post)}>Edit</button><button className="btn secondary" onClick={()=>togglePublished(post)}>{post.published?'Unpublish':'Publish'}</button><button className="btn secondary danger" onClick={()=>remove(post.id)}>Delete</button></div></article>):<div className="empty-state">No articles yet.</div>}</div></div></section>
}

function Home({quote}){
  return <><main><section className="hero"><div className="container hero-grid"><div><span className="eyebrow">Insurance made simple</span><h1>Protect What Matters.<em>Plan What’s Ahead.</em></h1><p className="hero-copy">Get personalised guidance for Health, Life and Motor Insurance — understand your options and make an informed decision.</p><div className="actions"><button className="btn primary" onClick={()=>quote('Health Insurance','homepage')}>Get Free Quote <ArrowRight size={16}/></button><a className="btn secondary" href={'tel:'+phone}><Phone size={16}/> Talk to an Expert</a></div><div className="trust-row"><span><CheckCircle2/> Clear guidance</span><span><CheckCircle2/> Easy process</span><span><CheckCircle2/> Continued support</span></div></div><div className="hero-visual"><div className="hero-panel"><div className="hero-orb"><ShieldCheck size={67}/></div><h3>Protection, with perspective.</h3><p>Understand coverage, exclusions and policy terms before you decide.</p></div><div className="floating-product"><HeartPulse/><b>Health</b><small>Protection</small></div><div className="floating-product"><CarFront/><b>Motor</b><small>Assistance</small></div></div></div></section><section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Insurance solutions</span><h2>Protection for the things that matter.</h2></div><p>Explore the basics first, then have a conversation about what fits your life.</p></div><ProductCards quote={quote}/></div></section><Finder quote={quote}/><WhySection/><TrustSection/><Process/><section className="section"><div className="container knowledge-grid"><div className="knowledge-list">{[['What is Health Insurance?',HeartPulse,'Start with hospitalisation, family cover and the terms that shape a policy.'],['What is Term Insurance?',ShieldCheck,'Understand financial protection for the people who depend on you.'],['What is Motor Insurance?',CarFront,'Know the difference between own damage, IDV and third-party cover.'],['What is a Waiting Period?',Clock3,'A simple explanation of when specific benefits become available.']].map(([title,Icon,text])=><article className="knowledge-card" key={title}><Icon size={22}/><h3>{title}</h3><p>{text}</p></article>)}</div><div className="knowledge-aside"><span className="eyebrow">Insurance Gyani Knowledge Center</span><h2>Good questions lead to better protection.</h2><p className="muted">Read straightforward guides written to help you enter an insurance conversation with confidence.</p><Link className="btn secondary" to="/blogs">Browse all guides <ArrowRight size={16}/></Link></div></div></section><AdvisorBand/><BlogsPreview/><CTA quote={quote}/></main></>
}

function Product({type,quote}){
  const data={Health:['Health Insurance','Protect yourself and your family against unexpected medical expenses.',['Individual Health Insurance','Family Health Insurance','Senior Citizen Health Insurance','Maternity Insurance','Critical Illness Insurance','Top-up & Super Top-up','Personal Accident Insurance','Health Insurance Portability'],HeartPulse],Life:['Life Insurance','Create financial protection for the people who depend on you.',['Term Insurance','Life Protection','Family Financial Protection','Income Protection','Long-term Protection'],ShieldCheck],Motor:['Motor Insurance','Protect your car or two-wheeler from unexpected financial losses.',['Car Insurance','Two-Wheeler Insurance','Comprehensive Insurance','Third Party Insurance','Own Damage','Motor Renewal'],CarFront],Other:['Other Insurance','Explore protection for travel, accidents and other everyday risks.',['Travel Insurance','Personal Accident Insurance','Other Protection Requirements'],Plane]}[type];
  const Icon=data[3];
  const cta={Health:['Not sure which health insurance is right for you?','GET PERSONAL GUIDANCE','health-page'],Life:['Planning protection for your family?','TALK TO AN EXPERT','life-page'],Motor:['Looking for the right motor cover?','GET A QUOTE','motor-page'],Other:['Have an insurance question?','GET PERSONAL GUIDANCE','contact']}[type];
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
  return <><section className="inner-hero"><div className="container"><span className="eyebrow">About Insurance Gyani</span><h1>Insurance, in a language people can use.</h1><p>Insurance Gyani is an insurance education and assistance platform created to make insurance easier to understand.</p></div></section><section className="section"><div className="container about-intro"><div><span className="eyebrow">Our mission</span><h2>Make protection decisions feel more informed.</h2><p>To make insurance easier to understand and help people make more informed protection decisions.</p></div><div className="mission-card"><ShieldCheck size={34}/><h3>Understand first. Choose with confidence.</h3><p>We believe an insurance conversation should leave you clearer, not more overwhelmed.</p></div></div></section><section className="section light-band"><div className="container"><span className="eyebrow">What we help with</span><h2>Guidance across the protection journey.</h2><div className="help-grid">{help.map(([title,Icon,text])=><article className="help-card" key={title}><Icon size={23}/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section><CTA quote={quote}/></>
}

function Contact({quote}){
  return <><section className="contact"><div className="container contact-layout"><div><span className="eyebrow">Contact Insurance Gyani</span><h1>Let’s talk about your insurance requirement.</h1><p className="contact-intro">Need help with health, life, motor or other insurance? Get in touch with our team.</p><div className="contact-items"><a className="contact-item" href={'tel:'+phone}><Phone/><span><strong>Call us</strong>{phone}</span></a><a className="contact-item" href={'mailto:'+email}><Mail/><span><strong>Email</strong>{email}</span></a><a className="contact-item" href={'https://wa.me/'+wa} target="_blank" rel="noreferrer"><MessageCircle/><span><strong>WhatsApp</strong>Chat with us</span></a></div><div className="contact-actions"><a className="btn primary" href={'tel:'+phone}><Phone size={16}/> Call Now</a><a className="btn secondary" href={'https://wa.me/'+wa} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a><button className="btn secondary" onClick={()=>quote('Health Insurance','contact')}>Get Free Quote <ArrowRight size={16}/></button></div></div><div className="contact-card"><LockKeyhole size={30}/><h3>Your information stays private.</h3><p>We use submitted details only to respond to your insurance requirement. Do not share sensitive financial or identity documents through the form.</p><button className="btn primary full" onClick={()=>quote('Health Insurance','contact')}>Start Your Requirement <ArrowRight size={16}/></button></div></div></section><HelpCTA quote={quote}/></>
}

function Blogs({quote}){
  const[posts,setPosts]=useState([]),[loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;(async()=>{if(!supabase){setLoading(false);return}const{data}=await supabase.from('blogs').select('*').eq('published',true).order('published_at',{ascending:false});if(active)setPosts(data||[]);setLoading(false)})();return()=>{active=false}},[]);
  return <><section className="section"><div className="container"><span className="eyebrow">Insurance Gyani Knowledge Center</span><h1>Insurance, explained clearly.</h1><p className="lead">Simple explanations and practical education for health, life, motor and everyday protection questions.</p>{loading?<div className="empty-state">Loading published articles...</div>:posts.length?<div className="blogs-grid">{posts.map(post=><article className="blog-card" key={post.slug}><div className="blog-art">{post.cover_image?<img src={post.cover_image} alt="" />:<BookOpen size={30}/>}</div><div className="blog-content"><span className="category">{post.category||'Insurance Tips'}</span><h3>{post.title}</h3><p>{post.excerpt}</p><small className="blog-date">{formatDate(post.published_at||post.created_at)}</small><Link className="text-link" to={'/blog/'+post.slug}>Read article <ArrowRight size={15}/></Link></div></article>)}</div>:<div className="empty-state">New articles are on the way. In the meantime, call us for help understanding your insurance requirement.</div>}</div></section><CTA quote={quote} heading="Still confused about your insurance?" text="Get personalised guidance based on your requirement." button="GET PERSONALISED GUIDANCE" source="blog"/></>
}

function Post({quote}){
  const{slug}=useParams(),[post,setPost]=useState(null),[loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;(async()=>{if(!supabase){setLoading(false);return}const{data}=await supabase.from('blogs').select('*').eq('slug',slug).eq('published',true).single();if(active)setPost(data||null);setLoading(false)})();return()=>{active=false}},[slug]);
  useEffect(()=>{
    if(!post)return;
    document.title=post.seo_title||post.title||'Insurance Gyani';
    let meta=document.querySelector('meta[name="description"]');
    if(!meta){meta=document.createElement('meta');meta.name='description';document.head.appendChild(meta)}
    meta.content=post.meta_description||post.excerpt||post.title||'Insurance guidance from Insurance Gyani.';
    return()=>{document.title='Insurance Gyani'}
  },[post]);
  if(loading)return <section className="section narrow"><div className="empty-state">Loading article...</div></section>;
  if(!post)return <section className="section narrow"><span className="eyebrow">Knowledge Center</span><h1>Article not found</h1><Link className="btn secondary" to="/blogs">Back to Blogs <ArrowRight size={16}/></Link></section>;
  return <><section className="section"><div className="container article"><span className="eyebrow">{post.category||'Insurance Tips'}</span><h1>{post.title}</h1><small className="blog-date">{formatDate(post.published_at||post.created_at)}</small>{post.cover_image&&<img className="article-cover" src={post.cover_image} alt="" />}<p className="lead">{post.excerpt}</p><div className="article-content">{renderBlogContent(post.content)}</div></div></section><CTA quote={quote} heading="Still confused about your insurance?" text="Get personalised guidance based on your requirement." button="GET PERSONALISED GUIDANCE" source="blog" blogSlug={post.slug}/></>
}

function FAQs({quote}){
  const questions=[['How do I choose the right health insurance?','Start with who needs cover, the likely medical needs, your budget, hospital preferences and the policy terms that matter. Compare coverage and exclusions, not just premium.'],['What is a waiting period?','It is the time you may need to wait before a specific condition or benefit is covered. The duration and applicability depend on the policy wording.'],['What is a family floater?','A family floater provides one shared sum insured for covered members of a family. Check eligibility, limits and how claims affect the remaining cover.'],['Can I port my health insurance policy?','Portability may allow you to move to another insurer at renewal while carrying certain continuity benefits. Start the process within the applicable renewal window.'],['What is term insurance?','Term insurance is life protection for a defined policy term. If the insured person dies during the term, the policy pays the applicable death benefit to the nominee, subject to its terms.'],['What is comprehensive motor insurance?','It generally combines third-party liability with own-damage protection, subject to deductibles, exclusions, IDV and add-ons in the policy.'],['Can I get help after buying a policy?','You can contact Insurance Gyani with questions about renewals, policy terms and service requirements. Always keep your policy documents accessible.']];
  return <><section className="section faq-page"><div className="container narrow"><span className="eyebrow">Frequently asked questions</span><h1>Clear answers to common questions.</h1><p className="lead">Use these as a starting point, then review the policy wording for your specific product.</p><div className="faq-list">{questions.map(([question,answer])=><details key={question}><summary>{question}<ChevronDown size={18}/></summary><p>{answer}</p></details>)}</div></div></section><CTA quote={quote} heading="Can't find your answer?" text="Share your question and our team can help you understand the general insurance process." button="ASK AN INSURANCE EXPERT" source="faq"/></>
}

function Legal({title}){
  return <section className="section"><div className="container narrow"><span className="eyebrow">Insurance Gyani</span><h1>{title}</h1><p className="lead">Insurance information on this website is educational and for general guidance. Product availability, benefits, exclusions, eligibility, underwriting and policy terms are subject to the respective insurer and policy wording.</p><h3>Website use</h3><p className="muted">Please use this website responsibly and do not submit sensitive identity or financial documents through the public lead form.</p><h3>Questions</h3><p className="muted">For help with your insurance requirement, call <a className="text-link" href={'tel:'+phone}>{phone}</a> or email <a className="text-link" href={'mailto:'+email}>{email}</a>.</p></div></section>
}

function Footer(){
  return <footer className="site-footer"><div className="container"><div className="footer-grid"><div><Link className="footer-brand" to="/"><img src="/insurance-gyani-logo-white-bg.png" alt="Insurance Gyani logo"/><span className="brand-word">Insurance<span>GYANI</span></span></Link><p className="footer-copy">Understand Insurance. Choose With Confidence.</p><div className="footer-contact"><a href={'tel:'+phone}>{phone}</a><a href={'mailto:'+email}>{email}</a></div></div><div className="footer-col"><h4>INSURANCE</h4><div className="footer-links">{insuranceNav.map(([label,path])=><Link key={path} to={path}>{label}</Link>)}<Link to="/other-insurance">Personal Accident</Link><Link to="/other-insurance">Travel Insurance</Link></div></div><div className="footer-col"><h4>COMPANY</h4><div className="footer-links"><Link to="/about">About Insurance Gyani</Link><Link to="/why-insurance-gyani">Why Insurance Gyani</Link><Link to="/become-insurance-advisor">Become Insurance Advisor</Link><Link to="/contact">Contact Us</Link></div></div><div className="footer-col"><h4>RESOURCES</h4><div className="footer-links"><Link to="/blogs">Blogs</Link><Link to="/faqs">Insurance FAQs</Link><Link to="/blogs">Insurance Guides</Link><Link to="/claims-support">Claims Support</Link><Link to="/blogs">Insurance Glossary</Link></div></div></div><div className="footer-bottom"><span>Insurance is the subject matter of solicitation.</span><div><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms">Terms &amp; Conditions</Link><Link to="/disclaimer">Disclaimer</Link><span>© 2026 Insurance Gyani. All Rights Reserved.</span></div></div></div></footer>
}

function Layout({children,quote}){return <><Header quote={quote}/>{children}<div className="float-actions"><a href={'tel:'+phone} aria-label="Call Insurance Gyani"><Phone size={20}/></a><a href={'https://wa.me/'+wa} target="_blank" rel="noreferrer" aria-label="WhatsApp Insurance Gyani"><MessageCircle size={20}/></a></div><Footer/></>}

function App(){
  const[leadType,setLeadType]=useState('Health Insurance'),[leadSource,setLeadSource]=useState('homepage'),[blogSlug,setBlogSlug]=useState(''),[show,setShow]=useState(false);
  const quote=(type,source='homepage',slug='')=>{setLeadType(type||'Health Insurance');setLeadSource(source);setBlogSlug(slug);setShow(true)};
  return <Layout quote={quote}><Routes><Route path="/" element={<Home quote={quote}/>}/><Route path="/health-insurance" element={<Product type="Health" quote={quote}/>}/><Route path="/life-insurance" element={<Product type="Life" quote={quote}/>}/><Route path="/motor-insurance" element={<Product type="Motor" quote={quote}/>}/><Route path="/other-insurance" element={<Product type="Other" quote={quote}/>}/><Route path="/why-insurance-gyani" element={<WhyUs quote={quote}/>}/><Route path="/become-insurance-advisor" element={<BecomeAdvisor/>}/><Route path="/about" element={<About quote={quote}/>}/><Route path="/blogs" element={<Blogs quote={quote}/>}/><Route path="/blog/:slug" element={<Post quote={quote}/>}/><Route path="/claims-support" element={<ClaimsSupport quote={quote}/>}/><Route path="/contact" element={<Contact quote={quote}/>}/><Route path="/faqs" element={<FAQs quote={quote}/>}/><Route path="/admin/leads" element={<AdminLeads/>}/><Route path="/admin/advisor-leads" element={<AdminAdvisorLeads/>}/><Route path="/admin/blogs" element={<AdminBlogs/>}/><Route path="/privacy-policy" element={<Legal title="Privacy Policy"/>}/><Route path="/terms" element={<Legal title="Terms & Conditions"/>}/><Route path="/disclaimer" element={<Legal title="Disclaimer"/>}/></Routes>{show&&<Lead initialType={leadType} source={leadSource} blogSlug={blogSlug} submitLabel={leadSource==='claims-support'?'GET CLAIM GUIDANCE':'GET PERSONALISED GUIDANCE'} close={()=>setShow(false)}/>}</Layout>
}

createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);