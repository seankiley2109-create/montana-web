import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { ClientLogos } from "@/components/sections/client-logos";
import { Services } from "@/components/sections/services";
import { WhoWeServe } from "@/components/sections/who-we-serve";
import { WhyMontana } from "@/components/sections/why-montana";
import { TechStack } from "@/components/sections/tech-stack";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ClientLogos />
      <Services />
      <WhoWeServe />
      <WhyMontana />
      <TechStack />
      <Contact />
    </>
  );
}
