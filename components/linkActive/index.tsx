import Link, { LinkProps } from "next/link";
import { ReactElement, cloneElement } from "react";
import { useRouter } from "next/router";

interface LinkActiveProps extends LinkProps {
  children: ReactElement;
  activeClass: string;
}

export function LinkActive({
  children,
  activeClass,
  ...rest
}: LinkActiveProps) {
  const { href } = rest;
  const { pathname } = useRouter();
  const classPassed = pathname === href ? activeClass : "";

  return (
    <Link {...rest}>{cloneElement(children, { className: classPassed })}</Link>
  );
}
