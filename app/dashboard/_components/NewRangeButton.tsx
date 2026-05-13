import { PlusCircle } from "lucide-react";
import React, { forwardRef } from "react";

const NewRangeButton = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={`col-span-6 md:col-span-2 border-2 border-dashed border-outline-variant p-5 flex flex-col items-center justify-center text-center gap-3 hover:bg-[#2a2a2b] transition-colors cursor-pointer group h-40 select-none ${props.className || ""}`}
    >
      <PlusCircle className="text-muted-foreground" />
      <div>
        <p className=" text-xl font-medium mb-2">Setup New Range</p>
        <p className="text-xs font-mono text-muted-foreground">
          SELECT SURAHS OR PAGES
        </p>
      </div>
    </div>
  );
});

NewRangeButton.displayName = "NewRangeButton";

export default NewRangeButton;
