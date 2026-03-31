"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Shield, FileText, UserCheck, AlertTriangle, XCircle, CheckCircle, Award, Lock, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

const questions = [
  { id: 1, category: 'Governance', icon: FileText, text: 'Do you have a formally appointed Information Officer registered with the Information Regulator?' },
  { id: 2, category: 'Governance', icon: FileText, text: 'Have you conducted a personal data mapping exercise to understand what data you hold and where?' },
  { id: 3, category: 'Governance', icon: FileText, text: 'Are your privacy policies and PAIA manuals up to date and easily accessible?' },
  { id: 4, category: 'Security', icon: Shield, text: 'Is all sensitive personal information encrypted both at rest and in transit?' },
  { id: 5, category: 'Security', icon: Shield, text: 'Do you have a formal incident response plan for data breaches?' },
  { id: 6, category: 'Security', icon: Shield, text: 'Are access controls implemented to ensure employees only access data necessary for their roles?' },
  { id: 7, category: 'Security', icon: Shield, text: 'Do you conduct regular security awareness training for all staff?' },
  { id: 8, category: 'Data Rights', icon: UserCheck, text: 'Is there a clear process for data subjects to request access to, or deletion of, their personal information?' },
  { id: 9, category: 'Data Rights', icon: UserCheck, text: 'Do you obtain explicit, documented consent before processing special personal information?' },
  { id: 10, category: 'Data Rights', icon: UserCheck, text: 'Are data processing agreements in place with all third-party operators who handle data on your behalf?' },
];

export default function PopiaAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [leadForm, setLeadForm] = useState({ name: '', company: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentStep]: value }));
    setTimeout(() => {
      if (currentStep < 9) {
        setCurrentStep(prev => prev + 1);
      } else {
        setCurrentStep(10); // Go to gate
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 0 && currentStep < 10) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch('/api/popia-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: leadForm, answers, score: totalScore })
      });
      setCurrentStep(11); // Show results
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  let status = 'Green';
  let message = 'Optimization & audit readiness recommended.';
  let colorClass = 'text-green-500';
  let bgClass = 'bg-green-500';
  let borderClass = 'border-green-500';

  if (totalScore <= 7) {
    status = 'Red';
    message = 'Immediate intervention advised.';
    colorClass = 'text-red-500';
    bgClass = 'bg-red-500';
    borderClass = 'border-red-500';
  } else if (totalScore <= 15) {
    status = 'Amber';
    message = 'Remediation required.';
    colorClass = 'text-amber-500';
    bgClass = 'bg-amber-500';
    borderClass = 'border-amber-500';
  }

  // Calculate dynamic risk for the meter during questions
  const maxPossibleSoFar = currentStep * 2;
  const currentScoreSoFar = Object.keys(answers)
    .filter(k => parseInt(k) < currentStep)
    .reduce((acc, k) => acc + answers[parseInt(k)], 0);
  
  const riskPercentage = currentStep === 0 ? 0 : Math.min(100, Math.max(0, ((maxPossibleSoFar - currentScoreSoFar) / maxPossibleSoFar) * 100));
  let riskColor = "bg-green-500";
  if (riskPercentage > 30) riskColor = "bg-amber-500";
  if (riskPercentage > 60) riskColor = "bg-red-500";

  return (
    <div className="pt-24 pb-24 bg-montana-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-6">
        
        <div className="mb-12 text-center">
          <div className="inline-flex items-center border border-white/10 bg-montana-surface/80 backdrop-blur-sm px-4 py-1.5 text-xs font-bold tracking-widest text-montana-muted uppercase mb-6">
            <span className="flex h-2 w-2 bg-montana-pink mr-3 shadow-[0_0_8px_#F24567]"></span>
            POPIA Maturity Snapshot
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Is your data legally compliant?
          </h1>
          <p className="text-montana-muted max-w-2xl mx-auto">
            Take our 10-question assessment to generate your POPIA maturity score and identify critical compliance gaps.
          </p>
        </div>

        {/* Phase 1: Assessment */}
        {currentStep < 10 && (
          <GlassCard className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Progress & Risk Meter */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-white">Question {currentStep + 1} of 10</span>
                <div className="text-right">
                  <span className="text-xs text-montana-muted block mb-1">Current Risk Trajectory</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-montana-surface rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${riskColor}`} style={{ width: `${riskPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-1 w-full bg-montana-surface rounded-full overflow-hidden">
                <div className="h-full bg-montana-pink transition-all duration-300" style={{ width: `${((currentStep) / 10) * 100}%` }}></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-10 min-h-[120px]">
              <div className="flex items-center gap-3 mb-4">
                {(() => {
                  const Icon = questions[currentStep].icon;
                  return <Icon className="h-6 w-6 text-montana-pink" />;
                })()}
                <span className="text-sm font-bold tracking-widest text-montana-pink uppercase">{questions[currentStep].category}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {questions[currentStep].text}
              </h2>
            </div>

            {/* Answers */}
            <div className="space-y-4">
              {[
                { label: 'Yes', value: 2, desc: 'Fully implemented and documented.' },
                { label: 'Partial', value: 1, desc: 'In progress or informally practiced.' },
                { label: 'No', value: 0, desc: 'Not implemented or unknown.' }
              ].map((option) => (
                <div 
                  key={option.label}
                  onClick={() => handleAnswer(option.value)}
                  className={`cursor-pointer rounded-xl border p-5 transition-all flex items-center justify-between group
                    ${answers[currentStep] === option.value ? 'border-montana-pink bg-montana-magenta/10' : 'border-white/10 bg-montana-surface/50 hover:border-white/30 hover:bg-white/5'}`}
                >
                  <div>
                    <div className="font-bold text-white text-lg mb-1">{option.label}</div>
                    <div className="text-sm text-montana-muted">{option.desc}</div>
                  </div>
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors
                    ${answers[currentStep] === option.value ? 'border-montana-pink' : 'border-white/20 group-hover:border-white/40'}`}>
                    {answers[currentStep] === option.value && <div className="h-3 w-3 rounded-full bg-montana-pink" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-start">
              <button 
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`text-sm font-medium transition-colors ${currentStep === 0 ? 'text-white/20 cursor-not-allowed' : 'text-montana-muted hover:text-white'}`}
              >
                ← Previous Question
              </button>
            </div>
          </GlassCard>
        )}

        {/* Phase 2: The Gate */}
        {currentStep === 10 && (
          <div className="relative overflow-hidden rounded-2xl animate-in fade-in zoom-in duration-500">
            {/* Blurred Background */}
            <div className="filter blur-xl opacity-30 pointer-events-none select-none">
              <GlassCard className="p-12">
                <div className="flex justify-center mb-8">
                  <div className="h-32 w-32 rounded-full bg-montana-pink"></div>
                </div>
                <div className="h-12 bg-white/20 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-6 bg-white/10 rounded w-3/4 mx-auto mb-12"></div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="h-48 bg-white/10 rounded"></div>
                  <div className="h-48 bg-white/10 rounded"></div>
                  <div className="h-48 bg-white/10 rounded"></div>
                </div>
              </GlassCard>
            </div>
            
            {/* Gate Form */}
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-montana-bg/40 backdrop-blur-md">
              <GlassCard className="w-full max-w-md p-8 border-montana-pink/30 shadow-2xl shadow-montana-pink/10">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-montana-magenta/20 border border-montana-pink/30 mb-6 mx-auto flex">
                  <Lock className="h-8 w-8 text-montana-pink" />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">Unlock Your Full Report</h3>
                <p className="text-montana-muted text-center text-sm mb-8">
                  Enter your details to reveal your POPIA maturity score and receive your 1-page PDF snapshot via email.
                </p>
                
                <form onSubmit={submitLead} className="space-y-4">
                  <div>
                    <input 
                      required
                      type="text" 
                      placeholder="Full Name" 
                      value={leadForm.name}
                      onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                      className="w-full rounded-sm border border-white/10 bg-montana-surface/80 px-4 py-3 text-white focus:border-montana-pink focus:outline-none" 
                    />
                  </div>
                  <div>
                    <input 
                      required
                      type="text" 
                      placeholder="Company Name" 
                      value={leadForm.company}
                      onChange={e => setLeadForm({...leadForm, company: e.target.value})}
                      className="w-full rounded-sm border border-white/10 bg-montana-surface/80 px-4 py-3 text-white focus:border-montana-pink focus:outline-none" 
                    />
                  </div>
                  <div>
                    <input 
                      required
                      type="email" 
                      placeholder="Work Email" 
                      value={leadForm.email}
                      onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                      className="w-full rounded-sm border border-white/10 bg-montana-surface/80 px-4 py-3 text-white focus:border-montana-pink focus:outline-none" 
                    />
                  </div>
                  <div className="pt-2">
                    <AnimatedButton variant="primary" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Generating Report..." : "Reveal My Score"}
                    </AnimatedButton>
                  </div>
                  <p className="text-xs text-center text-white/40 mt-4">
                    By submitting, you agree to our privacy policy. We will send your results to the email provided.
                  </p>
                </form>
              </GlassCard>
            </div>
          </div>
        )}

        {/* Phase 3 & 4: Dashboard & Upsell */}
        {currentStep === 11 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <GlassCard className={`p-8 md:p-12 mb-12 border-t-4 ${borderClass}`}>
              <div className="text-center mb-12">
                <div className="relative inline-block mb-8">
                  <div className={`inline-flex h-32 w-32 items-center justify-center rounded-full bg-montana-surface border-4 ${borderClass} shadow-[0_0_30px_rgba(0,0,0,0.3)]`}>
                    {status === 'Red' && <XCircle className={`h-16 w-16 ${colorClass}`} />}
                    {status === 'Amber' && <AlertTriangle className={`h-16 w-16 ${colorClass}`} />}
                    {status === 'Green' && <CheckCircle className={`h-16 w-16 ${colorClass}`} />}
                  </div>
                  {/* POPIA Compliance Badge */}
                  {status === 'Green' && (
                    <div className="absolute -bottom-4 -right-4 bg-montana-bg rounded-full p-2 border border-green-500/30 shadow-xl">
                      <div className="bg-green-500/20 rounded-full p-2">
                        <Award className="h-8 w-8 text-green-400" />
                      </div>
                    </div>
                  )}
                </div>
                
                <h2 className="font-display text-5xl font-bold text-white mb-4">
                  Score: {totalScore} <span className="text-2xl text-white/40">/ 20</span>
                </h2>
                
                <div className={`inline-flex items-center px-6 py-2 rounded-full ${bgClass} bg-opacity-10 border ${borderClass} mb-6`}>
                  <Activity className={`h-4 w-4 mr-2 ${colorClass}`} />
                  <span className={`font-bold uppercase tracking-widest text-sm ${colorClass}`}>
                    {status} RISK LEVEL
                  </span>
                </div>
                
                <p className="text-xl text-montana-muted max-w-2xl mx-auto leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-8">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-white mb-1">
                    {Object.values(answers).filter(v => v === 2).length}
                  </div>
                  <div className="text-xs text-montana-muted uppercase tracking-wider">Fully Compliant</div>
                </div>
                <div className="text-center p-4 border-x border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">
                    {Object.values(answers).filter(v => v === 1).length}
                  </div>
                  <div className="text-xs text-montana-muted uppercase tracking-wider">Partial Controls</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-montana-pink mb-1">
                    {Object.values(answers).filter(v => v === 0).length}
                  </div>
                  <div className="text-xs text-montana-muted uppercase tracking-wider">Critical Gaps</div>
                </div>
              </div>
            </GlassCard>

            {/* Phase 4: The Upsell */}
            <div>
              <div className="text-center mb-10">
                <h3 className="font-display text-3xl font-bold text-white mb-4">Next Steps: 88-Control Engagement</h3>
                <p className="text-montana-muted max-w-2xl mx-auto">
                  This snapshot covers 10 high-level areas. True POPIA compliance requires a deep dive into all 88 regulatory controls. Choose your remediation path below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Entry */}
                <GlassCard className="p-8 flex flex-col hover:border-white/30 transition-colors">
                  <h4 className="font-bold text-white text-xl mb-2">Rapid Assessment</h4>
                  <p className="text-montana-muted text-sm mb-6 flex-1">High-level gap analysis and immediate risk identification across your data landscape.</p>
                  <div className="text-3xl font-bold text-white mb-8">Entry</div>
                  <ul className="space-y-3 mb-8 text-sm text-white/80 flex-1">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-montana-pink shrink-0 mt-0.5" /> Executive Summary</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-montana-pink shrink-0 mt-0.5" /> High-Risk Identification</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-montana-pink shrink-0 mt-0.5" /> 1-Day Workshop</li>
                  </ul>
                  <Link href="/#contact">
                    <AnimatedButton variant="outline" className="w-full">Book Discovery</AnimatedButton>
                  </Link>
                </GlassCard>

                {/* Core (Recommended) */}
                <GlassCard glow className="p-8 flex flex-col border-montana-pink/50 relative transform md:-translate-y-4 shadow-2xl shadow-montana-pink/10">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-montana-pink text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wider">
                    RECOMMENDED
                  </div>
                  <h4 className="font-bold text-white text-xl mb-2">Compliance Roadmap</h4>
                  <p className="text-montana-muted text-sm mb-6 flex-1">Full 88-control assessment, detailed data mapping, and a step-by-step remediation plan.</p>
                  <div className="text-3xl font-bold text-white mb-8">Core</div>
                  <ul className="space-y-3 mb-8 text-sm text-white/80 flex-1">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-montana-pink shrink-0 mt-0.5" /> Full 88-Control Audit</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-montana-pink shrink-0 mt-0.5" /> Data Flow Mapping</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-montana-pink shrink-0 mt-0.5" /> Prioritized Remediation Plan</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-montana-pink shrink-0 mt-0.5" /> Policy Templates</li>
                  </ul>
                  <Link href="/#contact">
                    <AnimatedButton variant="primary" className="w-full">Get Proposal</AnimatedButton>
                  </Link>
                </GlassCard>

                {/* Premium */}
                <GlassCard className="p-8 flex flex-col hover:border-white/30 transition-colors">
                  <h4 className="font-bold text-white text-xl mb-2">Managed Compliance</h4>
                  <p className="text-montana-muted text-sm mb-6 flex-1">Ongoing Information Officer support, staff training, and continuous compliance auditing.</p>
                  <div className="text-3xl font-bold text-white mb-8">Premium</div>
                  <ul className="space-y-3 mb-8 text-sm text-white/80 flex-1">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-montana-pink shrink-0 mt-0.5" /> Everything in Core</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-montana-pink shrink-0 mt-0.5" /> Virtual Information Officer</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-montana-pink shrink-0 mt-0.5" /> Quarterly Audits</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-montana-pink shrink-0 mt-0.5" /> Incident Response Retainer</li>
                  </ul>
                  <Link href="/#contact">
                    <AnimatedButton variant="outline" className="w-full">Discuss Retainer</AnimatedButton>
                  </Link>
                </GlassCard>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
