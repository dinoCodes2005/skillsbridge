"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "./my-components/authProvider";
import ToggleTheme from "./my-components/toggle-theme";
import { Button } from "./button";
import { useSession } from "next-auth/react";
import { useProfile } from "./my-components/profileProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "./badge";

import { Label } from "@radix-ui/react-label";
import { Input } from "./input";
import Profile from "./my-components/profile-dialog";
import ProfileDialog from "./my-components/profile-dialog";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export function Navbar({ className }: { className?: string }) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optionally: clear any local storage or cookies
      document.cookie =
        "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      // Redirect to login or homepage
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Mobile hamburger button */}
      <div className="md:hidden flex items-center justify-between p-4">
        <button
          onClick={toggleMenu}
          className="p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        <div className="flex items-center space-x-2">
          <Link href="/profile">
            <Avatar>
              <AvatarImage
                className="h-10 w-10 rounded-full ml-4"
                src="https://github.com/shadcn.png"
                alt="Profile"
              />
              <AvatarFallback>SB</AvatarFallback>
            </Avatar>

            {profile?.type && (
              <Badge className="fixed right-0 mr-4 mt-4">
                {" "}
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                {profile.type === "worker"
                  ? "Worker Status"
                  : "Consumer Status"}
              </Badge>
            )}
          </Link>
          <ToggleTheme className="fixed right-0 top-0" />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden absolute top-16 left-0 right-0 bg-background border-b z-50 shadow-lg transition-all duration-300 ease-in-out",
          isMenuOpen
            ? "max-h-[80vh] overflow-y-auto"
            : "max-h-0 overflow-hidden"
        )}
      >
        <div className="p-4 space-y-4">
          <div className="border-b pb-2">
            <h3 className="font-medium mb-2">Getting Started</h3>
            <ul className="space-y-2 pl-2">
              <li>
                <Link href="/" className="block py-1 hover:underline">
                  Introduction
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/installation"
                  className="block py-1 hover:underline"
                >
                  Installation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/primitives/typography"
                  className="block py-1 hover:underline"
                >
                  Typography
                </Link>
              </li>
            </ul>
          </div>

          <div className="border-b pb-2">
            <h3 className="font-medium mb-2">Components</h3>
            <ul className="space-y-2 pl-2">
              {components.map((component) => (
                <li key={component.title}>
                  <Link
                    href={component.href}
                    className="block py-1 hover:underline"
                  >
                    {component.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/docs" className="block py-2 font-medium">
            Documentation
          </Link>

          <Button onClick={handleLogout} className="w-full">
            Sign Out
          </Button>
        </div>
      </div>

      {/* Desktop navigation */}
      <NavigationMenu className="hidden md:flex mx-auto p-2 w-full">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      {/* <Icons.logo className="h-6 w-6" /> */}
                      <div className="mb-2 mt-4 text-lg font-medium">
                        shadcn/ui
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Beautifully designed components built with Radix UI and
                        Tailwind CSS.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/docs" title="Introduction">
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href="/docs/installation" title="Installation">
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href="/docs/primitives/typography" title="Typography">
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Documentation
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button onClick={handleLogout}>Sign Out</Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <ProfileDialog />

            {profile?.type && (
              <Badge className="fixed right-0 mr-4 mt-4">
                {" "}
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                {profile.type === "worker"
                  ? "Worker Status"
                  : "Consumer Status"}
              </Badge>
            )}
            <ToggleTheme className="hidden md:block fixed right-0 top-0" />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
