"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ReactElement } from "react"
import { usePathname, useSearchParams } from "next/navigation"

interface NavProps {
  className?: string
  links: {
    title: string
    label?: string
    link?: string
    icon: ReactElement
    variant: "default" | "ghost"
  }[]
}

export function Nav({ links, className }: NavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams();


  // console.log(pathname, searchParams)

  return (
    <div
      className={cn("group flex flex-col gap-4 py-2", className)}
    >
      <nav className="grid gap-1 px-2">
        {links.map((link, index) =>
            <Link
              key={index}
              href={`/${link.link}`}
              className={cn(
                buttonVariants({ variant: `/${link.link}` === pathname ? "default" : 'ghost', size: "sm" }),
                `/generate/${link.title}` === pathname &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
            >
              {link.icon}
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    `/generate/${link.title}` === pathname &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
        )}
      </nav>
    </div>
  )
}