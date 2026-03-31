import Link from "next/link";
import Image from "next/image";
import { AnimatedButton } from "@/components/ui/animated-button";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-montana-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/logos/montana-logo.svg" 
            alt="Montana Data Company" 
            width={240} 
            height={100} 
            className="h-36 w-auto object-contain" // Changed from h-8 to h-12 (48px)
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-montana-muted">
          <Link href="/services" className="hover:text-montana-pink transition-colors">Services Offered</Link>
          <Link href="/about" className="hover:text-montana-pink transition-colors">About Us</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/pos" className="hidden md:inline-flex">
            <AnimatedButton variant="outline">
              Build Your Solution
            </AnimatedButton>
          </Link>
        </div>
      </div>
    </header>
  );
}
