import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";

export function ExternalLink({ href, children, className }: PropsWithChildren<LinkProps & { className?: string }>) {
  return (
    <Link href={href} className={cn("underline", className)} target="_blank" rel="noopener noreferrer">{children}</Link>
  )
}
