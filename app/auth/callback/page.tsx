"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      console.error("No code found");
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await fetch(
          "https://quran-be-59779bf2.fastapicloud.dev/auth/exchange",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          },
        );

        if (!response.ok) {
          throw new Error("Something went wrong while signing you in.");
        }

        const data = await response.json();

        localStorage.setItem("token", data.token);

        router.push("/dashboard");
      } catch (error) {
        toast.error("Something went wrong while signing you in.", {
          description: "Please try again.",
        });
        router.push("/");
        console.error(error);
      }
    };

    exchangeCode();
  }, [router, searchParams]);

  return null;
}

export default function CallbackPage() {
  return (
    <div className="bg-[#131314] text-white h-screen w-screen flex flex-col gap-3 items-center justify-center">
      <Loader2 className="size-8 animate-spin" />
      <p>Signing you in...</p>
      <Suspense fallback={null}>
        <CallbackContent />
      </Suspense>
    </div>
  );
}
