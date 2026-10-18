import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { AuthScreen } from "@/components/auth-screen";
import { Button } from "@/components/ui/button";
import { clerkUiEnabled } from "@/lib/flags";

const appearance = {
  variables: {
    colorPrimary: "#1f6b45",
    colorBackground: "#f4f1ea",
    colorText: "#1c2b24",
    colorInputBackground: "#fffdf8",
    colorInputText: "#1c2b24",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-outfit), sans-serif",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "w-full bg-transparent shadow-none",
    headerTitle: "font-display text-[#1c2b24]",
    headerSubtitle: "text-[#5c6b63]",
    socialButtonsBlockButton: "border-[#d9d3c7]",
    formButtonPrimary: "bg-[#1f6b45] hover:bg-[#185538]",
    footerActionLink: "text-[#1f6b45]",
  },
};

export default function SignUpPage() {
  return (
    <AuthScreen title="A desk for the pitches you are actually sending.">
      <div className="rounded-2xl bg-[#f4f1ea] p-2 text-[#1c2b24]">
        {clerkUiEnabled() ? (
          <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/dashboard" appearance={appearance} />
        ) : (
          <div className="space-y-3 p-4">
            <h2 className="font-display text-3xl">Create an account</h2>
            <p className="text-sm text-[#5c6b63]">
              Add Clerk keys to turn on accounts. Until then, the demo workspace is open so you can walk the product.
            </p>
            <Button asChild>
              <Link href="/dashboard">Open the demo workspace</Link>
            </Button>
          </div>
        )}
      </div>
    </AuthScreen>
  );
}
