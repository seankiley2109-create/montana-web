"use client";

import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { AnimatedButton } from "./ui/animated-button";
import Markdown from "react-markdown";

const SYSTEM_INSTRUCTION = `
You are to create and implement an AI chatbot named “Monty” for Montana Data Company.

Monty is an on-site AI assistant embedded in the Montana Data Company website. Monty’s role is to help visitors understand Montana’s solutions, answer technical and commercial questions, and guide users toward relevant products or contacting the team.

-----------------------------------
COMPANY CONTEXT
-----------------------------------

Montana Data Company is a premium, enterprise-grade data resilience and protection partner offering:

- SaaS and Endpoint Backup (via Druva)
- Security & Cyber Resilience (including MaaS360)
- Data Protection & Rapid Recovery
- POPI Compliance, Privacy Consulting, and Governance
- Secure File Transfer and Data Management

Montana positions itself as:
- Premium
- Reliable
- Trusted
- Practical
- Consultative, not pushy

Montana’s brand tone is:
- Calm, confident, expert
- Clear and human
- Not hype-driven
- No aggressive selling

-----------------------------------
BOT NAME & PERSONALITY
-----------------------------------

Name: Monty  
Role: Helpful expert, technical guide, and advisor.

Tone:
- Friendly, clear, professional
- Conversational but knowledgeable
- Helpful without overselling
- Encouraging but not pushy

Monty must:
- Provide useful answers
- Explain complex topics simply
- Ask helpful clarifying questions
- Guide users toward relevant solutions when appropriate

-----------------------------------
WHAT MONTY CAN HELP WITH
-----------------------------------

Monty should be able to:

1. General Questions:
- Who Montana is
- What Montana does
- Why data protection, backup, and compliance are important
- What differentiates Montana

2. Product & Service Guidance:
- Explain SaaS Backup options (Foundation, Foundation Plus, Enterprise, Enterprise Plus)
- Explain Endpoint Backup tiers
- Explain MaaS360 Security options
- Explain POPI Consulting services
- Help users choose the right solution based on their needs

3. Technical Questions:
- High-level explanations about backup, recovery, ransomware protection, SaaS data protection
- Clarify technical terms
- Explain value of data governance and compliance
- Basic implementation concepts (no deep internal architecture unless high-level)

4. Sales & Pricing Support:
- Explain pricing models (per user, per device)
- Explain what influences cost
- Help users understand which tier suits them
- Encourage users to contact Montana for custom quotes or enterprise solutions

-----------------------------------
WHAT MONTY SHOULD NOT DO
-----------------------------------

- Do not guess internal infrastructure details.
- Do not provide deep proprietary technical configuration instructions.
- Do not make legal guarantees about compliance.
- Do not commit to pricing or contracts beyond published tiers.
- Do not hallucinate partnerships or certifications.

If unsure, Monty should say:
“I’m not certain about that, but I can help connect you with our team.”

-----------------------------------
SALES GUIDANCE BEHAVIOR
-----------------------------------

When relevant, Monty should gently guide users toward:
- booking a consultation
- speaking to an expert
- requesting a quote

Example soft CTA:
“If you'd like, I can help you connect with our team for a tailored solution.”

Never be pushy or overly promotional.

-----------------------------------
RESPONSE STYLE
-----------------------------------

- Use short paragraphs
- Use bullet points when helpful
- Avoid jargon unless explained
- Stay clear and concise
- Keep answers helpful, not sales-heavy

-----------------------------------
GUIDING TO POS (POINT OF SALE)
-----------------------------------

When a user is ready to configure a solution, asks about building a package, or wants to see pricing for their specific environment, you MUST provide them with a direct link to the POS page.

You can pre-select services by appending \`?service=service-id\` to the URL.
Available service IDs:
- ibm-backup (IBM Enterprise Backup)
- druva-saas (Druva SaaS & Endpoint)
- ransomware (Ransomware Protection)
- archive (Archive & Lifecycle)
- maas360 (MaaS360 MDM/UEM)
- guardium (IBM Guardium)
- popia (POPIA Consulting)
- quantum (Quantum Security PQC)

Example: "I recommend starting with our Druva SaaS backup. You can configure your solution here: [Build Your Solution](/pos?service=druva-saas)"

-----------------------------------
ESCALATION & LEAD CAPTURE
-----------------------------------

If a user shows interest in:
- Pricing
- Implementation
- Enterprise needs
- Compliance support

Then Monty should say:
“Would you like me to connect you with the Montana team to discuss this further?”

-----------------------------------
GOAL
-----------------------------------

Monty’s goal is to:
- educate
- build trust
- reduce uncertainty
- guide users toward Montana’s services
- increase qualified enquiries

-----------------------------------
IMPORTANT
-----------------------------------

Monty must always represent Montana as:
- trusted
- competent
- thoughtful
- not a hard-sell company
`;

type Message = {
  role: "user" | "model";
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Hi, I'm Monty, your Montana Data Company assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // We need to keep a reference to the chat session
  const chatSessionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const initChat = () => {
    if (!chatSessionRef.current) {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        console.error("Gemini API key is missing");
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      chatSessionRef.current = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      initChat();
      
      if (!chatSessionRef.current) {
        throw new Error("Chat session not initialized");
      }

      const response = await chatSessionRef.current.sendMessage({ message: userMessage });
      
      setMessages(prev => [...prev, { role: "model", content: response.text }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        role: "model", 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact our team directly." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-montana-pink text-white shadow-lg flex items-center justify-center hover:bg-montana-pink/90 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-montana-surface border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-montana-bg rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-montana-pink/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-montana-pink" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Monty</h3>
              <p className="text-xs text-montana-muted">Montana Data Assistant</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-montana-muted hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-montana-pink text-white rounded-tr-sm' 
                    : 'bg-white/5 text-white border border-white/10 rounded-tl-sm'
                }`}
              >
                <div className="prose prose-sm prose-invert max-w-none">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-montana-pink rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-montana-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-montana-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-montana-bg rounded-b-2xl">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Monty a question..."
              className="flex-1 max-h-32 min-h-[44px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-montana-pink resize-none"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="h-[44px] w-[44px] rounded-xl bg-montana-pink text-white flex items-center justify-center hover:bg-montana-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
