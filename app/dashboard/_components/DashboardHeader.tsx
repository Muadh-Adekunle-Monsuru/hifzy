"use client";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/ui/Motion";
import { fadeUp } from "@/lib/motion";
import { getToken } from "@/lib/utils/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DashboardHeader() {
  const [firstName, setFirst] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const getUser = async () => {
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
          Ahlan, {firstName} 👋
        </h2>
      </MotionDiv>
      <MotionDiv variants={fadeUp} className="">
        <Button variant={"outline"} size={"lg"}>
          RESUME SESSION
        </Button>
      </MotionDiv>
    </MotionDiv>
  );
}
