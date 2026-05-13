"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { initDatabase } from "@/lib/database/init";
import { Range } from "@/lib/database/models/Range";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteRangeDialog({ randId }: { randId: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    const db = await initDatabase();
    const rangesCollection = db.get<Range>("range");
    const range = await rangesCollection.find(randId);
    await db.write(async () => {
      await range.markAsDeleted();
    });
    toast.success("Range deleted successfully");
    router.replace("/dashboard");
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"sm"}>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-white">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            range and all its contents.
          </DialogDescription>
        </DialogHeader>
        <Button variant={"destructive"} onClick={handleDelete}>
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
}
