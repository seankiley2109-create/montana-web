// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { GlassCard } from "@/components/ui/glass-card";
// import { AnimatedButton } from "@/components/ui/animated-button";
// import { Phone, Mail, Facebook, Linkedin } from "lucide-react";

// const contactSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Please enter a valid email address"),
//   company: z.string().min(1, "Company name is required"),
//   message: z.string().min(10, "Message must be at least 10 characters"),
// });

// type ContactFormValues = z.infer<typeof contactSchema>;

// export function Contact() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<ContactFormValues>({
//     resolver: zodResolver(contactSchema),
//   });

//   const onSubmit = async (data: ContactFormValues) => {
//     setIsSubmitting(true);
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     console.log("Form submitted:", data);
//     setIsSubmitting(false);
//     setIsSuccess(true);
//     reset();
//     setTimeout(() => setIsSuccess(false), 5000);
//   };

//   return (
//     <section id="contact" className="py-24 relative overflow-hidden">
//       <div className="mx-auto max-w-7xl px-6">
//         <div className="mb-16 text-center lg:text-left">
//           <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
//             Secure your operational <span className="text-montana-gradient">future.</span>
//           </h2>
//           <p className="text-montana-muted max-w-2xl">
//             Connect with our advisory team to discuss your infrastructure, compliance, and recovery requirements.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
//           {/* Contact Details Column */}
//           <div className="lg:col-span-5 space-y-12">
//             <div>
//               <h3 className="text-xl font-display font-bold text-white mb-6">Talk to us</h3>
//               <div className="space-y-6">
//                 <a 
//                   href="tel:+27871883843" 
//                   className="flex items-center gap-4 text-montana-muted hover:text-white transition-colors group"
//                 >
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-montana-pink/50 transition-colors">
//                     <Phone className="h-5 w-5 text-montana-pink" />
//                   </div>
//                   <span className="text-lg">+27 (0)87 188 3843</span>
//                 </a>
//                 <a 
//                   href="mailto:support@montanadc.com" 
//                   className="flex items-center gap-4 text-montana-muted hover:text-white transition-colors group"
//                 >
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-montana-pink/50 transition-colors">
//                     <Mail className="h-5 w-5 text-montana-pink" />
//                   </div>
//                   <span className="text-lg">support@montanadc.com</span>
//                 </a>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-6">Connect</h3>
//               <div className="flex gap-4">
//                 <a 
//                   href="https://www.facebook.com/MontanaDataCompany/" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-montana-muted hover:text-white hover:border-montana-pink/50 hover:bg-montana-pink/5 transition-all"
//                   aria-label="Facebook"
//                 >
//                   <Facebook className="h-5 w-5" />
//                 </a>
//                 <a 
//                   href="https://www.linkedin.com/company/montana-data-company/posts/?feedView=all" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-montana-muted hover:text-white hover:border-montana-pink/50 hover:bg-montana-pink/5 transition-all"
//                   aria-label="LinkedIn"
//                 >
//                   <Linkedin className="h-5 w-5" />
//                 </a>
//               </div>
//             </div>
//           </div>

//           {/* Form Column */}
//           <div className="lg:col-span-7">
//             <GlassCard glow className="p-8 md:p-10">
//               {isSuccess ? (
//                 <div className="text-center py-12">
//                   <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-6">
//                     <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                   <h3 className="font-display text-2xl font-bold text-white mb-2">Message Received</h3>
//                   <p className="text-montana-muted">Our advisory team will be in touch shortly.</p>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <label htmlFor="name" className="text-sm font-medium text-white/70">
//                         Full Name
//                       </label>
//                       <input
//                         {...register("name")}
//                         id="name"
//                         className="w-full rounded-sm border border-white/10 bg-montana-surface/50 px-4 py-3 text-white placeholder-white/30 focus:border-montana-pink focus:outline-none focus:ring-1 focus:ring-montana-pink transition-colors"
//                         placeholder="Jane Doe"
//                       />
//                       {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
//                     </div>
//                     <div className="space-y-2">
//                       <label htmlFor="email" className="text-sm font-medium text-white/70">
//                         Corporate Email
//                       </label>
//                       <input
//                         {...register("email")}
//                         id="email"
//                         type="email"
//                         className="w-full rounded-sm border border-white/10 bg-montana-surface/50 px-4 py-3 text-white placeholder-white/30 focus:border-montana-pink focus:outline-none focus:ring-1 focus:ring-montana-pink transition-colors"
//                         placeholder="jane@company.com"
//                       />
//                       {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="company" className="text-sm font-medium text-white/70">
//                       Company Name
//                     </label>
//                     <input
//                       {...register("company")}
//                       id="company"
//                       className="w-full rounded-sm border border-white/10 bg-montana-surface/50 px-4 py-3 text-white placeholder-white/30 focus:border-montana-pink focus:outline-none focus:ring-1 focus:ring-montana-pink transition-colors"
//                       placeholder="Acme Corp"
//                     />
//                     {errors.company && <p className="text-xs text-red-400">{errors.company.message}</p>}
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="message" className="text-sm font-medium text-white/70">
//                       Project Details
//                     </label>
//                     <textarea
//                       {...register("message")}
//                       id="message"
//                       rows={4}
//                       className="w-full rounded-sm border border-white/10 bg-montana-surface/50 px-4 py-3 text-white placeholder-white/30 focus:border-montana-pink focus:outline-none focus:ring-1 focus:ring-montana-pink transition-colors resize-none"
//                       placeholder="Describe your infrastructure needs..."
//                     />
//                     {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
//                   </div>
//                   <AnimatedButton
//                     type="submit"
//                     variant="primary"
//                     className="w-full"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Submitting..." : "Request an Engineering Consultation"}
//                   </AnimatedButton>
//                   <div className="mt-4 text-center text-xs text-montana-muted flex items-center justify-center gap-2">
//                     <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                     All communications are strictly confidential.
//                   </div>
//                 </form>
//               )}
//             </GlassCard>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
