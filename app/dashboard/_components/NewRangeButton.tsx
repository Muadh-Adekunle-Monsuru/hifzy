import React, { forwardRef } from "react";

const NewRangeButton = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={`col-span-6 md:col-span-2 border-2 border-dashed border-outline-variant p-md flex flex-col items-center justify-center text-center gap-sm hover:bg-surface-container-lowest transition-colors cursor-pointer group h-40 select-none ${props.className || ""}`}
    >
      <span className="material-symbols-outlined text-[48px] text-outline group-hover:text-primary transition-colors">
        add_circle
      </span>
      <div>
        <p className="font-headline-md text-headline-md-mobile">
          Setup New Range
        </p>
        <p className="font-label-caps text-label-caps text-outline mt-xs">
          SELECT SURAHS OR PAGES
        </p>
      </div>
    </div>
  );
});

NewRangeButton.displayName = "NewRangeButton";

export default NewRangeButton;
