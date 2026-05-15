"use client";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/ui/Motion";
import { fadeUp } from "@/lib/motion";
import { CloudSync, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { syncDatabase } from "@/lib/database/sync";

export function DashboardHeader() {
  const [firstName, setFirst] = useState("");
  const [error, setError] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    const toastId = toast.loading("Syncing your data...");
    try {
      await syncDatabase();
      toast.success("Sync complete!", { id: toastId });
    } catch (e) {
      console.error("Sync failed:", e);
      toast.error("Sync failed. Please try again.", { id: toastId });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    setError(false);
    const token = localStorage.getItem("token");
    const getUser = async () => {
      try {
        const response = await fetch(
          "https://quran-be-59779bf2.fastapicloud.dev/auth/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setFirst(data?.first_name);
        } else {
          toast.error(
            "Failed to fetch your data, please re-login or refresh the page",
          );
          setError(true);
        }
      } catch (e) {
        setError(true);
      }
    };

    getUser();
  }, []);

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-3"
    >
      <MotionDiv variants={fadeUp}>
        <p className=" text-sm text-muted-foreground mb-1">
          BISMILLAHIR RAHMANIR RAHIM
        </p>
        <h2 className="font-black text-5xl text-tighter">
          Ahlan, {firstName} {error && <span>(Offline)</span>} 👋
        </h2>
      </MotionDiv>
      <MotionDiv variants={fadeUp} className="">
        {error ? (
          "Offline"
        ) : (
          <Button
            variant={"outline"}
            size={"lg"}
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CloudSync />
            )}
            {syncing ? "Syncing..." : "Sync"}
          </Button>
        )}
      </MotionDiv>
    </MotionDiv>
  );
}
