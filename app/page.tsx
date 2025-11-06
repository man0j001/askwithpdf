import FileUpload from "@/components/FileUpload";
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default async function Home() {
  return (
    <div className="w-full">
      {/* Top Nav */}
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/assets/icons/pdfIcon.svg" alt="logo" className="h-6 w-6" />
            <span className="font-semibold">AskwithPdf</span>
          </div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">Login</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700">Sign up</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero (first fold) with radial grid background */}
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,.07)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">ChatPDF Online</h1>
            <p className="mt-4 text-gray-600 text-lg md:text-xl">Use AI to help you read better. Upload a PDF and start asking questions.</p>
          </div>

          {/* Single elite upload card */}
          <div className="mt-10 mx-auto max-w-2xl">
            <div className="rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-[0_2px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5 p-6 md:p-10">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-800">Chat with any PDF</div>
                <p className="text-xs text-gray-500 mt-1">File types supported: PDF ｜ Max file size: 10MB</p>
              </div>
              <div className="mt-5">
                <FileUpload />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-4 text-sm text-gray-600">
            <div className="rounded-full bg-gray-100 px-3 py-1">Max Token: 100K</div>
            <div className="rounded-full bg-gray-100 px-3 py-1">100+ Languages</div>
            <div className="rounded-full bg-gray-100 px-3 py-1">AI-powered Q&A</div>
            <div className="rounded-full bg-gray-100 px-3 py-1">Citations & page jumps</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center">PDF Tools</h2>
        <p className="text-center text-gray-600 mt-2">Understand documents faster with AI.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border p-6 bg-white">
            <h3 className="font-semibold text-lg">Document Summary</h3>
            <p className="text-gray-600 mt-2">Identify key information and generate concise summaries to grasp the essence quickly.</p>
          </div>
          <div className="rounded-xl border p-6 bg-white">
            <h3 className="font-semibold text-lg">Smart Q&A</h3>
            <p className="text-gray-600 mt-2">Ask questions grounded in your PDF. Get accurate, cited answers.</p>
          </div>
          <div className="rounded-xl border p-6 bg-white">
            <h3 className="font-semibold text-lg">Content Comparison</h3>
            <p className="text-gray-600 mt-2">Navigate to referenced content for precise comparison and faster reading.</p>
          </div>
          <div className="rounded-xl border p-6 bg-white">
            <h3 className="font-semibold text-lg">Document Translation</h3>
            <p className="text-gray-600 mt-2">Translate PDFs while viewing the original side-by-side for clarity.</p>
          </div>
        </div>
      </section>

      {/* Everywhere */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Use ASKWithPDF Everywhere</h2>
        <p className="text-center text-gray-600 mt-2">Web, desktop, and mobile. Your PDFs stay in sync across devices.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl border p-4 bg-white text-center">Web</div>
          <div className="rounded-xl border p-4 bg-white text-center">Windows & Mac</div>
          <div className="rounded-xl border p-4 bg-white text-center">Android</div>
          <div className="rounded-xl border p-4 bg-white text-center">iOS</div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center">FAQs</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border p-5 bg-white">
            <div className="font-semibold">Why is this better than other reading tools?</div>
            <p className="text-gray-600 mt-2">Powered by advanced AI, supports translation, fast reading, and suggested questions.</p>
          </div>
          <div className="rounded-xl border p-5 bg-white">
            <div className="font-semibold">How does it work?</div>
            <p className="text-gray-600 mt-2">Upload a PDF and start asking questions. We handle the rest securely.</p>
          </div>
          <div className="rounded-xl border p-5 bg-white">
            <div className="font-semibold">Is it free?</div>
            <p className="text-gray-600 mt-2">You can start for free. Some features may require a subscription.</p>
          </div>
          <div className="rounded-xl border p-5 bg-white">
            <div className="font-semibold">Is it secure?</div>
            <p className="text-gray-600 mt-2">Files are stored securely and are not used to train models.</p>
          </div>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} AskwithPdf</footer>
    </div>
  );
}
