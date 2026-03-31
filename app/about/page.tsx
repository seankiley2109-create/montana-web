import { GlassCard } from "@/components/ui/glass-card";
import { Shield, Target, Globe, Users } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-12 bg-montana-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-6">

        {/* Hero Section */}
        <div className="py-16 md:py-24 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center border border-white/10 bg-montana-surface/80 backdrop-blur-sm px-4 py-1.5 text-xs font-bold tracking-widest text-montana-muted uppercase mb-8">
            <span className="flex h-2 w-2 bg-montana-pink mr-3 shadow-[0_0_8px_#F24567]"></span>
            Our Story
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Engineered for <span className="text-montana-gradient">Resilience.</span>
          </h1>
          <p className="text-lg md:text-xl text-montana-muted leading-relaxed">
            Montana Data Company is a South African data protection and cloud solutions provider helping organisations safeguard what matters most. We believe that true data protection goes beyond software — it requires strategy, governance, and an unwavering commitment to operational continuity.
          </p>
        </div>

        {/* Values Section */}
        <div className="py-16 border-t border-white/10">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-4">The Montana Difference</h2>
            <p className="text-montana-muted max-w-2xl mx-auto">
              We don&apos;t just sell products. We build resilient frameworks that ensure your business can withstand any disruption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="flex flex-col gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-montana-magenta/10 border border-montana-pink/20">
                <Target className="h-6 w-6 text-montana-pink" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Outcome-Led Strategy</h3>
              <p className="text-montana-muted leading-relaxed">
                We start with your business objectives — compliance, recovery time objectives (RTO), and risk tolerance — and engineer the technology around those requirements.
              </p>
            </GlassCard>

            <GlassCard className="flex flex-col gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-montana-magenta/10 border border-montana-pink/20">
                <Users className="h-6 w-6 text-montana-pink" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Partner-Enabled Delivery</h3>
              <p className="text-montana-muted leading-relaxed">
                Whether you are a direct enterprise client or a channel partner looking for white-label solutions, our multi-tenant architecture is built to scale with your delivery model.
              </p>
            </GlassCard>

            <GlassCard className="flex flex-col gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-montana-magenta/10 border border-montana-pink/20">
                <Globe className="h-6 w-6 text-montana-pink" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Data Sovereignty</h3>
              <p className="text-montana-muted leading-relaxed">
                With deep roots in South Africa, we understand the nuances of POPIA and local compliance, ensuring your data remains sovereign, secure, and governed correctly.
              </p>
            </GlassCard>

            <GlassCard className="flex flex-col gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-montana-magenta/10 border border-montana-pink/20">
                <Shield className="h-6 w-6 text-montana-pink" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Enterprise-Grade Security</h3>
              <p className="text-montana-muted leading-relaxed">
                We partner with industry leaders like IBM, Druva, and Red Hat to deliver military-grade encryption, immutable backups, and zero-trust architectures.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 text-center">
          <GlassCard glow className="max-w-3xl mx-auto p-12">
            <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to build your resilience strategy?</h2>
            <p className="text-montana-muted mb-8">
              Speak with our advisory team to discuss your infrastructure, compliance, and recovery requirements, or start building your solution now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pos">
                <AnimatedButton variant="primary" className="w-full sm:w-auto px-8 py-4">
                  Build Your Solution
                </AnimatedButton>
              </Link>
              <Link href="/contact">
                <AnimatedButton variant="outline" className="w-full sm:w-auto px-8 py-4">
                  Get in Touch
                </AnimatedButton>
              </Link>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
