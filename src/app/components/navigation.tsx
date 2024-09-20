"use client";

import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icons } from "../../components/ui/icons";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import Loader from "./loader";
import UseAvatar from "./avatar";

const Navigation = () => {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="w-full p-3">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-fit">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Icons.logo className="text-emerald-600" />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center font-roboto px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-emerald-700 hover:text-gray-700"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center h-8">
            <Unauthenticated>
              <Link href='/sign_in'>
                <Button variant="outline">Sign In</Button>
              </Link>
            </Unauthenticated>
            <Authenticated>
              <div className="h-15 w-15">
                <UseAvatar url=""/>
              </div>
            </Authenticated>
            <AuthLoading>
              <Loader className="text-zinc-200" />
            </AuthLoading>
          </div>
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-gray-600 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {/* {isSignedIn ? (
                    <UserButton afterSignOutUrl="/" />
                  ) : (
                    <Link href="/sign-in">
                      <Button className="w-full">Sign in</Button>
                    </Link>
                  )} */}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
