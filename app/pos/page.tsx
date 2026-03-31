"use client";

import { useState, Suspense, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { CheckCircle2, Server, Shield, FileText, Smartphone, Database, ShieldAlert, Archive, Activity, Lock, Compass, Settings2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

const services = [
  {
    id: "ibm-backup",
    name: "IBM Enterprise Backup",
    category: "Backup & Data Protection",
    icon: Server,
    description: "Bespoke, consultative architecture for complex environments.",
    plans: [
      { id: "consultation", name: "Architecture Consultation", price: "Custom Quote" },
      { id: "implementation", name: "Full Implementation", price: "RFP Neg" },
    ]
  },
  {
    id: "druva-saas",
    name: "Druva SaaS & Endpoint",
    category: "Backup & Data Protection",
    icon: Database,
    description: "Productised cloud backup for M365, Google, and endpoints.",
    plans: [
      { id: "foundation", name: "Foundation", price: "From R99 pm/user" },
      { id: "enterprise", name: "Enterprise", price: "From R169 pm/user" },
    ]
  },
  {
    id: "ransomware",
    name: "Ransomware Protection",
    category: "Ransomware & Archive",
    icon: ShieldAlert,
    description: "Immutable storage and AI anomaly detection.",
    plans: [
      { id: "standard", name: "Standard Detection", price: "Custom Quote" },
      { id: "advanced", name: "Advanced AI Isolation", price: "Custom Quote" },
    ]
  },
  {
    id: "archive",
    name: "Archive & Lifecycle",
    category: "Ransomware & Archive",
    icon: Archive,
    description: "Intelligent cold data management.",
    plans: [
      { id: "standard", name: "Standard Archiving", price: "Custom Quote" },
      { id: "compliance", name: "Compliance Archiving", price: "Custom Quote" },
    ]
  },
  {
    id: "maas360",
    name: "MaaS360 (MDM/UEM)",
    category: "Security & Governance",
    icon: Smartphone,
    description: "Unified endpoint management and threat defense.",
    plans: [
      { id: "essential", name: "Essential Plan", price: "R150 p/device" },
      { id: "deluxe", name: "Deluxe Plan", price: "Per estimate" },
    ]
  },
  {
    id: "guardium",
    name: "IBM Guardium",
    category: "Security & Governance",
    icon: Activity,
    description: "Data security, monitoring, and governance.",
    plans: [
      { id: "discovery", name: "Data Discovery", price: "Custom Quote" },
      { id: "protection", name: "Full Protection", price: "RFP Neg" },
    ]
  },
  {
    id: "popia",
    name: "POPIA Consulting",
    category: "Security & Governance",
    icon: FileText,
    description: "Privacy compliance and training.",
    plans: [
      { id: "training", name: "Training & Manuals", price: "From R300" },
      { id: "audit", name: "Full Privacy Audit", price: "Custom Quote" },
    ]
  },
  {
    id: "quantum",
    name: "Quantum Security (PQC)",
    category: "Future-Proofing",
    icon: Lock,
    description: "Post-Quantum Cryptography readiness.",
    plans: [
      { id: "assessment", name: "Readiness Assessment", price: "Custom Quote" },
      { id: "architecture", name: "PQC Architecture", price: "RFP Neg" },
    ]
  }
];

function POSForm() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service");
  const initialMode = searchParams.get("mode");
  
  const [mode, setMode] = useState<"guided" | "manual" | null>(
    initialMode === "guided" ? "guided" : (initialService ? "manual" : null)
  );
  const [guidedStep, setGuidedStep] = useState(1);
  const [guidedAnswers, setGuidedAnswers] = useState({
    size: "",
    data: [] as string[],
    needs: [] as string[]
  });

  const [selectedServices, setSelectedServices] = useState<string[]>(initialService && services.some(s => s.id === initialService) ? [initialService] : []);
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServices(prev => {
      if (prev.includes(id)) {
        const newServices = prev.filter(s => s !== id);
        setSelectedPlans(p => {
          const newPlans = { ...p };
          delete newPlans[id];
          return newPlans;
        });
        return newServices;
      } else {
        return [...prev, id];
      }
    });
  };

  const selectPlan = (serviceId: string, planId: string) => {
    setSelectedPlans(prev => ({ ...prev, [serviceId]: planId }));
  };

  const handleNext = () => {
    if (step === 1 && selectedServices.length > 0) setStep(2);
    else if (step === 2 && Object.keys(selectedPlans).length === selectedServices.length) setStep(3);
    else if (step === 3) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(4);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else if (step === 1) {
      setMode(null);
      setGuidedStep(1);
      setGuidedAnswers({ size: "", data: [], needs: [] });
    }
  };

  const processGuidedAnswers = () => {
    const recommended: string[] = [];
    
    // Data type logic
    if (guidedAnswers.data.includes("saas") || guidedAnswers.data.includes("endpoints")) {
      recommended.push("druva-saas");
    }
    if (guidedAnswers.data.includes("onprem") || guidedAnswers.size === "1000+") {
      recommended.push("ibm-backup");
    }

    // Needs logic
    if (guidedAnswers.needs.includes("ransomware")) recommended.push("ransomware");
    if (guidedAnswers.needs.includes("popia")) recommended.push("popia");
    if (guidedAnswers.needs.includes("mdm")) recommended.push("maas360");
    if (guidedAnswers.needs.includes("archive")) recommended.push("archive");

    // Deduplicate
    const uniqueRecommended = Array.from(new Set(recommended));
    
    // If nothing matched, provide a default
    if (uniqueRecommended.length === 0) {
      uniqueRecommended.push("druva-saas");
    }

    setSelectedServices(uniqueRecommended);
    setStep(2); // Skip manual selection
  };

  const handleGuidedNext = () => {
    if (guidedStep < 3) {
      setGuidedStep(guidedStep + 1);
    } else {
      processGuidedAnswers();
    }
  };

  const toggleGuidedArray = (field: "data" | "needs", value: string) => {
    setGuidedAnswers(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const categories = Array.from(new Set(services.map(s => s.category)));

  if (mode === null) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
        <GlassCard 
          className="p-10 text-center cursor-pointer hover:border-montana-pink/50 transition-all group"
          onClick={() => setMode("guided")}
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-montana-magenta/10 border border-montana-pink/20 mb-6 group-hover:bg-montana-pink/20 transition-colors">
            <Compass className="h-8 w-8 text-montana-pink" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-4">Guide Me</h2>
          <p className="text-montana-muted mb-6">Answer a few quick questions about your business, and we&apos;ll recommend the right resilience architecture.</p>
          <span className="text-montana-pink font-medium group-hover:underline">Start Assessment →</span>
        </GlassCard>

        <GlassCard 
          className="p-10 text-center cursor-pointer hover:border-montana-pink/50 transition-all group"
          onClick={() => setMode("manual")}
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-montana-surface border border-white/10 mb-6 group-hover:bg-white/5 transition-colors">
            <Settings2 className="h-8 w-8 text-white/70" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-4">I Know What I Need</h2>
          <p className="text-montana-muted mb-6">Browse our full catalog of services and manually select the solutions you want to configure.</p>
          <span className="text-white/70 font-medium group-hover:underline">Select Services →</span>
        </GlassCard>
      </div>
    );
  }

  if (mode === "guided" && step === 1) {
    return (
      <GlassCard className="p-8 md:p-12 max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="font-display text-xl font-bold text-white">Solution Assessment</h2>
          <span className="text-sm text-montana-muted">Step {guidedStep} of 3</span>
        </div>

        {guidedStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold text-white mb-6">What is your estimated business size?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["1 - 50 employees", "51 - 250 employees", "251 - 1000 employees", "1000+ employees"].map(size => (
                <div 
                  key={size}
                  onClick={() => setGuidedAnswers(prev => ({ ...prev, size }))}
                  className={`cursor-pointer rounded-lg border p-5 transition-all ${guidedAnswers.size === size ? 'border-montana-pink bg-montana-magenta/10' : 'border-white/10 bg-montana-surface/50 hover:border-white/30'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{size}</span>
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${guidedAnswers.size === size ? 'border-montana-pink bg-montana-pink' : 'border-white/30'}`}>
                      {guidedAnswers.size === size && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {guidedStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold text-white mb-2">Where does your critical data live?</h3>
            <p className="text-montana-muted mb-6">Select all that apply.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: "saas", label: "SaaS (M365, Google Workspace)" },
                { id: "onprem", label: "On-Premises Servers / VMs" },
                { id: "endpoints", label: "Endpoints (Laptops, Desktops)" },
                { id: "cloud", label: "Cloud Infrastructure (AWS, Azure)" }
              ].map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleGuidedArray("data", item.id)}
                  className={`cursor-pointer rounded-lg border p-5 transition-all ${guidedAnswers.data.includes(item.id) ? 'border-montana-pink bg-montana-magenta/10' : 'border-white/10 bg-montana-surface/50 hover:border-white/30'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{item.label}</span>
                    <div className={`h-5 w-5 rounded-sm border flex items-center justify-center ${guidedAnswers.data.includes(item.id) ? 'border-montana-pink bg-montana-pink' : 'border-white/30'}`}>
                      {guidedAnswers.data.includes(item.id) && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {guidedStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold text-white mb-2">What are your primary resilience goals?</h3>
            <p className="text-montana-muted mb-6">Select all that apply.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: "ransomware", label: "Ransomware Isolation & Recovery" },
                { id: "popia", label: "POPIA / Privacy Compliance" },
                { id: "mdm", label: "Device Security & Management" },
                { id: "archive", label: "Long-term Data Archiving" }
              ].map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleGuidedArray("needs", item.id)}
                  className={`cursor-pointer rounded-lg border p-5 transition-all ${guidedAnswers.needs.includes(item.id) ? 'border-montana-pink bg-montana-magenta/10' : 'border-white/10 bg-montana-surface/50 hover:border-white/30'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{item.label}</span>
                    <div className={`h-5 w-5 rounded-sm border flex items-center justify-center ${guidedAnswers.needs.includes(item.id) ? 'border-montana-pink bg-montana-pink' : 'border-white/30'}`}>
                      {guidedAnswers.needs.includes(item.id) && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
          <AnimatedButton variant="outline" onClick={() => guidedStep > 1 ? setGuidedStep(guidedStep - 1) : setMode(null)}>
            Back
          </AnimatedButton>
          <AnimatedButton 
            onClick={handleGuidedNext} 
            disabled={(guidedStep === 1 && !guidedAnswers.size) || (guidedStep === 2 && guidedAnswers.data.length === 0)}
          >
            {guidedStep === 3 ? "Generate Recommendations" : "Next Question"}
          </AnimatedButton>
        </div>
      </GlassCard>
    );
  }

  return (
    <>
      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-12 max-w-lg mx-auto">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 1 ? 'bg-montana-pink text-white' : 'bg-montana-surface text-montana-muted'}`}>1</div>
        <div className={`h-1 w-12 mx-2 ${step >= 2 ? 'bg-montana-pink' : 'bg-montana-surface'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 2 ? 'bg-montana-pink text-white' : 'bg-montana-surface text-montana-muted'}`}>2</div>
        <div className={`h-1 w-12 mx-2 ${step >= 3 ? 'bg-montana-pink' : 'bg-montana-surface'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 3 ? 'bg-montana-pink text-white' : 'bg-montana-surface text-montana-muted'}`}>3</div>
        <div className={`h-1 w-12 mx-2 ${step >= 4 ? 'bg-montana-pink' : 'bg-montana-surface'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 4 ? 'bg-montana-pink text-white' : 'bg-montana-surface text-montana-muted'}`}>4</div>
      </div>

      <GlassCard className="p-8 md:p-12">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-display text-2xl font-bold text-white mb-2">1. Select Required Services</h2>
            <p className="text-montana-muted mb-8">Select one or more services to build your custom resilience package.</p>
            
            <div className="space-y-10 mb-8">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-sm font-bold tracking-widest text-montana-pink uppercase mb-4 border-b border-white/10 pb-2">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.filter(s => s.category === category).map((service) => {
                      const Icon = service.icon;
                      const isSelected = selectedServices.includes(service.id);
                      return (
                        <div 
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`cursor-pointer rounded-lg border p-6 transition-all ${isSelected ? 'border-montana-pink bg-montana-magenta/10' : 'border-white/10 bg-montana-surface/50 hover:border-white/30'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Icon className={`h-6 w-6 ${isSelected ? 'text-montana-pink' : 'text-montana-muted'}`} />
                              <h4 className="font-display font-bold text-white">{service.name}</h4>
                            </div>
                            <div className={`h-5 w-5 rounded-sm border flex items-center justify-center ${isSelected ? 'border-montana-pink bg-montana-pink' : 'border-white/30'}`}>
                              {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                            </div>
                          </div>
                          <p className="text-sm text-montana-muted ml-9">{service.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <AnimatedButton variant="outline" onClick={handleBack}>
                Back
              </AnimatedButton>
              <AnimatedButton onClick={handleNext} disabled={selectedServices.length === 0}>
                Continue to Plans
              </AnimatedButton>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-display text-2xl font-bold text-white mb-2">2. Configure Service Tiers</h2>
            {mode === "guided" && (
              <div className="mb-6 p-4 rounded-lg bg-montana-pink/10 border border-montana-pink/20">
                <p className="text-sm text-montana-pink flex items-center gap-2">
                  <Compass className="h-4 w-4" />
                  Based on your assessment, we&apos;ve pre-selected these services for your architecture.
                </p>
              </div>
            )}
            <div className="space-y-8 mb-8">
              {selectedServices.map(serviceId => {
                const serviceObj = services.find(s => s.id === serviceId)!;
                return (
                  <div key={serviceId} className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                      <serviceObj.icon className="h-5 w-5 text-montana-pink" /> {serviceObj.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {serviceObj.plans.map((plan) => {
                        const isSelected = selectedPlans[serviceId] === plan.id;
                        return (
                          <div 
                            key={plan.id}
                            onClick={() => selectPlan(serviceId, plan.id)}
                            className={`cursor-pointer rounded-lg border p-4 transition-all ${isSelected ? 'border-montana-pink bg-montana-magenta/10' : 'border-white/10 bg-montana-surface/50 hover:border-white/30'}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-white text-sm">{plan.name}</h4>
                              <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-montana-pink bg-montana-pink' : 'border-white/30'}`}>
                                {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                              </div>
                            </div>
                            <div className="text-xs text-montana-pink font-mono">{plan.price}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between">
              <AnimatedButton variant="outline" onClick={() => {
                if (mode === "guided") {
                  setStep(1);
                  setMode("manual"); // If they go back from recommendations, let them manually edit
                } else {
                  handleBack();
                }
              }}>
                Back
              </AnimatedButton>
              <AnimatedButton onClick={handleNext} disabled={Object.keys(selectedPlans).length !== selectedServices.length}>
                Continue to Details
              </AnimatedButton>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-display text-2xl font-bold text-white mb-6">3. Define Environment & Contact Details</h2>
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Company Name</label>
                  <input type="text" className="w-full rounded-sm border border-white/10 bg-montana-surface/50 px-4 py-3 text-white focus:border-montana-pink focus:outline-none" placeholder="Acme Corp" />
                </div>
                
                {/* Dynamic Fields based on Services */}
                {selectedServices.includes('druva-saas') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Number of Users (M365/Google)</label>
                    <input type="number" min="1" className="w-full rounded-sm border border-white/10 bg-montana-surface/50 px-4 py-3 text-white focus:border-montana-pink focus:outline-none" placeholder="e.g. 50" />
                  </div>
                )}
                {selectedServices.includes('ibm-backup') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Estimated Data Volume (TB)</label>
                    <input type="number" min="1" className="w-full rounded-sm border border-white/10 bg-montana-surface/50 px-4 py-3 text-white focus:border-montana-pink focus:outline-none" placeholder="e.g. 100" />
                  </div>
                )}
                {selectedServices.includes('maas360') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Number of Endpoints/Devices</label>
                    <input type="number" min="1" className="w-full rounded-sm border border-white/10 bg-montana-surface/50 px-4 py-3 text-white focus:border-montana-pink focus:outline-none" placeholder="e.g. 100" />
                  </div>
                )}
                {selectedServices.includes('popia') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Estimated Number of Employees</label>
                    <select 
                      className="w-full rounded-sm border border-white/10 bg-montana-surface/50 px-4 py-3 text-white focus:border-montana-pink focus:outline-none appearance-none"
                      defaultValue={guidedAnswers.size || "1 - 50 employees"}
                    >
                      <option value="1 - 50 employees">1 - 50</option>
                      <option value="51 - 250 employees">51 - 250</option>
                      <option value="251 - 1000 employees">251 - 1000</option>
                      <option value="1000+ employees">1000+</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Contact Name</label>
                  <input type="text" className="w-full rounded-sm border border-white/10 bg-montana-surface/50 px-4 py-3 text-white focus:border-montana-pink focus:outline-none" placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Corporate Email</label>
                  <input type="email" className="w-full rounded-sm border border-white/10 bg-montana-surface/50 px-4 py-3 text-white focus:border-montana-pink focus:outline-none" placeholder="jane@company.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Additional Requirements or Context</label>
                <textarea rows={3} className="w-full rounded-sm border border-white/10 bg-montana-surface/50 px-4 py-3 text-white focus:border-montana-pink focus:outline-none" placeholder="Tell us about your specific compliance needs, current infrastructure, or timeline..." />
              </div>
            </div>
            <div className="flex justify-between">
              <AnimatedButton variant="outline" onClick={handleBack}>
                Back
              </AnimatedButton>
              <AnimatedButton onClick={handleNext} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Submit Request"}
              </AnimatedButton>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-montana-magenta/10 border border-montana-pink/30 mb-6">
              <CheckCircle2 className="h-10 w-10 text-montana-pink" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-4">Request Received</h2>
            <p className="text-montana-muted max-w-md mx-auto mb-6">
              Your configuration for the selected services has been securely logged. A senior engineer will contact you shortly to finalize your setup.
            </p>
            <div className="bg-montana-surface/50 rounded-lg p-6 max-w-sm mx-auto mb-8 text-left border border-white/10">
              <h4 className="text-white font-bold mb-3 border-b border-white/10 pb-2">Selected Package:</h4>
              <ul className="space-y-2">
                {selectedServices.map(serviceId => {
                  const s = services.find(s => s.id === serviceId);
                  const p = s?.plans.find(p => p.id === selectedPlans[serviceId]);
                  return (
                    <li key={serviceId} className="text-sm">
                      <span className="text-white">{s?.name}</span>
                      <span className="text-montana-muted block text-xs">{p?.name}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <AnimatedButton variant="outline" onClick={() => window.location.href = '/'}>
              Return to Dashboard
            </AnimatedButton>
          </div>
        )}
      </GlassCard>
    </>
  );
}

export default function POSPage() {
  return (
    <div className="pt-24 pb-24 bg-montana-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-6">
        
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Architect Your Resilience Strategy
          </h1>
          <p className="text-montana-muted max-w-2xl mx-auto">
            Build a tailored data protection and security strategy. Choose guided assessment or select your services manually.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-montana-muted py-12">Loading configuration...</div>}>
          <POSForm />
        </Suspense>

      </div>
    </div>
  );
}
