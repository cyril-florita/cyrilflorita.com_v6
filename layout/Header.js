"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Nav from "./Nav";

const Header = () => {

  const pathname = usePathname();

  const [toggle] = useState(false);

  return (

    <div className="cyril-top-panel cyril-tp-2">

      <div className="cyril-tp-frame">

        <Link legacyBehavior href="http://www.cyrilflorita.com">
          <a className="cyril-logo">
            <strong>C<span>yril</span></strong>
          </a>
        </Link>

        <Nav />

      </div>

    </div>

  );

};

export default Header;