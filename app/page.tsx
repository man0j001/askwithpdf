import FileUpload from "@/components/FileUpload";
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  FileStack,
  FileText,
  MessagesSquare,
  GitCompare,
  Languages,
  Sparkles,
  ArrowUpRight,
  Globe,
  Monitor,
  Smartphone,
  Apple,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Document Summary",
    body: "Identify key information and generate concise summaries to grasp the essence quickly.",
  },
  {
    icon: MessagesSquare,
    title: "Smart Q&A",
    body: "Ask questions grounded in your PDF. Get accurate, cited answers you can verify.",
  },
  {
    icon: GitCompare,
    title: "Content Comparison",
    body: "Navigate to referenced content for precise comparison and faster reading.",
  },
  {
    icon: Languages,
    title: "Document Translation",
    body: "Translate PDFs while viewing the original side-by-side for clarity.",
  },
];

const platforms = [
  { icon: Globe, label: "Web" },
  { icon: Monitor, label: "Windows & Mac" },
  { icon: Smartphone, label: "Android" },
  { icon: Apple, label: "iOS" },
];

const faqs = [
  {
    q: "Why is this better than other reading tools?",
    a: "Powered by advanced AI, with translation, fast reading, and suggested questions grounded in your document.",
  },
  {
    q: "How does it work?",
    a: "Upload a PDF and start asking questions. We handle the parsing, indexing, and retrieval securely.",
  },
  {
    q: "Is it free?",
    a: "You can start for free. Some advanced features may require a subscription.",
  },
  {
    q: "Is it secure?",
    a: "Files are stored securely and are not used to train models.",
  },
];

export default async function Home() {
  return (
    <div className="w-full bg-pure-white text-ink">
      {/* Top Nav */}
      <header className="sticky top-0 z-30 w-full border-b border-dove/40 bg-pure-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-pure-white">
              <FileStack className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="text-[15px] font-medium tracking-[-0.009em]">AskwithPdf</span>
          </div>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-[15px] tracking-[-0.009em] text-ash transition-colors hover:text-ink">
              Features
            </a>
            <a href="#everywhere" className="text-[15px] tracking-[-0.009em] text-ash transition-colors hover:text-ink">
              Platforms
            </a>
            <a href="#faq" className="text-[15px] tracking-[-0.009em] text-ash transition-colors hover:text-ink">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="cursor-pointer rounded-full px-3 py-1.5 text-[15px] tracking-[-0.009em] text-ink transition-colors hover:bg-fog">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="cursor-pointer rounded-full bg-ink px-4 py-1.5 text-[15px] tracking-[-0.009em] text-pure-white transition-colors hover:bg-ink/90">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero (first fold) */}
      <section className="relative overflow-hidden">
        {/* peach dawn glow — hero only */}
        <div className="hero-glow pointer-events-none absolute inset-0" />
        {/* faint dotted marble grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(23,25,28,.05)_1px,transparent_0)] [background-size:26px_26px]" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          {/* floating decorative product cards (wide desktop only, non-interactive) */}
          <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden="true">
            {/* mini AI answer card — top left */}
            <div className="absolute left-0 top-10 w-60 rotate-[-3deg] rounded-3xl bg-pure-white p-4 shadow-steep">
              <div className="rounded-2xl bg-sky-wash p-3">
                <svg viewBox="0 0 200 56" className="h-12 w-full" fill="none">
                  <path d="M2 44 L40 30 L72 36 L108 16 L150 24 L198 8" stroke="#5d2a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 50 L40 44 L72 40 L108 34 L150 30 L198 22" stroke="#4a90e2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-apricot-wash text-rust">
                  <Sparkles className="h-3 w-3" strokeWidth={2} />
                </span>
                <span className="text-[13px] text-ash">Max Token: 100K</span>
              </div>
            </div>

            {/* Languages card — top right */}
            <div className="absolute right-2 top-4 w-52 rotate-[3deg] rounded-3xl bg-pure-white p-5 shadow-steep">
              <div className="text-[13px] text-graphite">Languages supported</div>
              <div className="mt-1 text-[34px] font-medium leading-none tracking-[-0.02em] text-ink">100+</div>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-apricot-wash px-2 py-0.5 text-[12px] font-medium text-rust">
                <ArrowUpRight className="h-3 w-3" strokeWidth={2.25} /> +12 this year
              </div>
            </div>

            {/* sources list card — bottom right */}
            <div className="absolute bottom-6 right-10 w-56 rotate-[-2deg] rounded-3xl bg-pure-white p-5 shadow-steep">
              <div className="text-[13px] font-medium text-ink">Top sources</div>
              <div className="mt-3 space-y-2.5">
                {[
                  ["Executive summary", "p. 3"],
                  ["Market analysis", "p. 12"],
                  ["Recommendations", "p. 24"],
                ].map(([name, page]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-[13px] text-graphite">{name}</span>
                    <span className="text-[13px] font-medium text-ink">{page}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* avatar cluster — bottom left */}
            <div className="absolute bottom-12 left-6 flex items-center -space-x-2">
              {[
                ["AB", "bg-apricot-wash"],
                ["KM", "bg-sky-wash"],
                ["JR", "bg-[#d8f0e2]"],
              ].map(([initials, bg]) => (
                <span
                  key={initials}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-pure-white text-[12px] font-medium text-ink ${bg}`}
                >
                  {initials}
                </span>
              ))}
            </div>
          </div>

          {/* hero copy */}
          <div className="relative mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dove/60 bg-pure-white/70 px-3 py-1 text-[13px] tracking-[-0.009em] text-ash">
              <Sparkles className="h-3.5 w-3.5 text-rust" strokeWidth={2} />
              AI reading, grounded in your PDF
            </span>
            <h1 className="font-signifier mt-6 text-[44px] font-normal leading-[1.05] tracking-[-1.2px] text-ink md:text-[64px] md:tracking-[-1.6px]">
              Chat with any PDF
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[18px] leading-[1.4] tracking-[-0.16px] text-ash">
              Use AI to help you read better. Upload a document and start asking questions — every answer arrives with page citations you can jump to.
            </p>
          </div>

          {/* upload card */}
          <div className="relative mx-auto mt-10 max-w-2xl">
            <div className="rounded-3xl border border-dove/40 bg-pure-white p-6 shadow-steep md:p-9">
              <div className="text-center">
                <div className="text-[15px] font-medium tracking-[-0.009em] text-ink">Chat with any PDF</div>
                <p className="mt-1 text-[13px] text-graphite">File types supported: PDF · Max file size: 10MB</p>
              </div>
              <div className="mt-5">
                <FileUpload />
              </div>
            </div>
          </div>

          {/* feature chips */}
          <div className="relative mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-2.5 text-[13px] text-ash">
            {["Max Token: 100K", "100+ Languages", "AI-powered Q&A", "Citations & page jumps"].map((chip) => (
              <span key={chip} className="rounded-full border border-dove/50 bg-fog px-3 py-1 tracking-[-0.009em]">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-dove/30 bg-fog">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-signifier text-[40px] font-normal leading-[1.1] tracking-[-0.5px] text-ink md:text-[44px]">
              Understand documents faster
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ash">Editorial-grade reading tools, powered by AI.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group rounded-3xl border border-dove/30 bg-pure-white p-7 shadow-steep-soft transition-shadow hover:shadow-steep"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-apricot-wash text-rust">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-[22px] font-medium tracking-[-0.2px] text-ink">{title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ash">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everywhere */}
      <section id="everywhere" className="bg-pure-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-signifier text-[40px] font-normal leading-[1.1] tracking-[-0.5px] text-ink md:text-[44px]">
              Use AskwithPdf everywhere
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ash">
              Web, desktop, and mobile. Your PDFs stay in sync across devices.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {platforms.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-3xl border border-dove/30 bg-fog px-5 py-5 transition-colors hover:bg-pure-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pure-white text-ink shadow-steep-soft">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="text-[15px] font-medium tracking-[-0.009em] text-ink">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="border-t border-dove/30 bg-fog">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-signifier text-[40px] font-normal leading-[1.1] tracking-[-0.5px] text-ink md:text-[44px]">
              Frequently asked
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {faqs.map(({ q, a }) => (
              <div key={q} className="rounded-3xl border border-dove/30 bg-pure-white p-6 shadow-steep-soft">
                <div className="text-[17px] font-medium tracking-[-0.009em] text-ink">{q}</div>
                <p className="mt-2 text-[16px] leading-relaxed text-ash">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-dove/30 bg-pure-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-[13px] text-graphite sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-ink text-pure-white">
              <FileStack className="h-3 w-3" strokeWidth={1.75} />
            </span>
            <span className="text-ash">AskwithPdf</span>
          </div>
          <span>© {new Date().getFullYear()} AskwithPdf. Calm reading, cited answers.</span>
        </div>
      </footer>
    </div>
  );
}
