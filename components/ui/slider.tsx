"use client";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
export function Slider({ className, ...props }: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root className={cn("relative flex w-full touch-none select-none items-center py-2", className)} {...props}>
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <SliderPrimitive.Range className="absolute h-full bg-emerald-500" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-emerald-500 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2" />
    </SliderPrimitive.Root>
  );
}
