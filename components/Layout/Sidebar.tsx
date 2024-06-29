"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Square3Stack3DIcon,
  TrashIcon,
  Squares2X2Icon,
  RectangleGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftOnRectangleIcon,
  ScissorsIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";
import Logo from "@/components/Introduction/FishLogo";
import clsx from "clsx";
import { signOut } from "next-auth/react";

const links = [
  { name: "Home", href: "/intro", icon: Squares2X2Icon },
  {
    name: "Templates",
    href: "/templates",
    icon: RectangleGroupIcon,
  },
  {
    name: "Upload Video",
    href: "/editor",
    icon: ScissorsIcon,
  },
  {
    name: "Project",
    href: "/comic-editor",
    icon: CubeTransparentIcon,
  },
  { name: "Sign Out", href: "#", icon: ArrowLeftOnRectangleIcon },
];

export default function SideNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-white shadow-lg">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md pl-2 md:h-20"
        href="/intro"
      >
        <div className="flex items-center transition-all duration-300">
          <Logo />
          {!collapsed && (
            <span className="text-2xl font-serif font-bold -ml-4 pr-2">
              AnimateSketch
            </span>
          )}
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-10">
        <div
          className={clsx("transition-all duration-300", {
            "w-16": collapsed,
            "w-64": !collapsed,
          })}
        >
          {links.map((link) => {
            const LinkIcon = link.icon;
            return link.name === "Sign Out" ? (
              <span
                key={link.name}
                onClick={() => signOut()}
                className={clsx(
                  "flex h-[48px] items-center gap-2 rounded-md bg-white p-3 text-sm font-medium cursor-pointer hover:bg-gray-200 hover:text-black-600",
                  {
                    "justify-center": collapsed,
                    "justify-start": !collapsed,
                  }
                )}
              >
                <LinkIcon className="w-6" />
                {!collapsed && <p>{link.name}</p>}
              </span>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "flex h-[48px] items-center gap-2 rounded-md bg-white p-3 text-sm font-medium hover:bg-gray-200 hover:text-black-600",
                  {
                    "bg-gray-100 text-black": pathname === link.href,
                    "justify-center": collapsed,
                    "justify-start": !collapsed,
                  }
                )}
              >
                <LinkIcon className="w-6" />
                {!collapsed && <p>{link.name}</p>}
              </Link>
            );
          })}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full h-[48px] ml-2 text-sm font-medium bg-gray-100 rounded-md hover:bg-gray-300"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-6" />
          ) : (
            <ChevronLeftIcon className="w-6" />
          )}
        </button>
        <div className="hidden h-auto w-full grow rounded-md bg-white md:block"></div>
      </div>
    </div>
  );
}
