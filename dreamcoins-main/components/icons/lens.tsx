import { SVGProps } from "react";

export function LensIcon({ fill, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="13.5" cy="13.5" r="12" stroke="currentColor" stroke-width="3" />
      <path d="M14 7C15.8333 7 19.5 8.1 19.5 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  );
}
