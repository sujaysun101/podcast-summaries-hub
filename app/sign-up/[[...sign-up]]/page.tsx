import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 font-bold text-xl text-white mb-2">
          <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
          YieldCast
        </div>
        <p className="text-white/40 text-sm">Create your free account</p>
      </div>
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#10b981",
            colorBackground: "#0f2040",
            colorText: "#ffffff",
            colorTextSecondary: "rgba(255,255,255,0.5)",
            colorInputBackground: "#0a1628",
            colorInputText: "#ffffff",
            borderRadius: "0.75rem",
          },
          elements: {
            card: "shadow-2xl border border-white/10",
            headerTitle: "text-white",
            headerSubtitle: "text-white/50",
            socialButtonsBlockButton: "border-white/15 text-white/70 hover:border-emerald-500/40 hover:text-white",
            formFieldInput: "border-white/15 focus:border-emerald-500/50",
            footerActionLink: "text-emerald-400 hover:text-emerald-300",
          },
        }}
      />
    </div>
  );
}
