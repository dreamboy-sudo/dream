import Link, { LinkProps as NextLinkProps } from "next/link";
import { PropsWithChildren } from "react";

type LinkProps = NextLinkProps & { className?: string; style?: React.CSSProperties };

export function ExternalLink({ href, children, ...props }: PropsWithChildren<LinkProps>) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </Link>
  );
}

type MaybeLinkProps = Omit<LinkProps, "href"> & { href?: string; external?: boolean };

export function MaybeLink({ href, external, className, children, style, ...props }: PropsWithChildren<MaybeLinkProps>) {
  if (!href) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const Component = external ? ExternalLink : Link;
  return (
    <Component href={href} className={className} style={style} {...props}>
      {children}
    </Component>
  );
}
