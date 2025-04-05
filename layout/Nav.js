"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";

const Nav = () => {
  const pathname = usePathname();
  const [toggle] = useState(false);
  return (
    <Fragment>
      
      <nav className={toggle ? "cyril-active" : ""}>
          <ul>
            <li
              className={
                pathname.includes("index") || pathname == "/" ? "cyril-active" : ""
              }
            >
              <Link legacyBehavior href="/">About Me</Link>
            </li>
            <li className={pathname == "/portfolio" ? "cyril-active" : ""}>
              <Link legacyBehavior href="/portfolio">
                My Work
              </Link>
            </li>
          </ul>
        </nav>
      
    </Fragment>
  );
};
export default Nav;
