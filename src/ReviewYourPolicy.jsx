import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  Clock, 
  Sliders, 
  Upload, 
  X, 
  ArrowRight,
  ChevronDown,
  Info,
  CheckCircle2,
  BookOpen,
  Users,
  LockKeyhole
} from 'lucide-react';
import { supabase } from './supabase';

const companyLists = {
  "Health Insurance": [
    "Aditya Birla Health Insurance", "Care Health Insurance", "ManipalCigna Health Insurance",
    "Narayana Health Insurance", "Niva Bupa Health Insurance", "Star Health & Allied Insurance",
    "ACKO General Insurance", "Bajaj General Insurance", "Cholamandalam MS General Insurance",
    "Generali Central Insurance", "Go Digit General Insurance", "HDFC ERGO General Insurance",
    "ICICI Lombard General Insurance", "IFFCO Tokio General Insurance", "Zurich Kotak General Insurance",
    "Liberty General Insurance", "Magma General Insurance", "National Insurance", "Navi General Insurance",
    "Raheja QBE General Insurance", "Reliance General Insurance", "Royal Sundaram General Insurance",
    "SBI General Insurance", "Shriram General Insurance", "Tata AIG General Insurance",
    "The New India Assurance", "The Oriental Insurance", "United India Insurance",
    "Universal Sompo General Insurance", "Zuno General Insurance", "Other / Not Listed"
  ],
  "Life Insurance": [
    "Life Insurance Corporation of India (LIC)", "Acko Life Insurance", "Axis Max Life Insurance",
    "HDFC Life Insurance", "ICICI Prudential Life Insurance", "Kotak Mahindra Life Insurance",
    "Aditya Birla Sun Life Insurance", "Tata AIA Life Insurance", "SBI Life Insurance",
    "Bajaj Life Insurance", "PNB MetLife India Insurance", "IndusInd Nippon Life Insurance",
    "Aviva Life Insurance", "Shriram Life Insurance", "Generali Central Life Insurance",
    "Ageas Federal Life Insurance", "Canara HSBC Life Insurance", "Bandhan Life Insurance",
    "Pramerica Life Insurance", "IndiaFirst Life Insurance", "Edelweiss Life Insurance",
    "Star Union Dai-ichi Life Insurance", "Other / Not Listed"
  ],
  "Motor Insurance": [
    "ACKO General Insurance", "Bajaj General Insurance", "Cholamandalam MS General Insurance",
    "Generali Central Insurance", "Go Digit General Insurance", "HDFC ERGO General Insurance",
    "ICICI Lombard General Insurance", "IFFCO Tokio General Insurance", "Zurich Kotak General Insurance",
    "Liberty General Insurance", "Magma General Insurance", "National Insurance", "Navi General Insurance",
    "Raheja QBE General Insurance", "Reliance General Insurance", "Royal Sundaram General Insurance",
    "SBI General Insurance", "Shriram General Insurance", "Tata AIG General Insurance",
    "The New India Assurance", "The Oriental Insurance", "United India Insurance",
    "Universal Sompo General Insurance", "Zuno General Insurance", "Other / Not Listed"
  ],
  "Investment": []
};

function IpIcon({Icon}){
  return <span className="ip-ic"><Icon size={22}/></span>;
}

export default function ReviewYourPolicy() {
  const formRef = useRef(null);

  useEffect(() => {
    document.title = "Review Your Policy | Insurance Gyani";
    let metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", "Share your existing insurance policy with Insurance Gyani and get important coverage, exclusions, waiting periods, limits and conditions reviewed by our team.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Share your existing insurance policy with Insurance Gyani and get important coverage, exclusions, waiting periods, limits and conditions reviewed by our team.";
      document.head.appendChild(meta);
    }
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    policyType: 'Health Insurance',
    companyName: '',
    investmentProvider: '',
    planName: '',
    consent: false
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileError('File size must be less than 10 MB.');
        return;
      }
      setFileError('');
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileError('File size must be less than 10 MB.');
        return;
      }
      setFileError('');
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!formData.name || !formData.policyType || (!formData.companyName && formData.policyType !== 'Investment') || !selectedFile || !formData.consent) {
      alert('Please fill in all mandatory fields and upload your policy document.');
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedFileUrl = null;

      if (supabase && selectedFile) {
        // 1. Upload file to Supabase Storage bucket named 'policy-files'
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `policies/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('policy-files')
          .upload(filePath, selectedFile);

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
        } else {
          // 2. Get Public URL of the uploaded file
          const { data: urlData } = supabase.storage
            .from('policy-files')
            .getPublicUrl(filePath);

          uploadedFileUrl = urlData.publicUrl;
        }

        // 3. Insert submission record into database
        const { error } = await supabase.from('policy_submissions').insert([{
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email ? formData.email.trim() : null,
          policy_type: formData.policyType,
          company_name: formData.companyName || formData.investmentProvider || null,
          plan_name: formData.planName ? formData.planName.trim() : null,
          consent: formData.consent,
          file_url: uploadedFileUrl
        }]);

        if (error) {
          console.error("Supabase insert warning:", error);
        }
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const filteredCompanies = (companyLists[formData.policyType] || []).filter(c => 
    c.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <main>
      {/* HERO SECTION */}
      <section className="ip-hero">
        <div className="container text-center" style={{ maxWidth: '850px' }}>
          <span className="ip-badge">REVIEW YOUR POLICY</span>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 60px)', lineHeight: '1.15' }}>Is Your Health Insurance Policy Giving You the Coverage You Really Need?</h1>
          <p style={{ fontStyle: 'italic', color: 'var(--gold)', fontSize: '18px', fontWeight: '700', margin: '14px 0 20px', letterSpacing: '-0.5px' }}>
            Know Your Policy.
          </p>
          <p className="ip-hero-copy" style={{ marginInline: 'auto' }}>
            Important coverage, exclusions, waiting periods, limits and conditions can be easy to miss. Share your policy with Insurance Gyani and let our team review the key details for you.
          </p>
          <div className="actions" style={{ justifyContent: 'center', marginTop: '30px' }}>
            <button onClick={scrollToForm} className="btn primary">
              Review My Policy <ArrowRight size={16}/>
            </button>
          </div>
          <div className="trust-row" style={{ justifyContent: 'center', marginTop: '24px' }}>
            <span>Coverage • Exclusions • Waiting Periods • Limits • Important Conditions</span>
          </div>
        </div>
      </section>

      {/* SECTION 1 — WHAT COULD YOU BE MISSING? */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Hidden terms</span>
              <h2>What Could You Be Missing in Your Policy?</h2>
            </div>
            <p>A policy can look comprehensive at first glance, but the important details are often hidden in its terms and conditions.</p>
          </div>
          <div className="explain-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '38px' }}>
            <article className="glass-card explain-card">
              <IpIcon Icon={Sliders}/>
              <h3>Room Rent &amp; Treatment Limits</h3>
              <p>Could certain hospital expenses have limits?</p>
            </article>
            <article className="glass-card explain-card">
              <IpIcon Icon={AlertCircle}/>
              <h3>Co-payment &amp; Deductibles</h3>
              <p>Could you have to pay a part of the claim yourself?</p>
            </article>
            <article className="glass-card explain-card">
              <IpIcon Icon={Clock}/>
              <h3>Waiting Periods</h3>
              <p>Are there conditions or treatments that aren't immediately covered?</p>
            </article>
            <article className="glass-card explain-card">
              <IpIcon Icon={ShieldCheck}/>
              <h3>Exclusions</h3>
              <p>Are there situations where your policy may not respond?</p>
            </article>
            <article className="glass-card explain-card">
              <IpIcon Icon={FileText}/>
              <h3>Sub-limits</h3>
              <p>Are there specific limits on certain treatments or expenses?</p>
            </article>
            <article className="glass-card explain-card">
              <IpIcon Icon={BookOpen}/>
              <h3>Policy Conditions</h3>
              <p>Are there clauses you should know before making a claim?</p>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 3 — YOUTUBE VIDEO EDUCATION SECTION */}
      <section className="section light-band">
        <div className="container">
          <div className="section-heading" style={{ marginBottom: '40px' }}>
            <div>
              <span className="eyebrow">WATCH &amp; UNDERSTAND</span>
              <h2>Before You Review Your Policy, Watch This.</h2>
            </div>
            <p>Your insurance policy is more than just the premium you pay. This short video explains why understanding the important terms of your policy matters.</p>
          </div>

          <div className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
            <div className="video-section-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 360px) 1fr', gap: '40px', alignItems: 'center' }}>
              
              <div style={{ position: 'relative', width: '100%', aspectRatio: '9/16', maxHeight: '520px', borderRadius: '16px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,.15)', boxShadow: '0 20px 40px rgba(0,0,0,.4)' }}>
                <iframe 
                  src="https://www.youtube.com/embed/00Ig9F5weNQ" 
                  title="Before You Review Your Policy, Watch This"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>

              <div>
                <span className="ip-badge">WHY POLICY REVIEW MATTERS</span>
                <h3 style={{ fontSize: '26px', margin: '12px 0 16px' }}>Understand What Your Policy Controls</h3>
                <p className="muted" style={{ fontSize: '15px', marginBottom: '24px', lineHeight: '1.7' }}>
                  Many policyholders only discover exclusions and limits when filing a claim. Reviewing your document ahead of time ensures you have complete clarity on your coverage.
                </p>

                <ul className="ip-hero-points" style={{ marginBottom: '30px' }}>
                  <li><CheckCircle2 size={18}/> Understand what your policy covers</li>
                  <li><CheckCircle2 size={18}/> Identify important exclusions</li>
                  <li><CheckCircle2 size={18}/> Check waiting periods</li>
                  <li><CheckCircle2 size={18}/> Notice limits and conditions</li>
                </ul>

                <div>
                  <button onClick={scrollToForm} className="btn primary">
                    Review My Policy <ArrowRight size={16}/>
                  </button>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '12px', fontStyle: 'italic' }}>
                    Understand your policy before you need to use it.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PROBLEM / EDUCATION */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Beyond the premium</span>
              <h2>Your Policy Is More Than Just the Premium.</h2>
            </div>
            <p>You may know how much premium you pay. But do you know what your policy actually covers?</p>
          </div>
          <div className="explain-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '38px' }}>
            <article className="glass-card explain-card">
              <IpIcon Icon={ShieldCheck}/>
              <h3>What is Covered?</h3>
              <p>Understand the key benefits and coverage mentioned in your policy.</p>
            </article>
            <article className="glass-card explain-card">
              <IpIcon Icon={Sliders}/>
              <h3>What Are the Limits?</h3>
              <p>Identify important limits, restrictions, deductibles or co-payment conditions.</p>
            </article>
            <article className="glass-card explain-card">
              <IpIcon Icon={Clock}/>
              <h3>What Are the Waiting Periods?</h3>
              <p>Know which conditions or benefits may have waiting periods.</p>
            </article>
            <article className="glass-card explain-card">
              <IpIcon Icon={AlertCircle}/>
              <h3>What Is Excluded?</h3>
              <p>Understand the major exclusions and situations where coverage may not apply.</p>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHY REVIEW */}
      <section className="section light-band">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Proactive protection</span>
              <h2>Why Should You Review Your Policy?</h2>
            </div>
            <p>Insurance is meant to protect you when you need it most. Understanding your policy before a claim can help you make informed decisions.</p>
          </div>
          <div className="whyig-grid" style={{ marginTop: '38px' }}>
            <article className="glass-card whyig-card">
              <span className="premium-num">01</span>
              <h3>Understand Your Coverage</h3>
              <p>Know the important benefits mentioned in your policy.</p>
            </article>
            <article className="glass-card whyig-card">
              <span className="premium-num">02</span>
              <h3>Identify Important Conditions</h3>
              <p>Find limits, waiting periods and other conditions that may matter.</p>
            </article>
            <article className="glass-card whyig-card">
              <span className="premium-num">03</span>
              <h3>Know the Exclusions</h3>
              <p>Understand what your policy specifically excludes.</p>
            </article>
            <article className="glass-card whyig-card">
              <span className="premium-num">04</span>
              <h3>Be Better Prepared</h3>
              <p>Keep important policy information clear before you need to use it.</p>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 4 — WHAT WILL YOU GET FROM THE REVIEW? */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Review output</span>
              <h2>What Will You Get From the Review?</h2>
            </div>
            <p>Key insights extracted and organized from your policy document by our team.</p>
          </div>
          <div className="compare-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '38px' }}>
            <article className="glass-card compare-card">
              <IpIcon Icon={FileText}/>
              <div>
                <h3>Coverage Snapshot</h3>
                <p>Key coverage and benefits identified from your policy.</p>
              </div>
            </article>
            <article className="glass-card compare-card">
              <IpIcon Icon={Sliders}/>
              <div>
                <h3>Important Limitations</h3>
                <p>Important limits, conditions and restrictions highlighted.</p>
              </div>
            </article>
            <article className="glass-card compare-card">
              <IpIcon Icon={Clock}/>
              <div>
                <h3>Waiting Periods</h3>
                <p>Relevant waiting periods identified from the policy document.</p>
              </div>
            </article>
            <article className="glass-card compare-card">
              <IpIcon Icon={AlertCircle}/>
              <div>
                <h3>Key Exclusions</h3>
                <p>Important exclusions brought to your attention.</p>
              </div>
            </article>
            <article className="glass-card compare-card">
              <IpIcon Icon={BookOpen}/>
              <div>
                <h3>Simple Explanation</h3>
                <p>Important policy terms explained in simpler language.</p>
              </div>
            </article>
            <article className="glass-card compare-card">
              <IpIcon Icon={Users}/>
              <div>
                <h3>Follow-up Guidance</h3>
                <p>Our team can connect with you to discuss the relevant findings.</p>
              </div>
            </article>
          </div>
          <div style={{ marginTop: '30px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', color: 'var(--muted)', fontSize: '13px', textAlign: 'center' }}>
            <p style={{ margin: 0 }}><em>Disclaimer: The review is based on the policy document provided to us. Coverage is subject to the actual policy terms, conditions, exclusions and applicable provisions.</em></p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — THE BEST TIME TO UNDERSTAND YOUR POLICY */}
      <section className="section light-band">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Timing matters</span>
              <h2>The Best Time to Understand Your Policy Is Before You Need It.</h2>
            </div>
            <p>When a medical emergency happens, the last thing you want is to start reading your policy for the first time. A simple review today can help you understand the important terms before they become important.</p>
          </div>
          <div className="journey-grid" style={{ marginTop: '38px' }}>
            <article className="glass-card journey-step">
              <span className="premium-num">TODAY</span>
              <IpIcon Icon={Upload}/>
              <h3>Upload Policy</h3>
              <p>Submit your document securely for review.</p>
            </article>
            <article className="glass-card journey-step">
              <span className="premium-num">REVIEW</span>
              <IpIcon Icon={FileText}/>
              <h3>Policy Review</h3>
              <p>Our team checks important terms and conditions.</p>
            </article>
            <article className="glass-card journey-step">
              <span className="premium-num">READY</span>
              <IpIcon Icon={CheckCircle2}/>
              <h3>Understand</h3>
              <p>Know the relevant details before you need your policy.</p>
            </article>
          </div>
          <div className="compare-cta" style={{ marginTop: '30px' }}>
            <button className="btn primary" onClick={scrollToForm}>
              Review My Policy <ArrowRight size={16}/>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6 — MAIN FORM */}
      <section className="section" ref={formRef}>
        <div className="container narrow">
          {!isSubmitted ? (
            <div className="glass-card" style={{ padding: '40px' }}>
              <div className="text-center" style={{ marginBottom: '32px' }}>
                <span className="eyebrow">POLICY SUBMISSION</span>
                <h2 style={{ fontSize: '32px', margin: '10px 0 8px' }}>Let Us Review Your Policy</h2>
                <p className="muted" style={{ fontSize: '15px' }}>Share your policy with us and we'll review the important details that may matter to you.</p>
              </div>

              <form onSubmit={handleSubmit} className="form-grid" style={{ rowGap: '20px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(3,13,25,.58)', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    maxLength={10}
                    placeholder="Enter your 10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(3,13,25,.58)', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(3,13,25,.58)', color: '#fff' }}
                  />
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Insurance Policy Type *</label>
                  <select 
                    value={formData.policyType}
                    onChange={(e) => {
                      setFormData({...formData, policyType: e.target.value, companyName: '', investmentProvider: ''});
                      setCompanySearch('');
                    }}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(3,13,25,.88)', color: '#fff', cursor: 'pointer' }}
                  >
                    <option value="Health Insurance" style={{ background: '#0b2b4c', color: '#fff' }}>Health Insurance</option>
                    <option value="Life Insurance" style={{ background: '#0b2b4c', color: '#fff' }}>Life Insurance</option>
                    <option value="Motor Insurance" style={{ background: '#0b2b4c', color: '#fff' }}>Motor Insurance</option>
                    <option value="Investment" style={{ background: '#0b2b4c', color: '#fff' }}>Investment</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  {formData.policyType !== 'Investment' ? (
                    <div className="relative" style={{ position: 'relative' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Insurance Company Name *</label>
                      <div 
                        onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(3,13,25,.58)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                      >
                        <span style={{ flex: 1, color: formData.companyName ? '#fff' : 'rgba(255,255,255,.4)' }}>
                          {formData.companyName || "Select or search insurance company..."}
                        </span>
                        <ChevronDown size={18} style={{ color: 'var(--muted)' }} />
                      </div>

                      {isCompanyDropdownOpen && (
                        <div style={{ position: 'absolute', zIndex: 30, marginTop: '4px', width: '100%', background: '#061525', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,.5)', border: '1px solid rgba(255,255,255,.2)', maxHeight: '240px', overflowY: 'auto' }}>
                          <div style={{ padding: '10px', position: 'sticky', top: 0, background: '#061525', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
                            <input 
                              type="text"
                              placeholder="Search company..."
                              value={companySearch}
                              onChange={(e) => setCompanySearch(e.target.value)}
                              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: '13px' }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div style={{ padding: '4px 0' }}>
                            {filteredCompanies.length > 0 ? (
                              filteredCompanies.map((comp, idx) => (
                                <div 
                                  key={idx}
                                  onClick={() => {
                                    setFormData({...formData, companyName: comp});
                                    setIsCompanyDropdownOpen(false);
                                    setCompanySearch('');
                                  }}
                                  style={{ padding: '10px 16px', fontSize: '13px', color: '#e2e8f0', cursor: 'pointer' }}
                                  onMouseEnter={(e) => e.target.style.background = 'rgba(34,211,238,.15)'}
                                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                  {comp}
                                </div>
                              ))
                            ) : (
                              <div style={{ padding: '12px', color: 'rgba(255,255,255,.4)', fontSize: '13px', textAlign: 'center' }}>No company found</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Investment Company / Product Provider *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Enter provider or company name"
                        value={formData.investmentProvider}
                        onChange={(e) => setFormData({...formData, investmentProvider: e.target.value})}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(3,13,25,.58)', color: '#fff' }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Plan / Policy Name (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Enter your plan or policy name"
                    value={formData.planName}
                    onChange={(e) => setFormData({...formData, planName: e.target.value})}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(3,13,25,.58)', color: '#fff' }}
                  />
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Upload Policy *</label>
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    style={{ border: '2px dashed rgba(255,255,255,.25)', borderRadius: '16px', padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,.03)', position: 'relative', cursor: 'pointer' }}
                  >
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                    />
                    
                    {!selectedFile ? (
                      <div className="flex flex-col items-center">
                        <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '50%', background: 'rgba(34,211,238,.12)', display: 'grid', placeItems: 'center', color: 'var(--cyan)' }}>
                          <Upload size={22} />
                        </div>
                        <p style={{ fontWeight: '700', fontSize: '15px', color: '#fff', marginBottom: '4px' }}>Upload Your Policy</p>
                        <p className="muted" style={{ fontSize: '13px', marginBottom: '8px' }}>Drag &amp; drop your policy here or <span style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Browse File</span></p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)' }}>PDF, JPG, JPEG, PNG • Maximum 10 MB</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,.08)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,.2)', position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16,185,129,.2)', color: '#34d399' }}>
                            <FileText size={20} />
                          </div>
                          <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                            <p style={{ fontSize: '13px', fontWeight: '700', color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedFile.name}</p>
                            <p style={{ fontSize: '11px', color: 'var(--muted)', margin: 0 }}>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          style={{ background: 'transparent', border: 0, color: 'rgba(255,255,255,.6)', cursor: 'pointer', padding: '6px' }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                  {fileError && <p style={{ color: '#ff8b8b', fontSize: '12px', marginTop: '6px' }}>{fileError}</p>}
                </div>

                <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'start', gap: '12px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', color: 'var(--muted)', fontSize: '12.5px' }}>
                  <LockKeyhole size={18} style={{ color: 'var(--cyan)', flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0 }}>🔐 Your policy document is handled only for the purpose of review. Please avoid uploading documents containing unnecessary personal information.</p>
                </div>

                <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'start', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    id="consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                    style={{ marginTop: '3px', accentColor: 'var(--cyan)', cursor: 'pointer' }}
                  />
                  <label htmlFor="consent" style={{ fontSize: '12.5px', color: 'var(--muted)', cursor: 'pointer', lineHeight: '1.5' }}>
                    I agree to Insurance Gyani reviewing my policy and contacting me regarding the policy review. *
                  </label>
                </div>

                <div style={{ gridColumn: '1/-1', marginTop: '10px' }}>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="btn primary full wide"
                    style={{ padding: '14px', fontSize: '15px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{ width: '18px', height: '18px', border: '2px solid #061525', borderTopColor: 'transparent', borderRadius: '50%', animation: 'ig-spin 1s linear infinite' }}></div>
                        Submitting...
                      </>
                    ) : (
                      "Review My Policy"
                    )}
                  </button>
                </div>

              </form>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '48px 36px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,.2)', color: '#34d399', display: 'grid', placeItems: 'center', margin: '0 auto 20px', fontSize: '28px', border: '1px solid rgba(52,211,153,.4)' }}>
                ✓
              </div>
              
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px', lineHeight: '1.2' }}>Your Policy Has Been Received</h2>
              <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '24px', lineHeight: '1.5' }}>
                Thank you, <span style={{ color: '#fff', fontWeight: '700' }}>{formData.name}</span>.<br />
                Your policy document has been received successfully.
              </p>

              <div style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(244,201,93,.08)', border: '1px solid rgba(244,201,93,.25)', marginBottom: '24px', maxWidth: '480px', marginInline: 'auto', textAlign: 'left' }}>
                <p style={{ fontWeight: '700', color: '#fff', fontSize: '14px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔍</span> We're reviewing your policy.
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                  Our team will review the important details and share the relevant findings with you through WhatsApp / Email.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px', maxWidth: '520px', marginInline: 'auto' }}>
                <div style={{ padding: '10px 6px', background: 'rgba(255,255,255,.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,.1)', fontSize: '11px', fontWeight: '700', color: '#fff' }}>Coverage</div>
                <div style={{ padding: '10px 6px', background: 'rgba(255,255,255,.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,.1)', fontSize: '11px', fontWeight: '700', color: '#fff' }}>Exclusions</div>
                <div style={{ padding: '10px 6px', background: 'rgba(255,255,255,.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,.1)', fontSize: '11px', fontWeight: '700', color: '#fff' }}>Waiting Periods</div>
                <div style={{ padding: '10px 6px', background: 'rgba(255,255,255,.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,.1)', fontSize: '11px', fontWeight: '700', color: '#fff' }}>Limits & Conditions</div>
              </div>

              <p style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '24px' }}>Please allow us some time to complete the review.</p>

              <a href="/" className="btn primary" style={{ marginInline: 'auto' }}>
                Back to Insurance Gyani
              </a>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 7 — FAQ SECTION */}
      <section className="section faq-page">
        <div className="container narrow">
          <div className="text-center" style={{ marginBottom: '10px' }}>
            <span className="eyebrow">Got questions?</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            <details>
              <summary>Is the policy review free?<ChevronDown size={18}/></summary>
              <p>The initial policy review is currently free of charge.</p>
            </details>
            <details>
              <summary>Which policies can I submit?<ChevronDown size={18}/></summary>
              <p>Health, Life, Motor and Investment policy documents can be submitted.</p>
            </details>
            <details>
              <summary>Do I need to upload the complete policy?<ChevronDown size={18}/></summary>
              <p>Upload the policy document or policy schedule available with you. Our team will review the document provided.</p>
            </details>
            <details>
              <summary>How will I receive the review?<ChevronDown size={18}/></summary>
              <p>Our team will contact you through WhatsApp or Email with the relevant findings.</p>
            </details>
            <details>
              <summary>How long will the review take?<ChevronDown size={18}/></summary>
              <p>Review time may vary depending on the type and length of the policy document.</p>
            </details>
            <details>
              <summary>Will you tell me whether my claim will be approved?<ChevronDown size={18}/></summary>
              <p>No. A policy review cannot guarantee claim approval. Claims are subject to the actual policy terms, conditions, exclusions and applicable circumstances.</p>
            </details>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL CTA */}
      <section className="cta">
        <div className="container cta-panel">
          <div>
            <span className="eyebrow">Take action</span>
            <h2>Don't Wait Until You Need Your Policy.</h2>
            <p>Understand the important terms today, so you're better prepared when you need to use your insurance.</p>
          </div>
          <button className="btn white" onClick={scrollToForm}>
            Review My Policy <ArrowRight size={16}/>
          </button>
        </div>
      </section>
    </main>
  );
}