import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";
import { Prefetcher } from "@/components/Prefetcher";
import { TailwindIndicator } from "@/components/TailwindIndicator";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={cn("bg-black relative flex flex-col w-full h-svh max-h-svh")}>
      <Navbar className="mx-3.5 pr-1 z-50" />
      <div className="flex-1 m-3 rounded-[36px] overflow-y-auto scrollbar-none">{children}</div>

      <Prefetcher />
      <TailwindIndicator />
    </div>
  );
}
