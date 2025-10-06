import { cn } from "@/lib/utils";
import Link from "next/link";
import { SVGProps } from "react";

function X({ fill, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.99175 0.611572H0.657104V3.94621H3.99175V0.611572ZM3.99179 3.94626H7.32643V7.2809H3.99179V3.94626ZM7.32647 7.28094H10.6611V10.6156H7.32647V7.28094ZM20.6655 0.611572H24.0001V3.94621H20.6655V0.611572ZM20.6655 3.94626H17.3308V7.2809H20.6655V3.94626ZM13.9961 7.28094H17.3308V10.6156H13.9961V7.28094ZM10.6611 10.616H13.9958V13.9506H10.6611V10.616Z"
        fill={fill ?? "white"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.6649 24.2671L23.9995 24.2671L23.9995 20.9324L20.6649 20.9324L20.6649 24.2671ZM20.6645 20.9324L17.3298 20.9324L17.3298 17.5978L20.6645 17.5978L20.6645 20.9324ZM17.3298 17.5977L13.9952 17.5977L13.9952 14.2631L17.3298 14.2631L17.3298 17.5977ZM3.99111 24.2671L0.656467 24.2671L0.656468 20.9324L3.99111 20.9324L3.99111 24.2671ZM3.99115 20.9324L7.32579 20.9324L7.32579 17.5978L3.99115 17.5978L3.99115 20.9324ZM10.6605 17.5977L7.32583 17.5977L7.32584 14.2631L10.6605 14.2631L10.6605 17.5977ZM13.9952 14.2627L10.6605 14.2627L10.6605 10.9281L13.9952 10.9281L13.9952 14.2627Z"
        fill={fill ?? "white"}
      />
    </svg>
  );
}

export function BackButton({ className, fill }: { className?: string; fill?: string }) {
  return (
    <Link
      className={cn(
        "flex items-center justify-center rounded-full size-10 md:size-14 bg-black/20 backdrop-blur-sm",
        className
      )}
      href="/"
    >
      <X className="size-5 md:size-6" fill={fill} />
    </Link>
  );
}
