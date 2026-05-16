"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function LoginDialog() {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
  };
  return (
    <div className="">
      <Dialog>
        <DialogTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <UserCircle className="size-8 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-white">Sign in with Quran.com</p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">
              Sign in with Quran.com
            </DialogTitle>
            <DialogDescription className="text-white/55">
              You can sign in using your Quran.com account to continue using the
              app.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="text-white">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-primary text-on-primary cursor-pointer hover:bg-black/80 hover:text-white transition-all duration-200 ease-in-out"
              onClick={handleLogin}
            >
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
