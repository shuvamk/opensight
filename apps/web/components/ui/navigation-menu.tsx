"use client";

import { NavigationMenu as NavPrimitive } from "@base-ui/react/navigation-menu";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const NavRoot = NavPrimitive.Root;
const NavList = NavPrimitive.List;
const NavItem = NavPrimitive.Item;
const NavTrigger = NavPrimitive.Trigger;
const NavIcon = NavPrimitive.Icon;
const NavContent = NavPrimitive.Content;
const NavLink = NavPrimitive.Link;
const NavPortal = NavPrimitive.Portal;
const NavPositioner = NavPrimitive.Positioner;
const NavPopup = NavPrimitive.Popup;
const NavViewport = NavPrimitive.Viewport;
const NavArrow = NavPrimitive.Arrow;

const triggerClassName = cn(
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-light",
  "text-muted-foreground hover:text-foreground",
  "data-[popup-open]:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
);

const contentClassName = cn(
  "w-[calc(100vw-2rem)] min-[24rem]:w-max min-[32rem]:min-w-[280px]",
  "p-1 transition-[opacity,transform] duration-200 ease-out",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
  "data-[starting-style]:data-[activation-direction=left]:-translate-x-2",
  "data-[starting-style]:data-[activation-direction=right]:translate-x-2",
  "data-[ending-style]:data-[activation-direction=left]:translate-x-2",
  "data-[ending-style]:data-[activation-direction=right]:-translate-x-2",
);

function NavMenuRoot({ className, ...props }: NavPrimitive.Root.Props) {
  return (
    <NavRoot
      className={cn("relative flex min-w-max", className)}
      data-slot="navigation-menu"
      {...props}
    />
  );
}

function NavMenuList({ className, ...props }: NavPrimitive.List.Props) {
  return (
    <NavList
      className={cn("relative flex list-none gap-0.5", className)}
      data-slot="navigation-menu-list"
      {...props}
    />
  );
}

function NavMenuItem({ className, ...props }: NavPrimitive.Item.Props) {
  return <NavItem className={cn("relative", className)} data-slot="navigation-menu-item" {...props} />;
}

function NavMenuTrigger({
  className,
  children,
  showIcon = true,
  ...props
}: NavPrimitive.Trigger.Props & { showIcon?: boolean }) {
  return (
    <NavTrigger
      className={cn(triggerClassName, className)}
      data-slot="navigation-menu-trigger"
      data-nav-item
      {...props}
    >
      {children}
      {showIcon && (
        <NavIcon className="shrink-0 transition-transform duration-200 ease-out data-popup-open:rotate-180">
          <ChevronDownIcon className="size-4" />
        </NavIcon>
      )}
    </NavTrigger>
  );
}

function NavMenuContent({ className, ...props }: NavPrimitive.Content.Props) {
  return (
    <NavContent
      className={cn(contentClassName, className)}
      data-slot="navigation-menu-content"
      {...props}
    />
  );
}

function NavMenuLink({
  className,
  render,
  ...props
}: NavPrimitive.Link.Props) {
  return (
    <NavLink
      className={cn(
        "block rounded-md px-3 py-2 text-sm font-light no-underline transition-colors",
        "text-foreground hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      data-slot="navigation-menu-link"
      render={render}
      {...props}
    />
  );
}

const positionerClassName = cn(
  "h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)]",
  "transition-[top,left,right,bottom] duration-[var(--duration)] ease-[var(--easing)]",
  "before:absolute before:content-['']",
  "data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:h-2.5",
  "data-[side=top]:before:inset-x-0 data-[side=top]:before:bottom-[-10px] data-[side=top]:before:h-2.5",
  "data-[side=left]:before:inset-y-0 data-[side=left]:before:right-[-10px] data-[side=left]:before:w-2.5",
  "data-[side=right]:before:inset-y-0 data-[side=right]:before:left-[-10px] data-[side=right]:before:w-2.5",
  "data-[instant]:transition-none",
);

const popupClassName = cn(
  "relative overflow-hidden mt-3 rounded-lg border bg-popover text-popover-foreground shadow-lg",
  "origin-[var(--transform-origin)] transition-[opacity,transform] duration-[var(--duration)] ease-[var(--easing)]",
  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:duration-150 data-[ending-style]:ease-out",
);

function NavMenuPositioner({
  className,
  style,
  sideOffset = 8,
  collisionPadding = 20,
  ...props
}: NavPrimitive.Positioner.Props) {
  return (
    <NavPositioner
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      collisionAvoidance={{ side: "none" }}
      className={cn(positionerClassName, className)}
      style={
        {
          "--duration": "0.25s",
          "--easing": "cubic-bezier(0.22, 1, 0.36, 1)",
          ...style,
        } as unknown as React.CSSProperties
      }
      {...props}
    />
  );
}

function NavMenuPopup({ className, ...props }: NavPrimitive.Popup.Props) {
  return (
    <NavPopup className={cn(popupClassName, className)} data-slot="navigation-menu-popup" {...props}>
      <NavViewport className="relative h-full w-full overflow-hidden" />
    </NavPopup>
  );
}

export {
  NavRoot as NavigationMenuRoot,
  NavList as NavigationMenuList,
  NavItem as NavigationMenuItem,
  NavTrigger as NavigationMenuTrigger,
  NavIcon as NavigationMenuIcon,
  NavContent as NavigationMenuContent,
  NavLink as NavigationMenuLink,
  NavPortal as NavigationMenuPortal,
  NavPortal as NavMenuPortal,
  NavPositioner as NavigationMenuPositioner,
  NavPopup as NavigationMenuPopup,
  NavViewport as NavigationMenuViewport,
  NavArrow as NavigationMenuArrow,
  NavMenuRoot,
  NavMenuList,
  NavMenuItem,
  NavMenuTrigger,
  NavMenuContent,
  NavMenuLink,
  NavMenuPositioner,
  NavMenuPopup,
  triggerClassName,
  contentClassName,
};
