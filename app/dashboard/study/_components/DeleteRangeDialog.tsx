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
import { Cards } from "@/lib/database/models/Cards";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Q } from "@nozbe/watermelondb";

export default function DeleteRangeDialog({ randId }: { randId: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    const db = await initDatabase();
    const rangesCollection = db.get<Range>("range");
    const range = await rangesCollection.find(randId);
    const cardsCollection = db.get<Cards>("cards");
    const cards = await cardsCollection.query(Q.where("range_id", randId)).fetch();
    await db.write(async () => {
      for (const card of cards) {
        await card.markAsDeleted();
      }
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
