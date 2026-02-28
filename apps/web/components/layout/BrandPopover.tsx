"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Brand } from "@/lib/api/brands/types";
import { cn } from "@/lib/utils";
import Avatar from "boring-avatars";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

export function BrandAvatar({ name, id, className = "" }: { name: string; id: string; className?: string }) {
  return (
    <div className={cn("size-8 rounded-lg overflow-hidden shrink-0 ring-1 ring-border/50", className)}>
      <Avatar
        name={id || name}
        size={32}
        variant="marble"
        square
      />
    </div>
  );
}

interface BrandPopoverProps {
  brands: Brand[];
  activeBrand: Brand | null;
  onSelectBrand: (id: string) => void;
  collapsed?: boolean;
  children: React.ReactNode;
}

export default function BrandPopover({
  brands,
  activeBrand,
  onSelectBrand,
  collapsed,
  children,
}: BrandPopoverProps) {
  const [search, setSearch] = useState("");
  const otherBrands = useMemo(
    () =>
      activeBrand
        ? brands.filter((b) => b.id !== activeBrand.id)
        : brands,
    [brands, activeBrand]
  );
  const filteredOthers = useMemo(
    () =>
      search.trim()
        ? otherBrands.filter((b) =>
          b.name.toLowerCase().includes(search.trim().toLowerCase())
        )
        : otherBrands,
    [otherBrands, search]
  );

  const triggerElement = React.isValidElement(children)
    ? children
    : <button type="button">{children}</button>;

  return (
    <Popover>
      <PopoverTrigger render={triggerElement} />
      <PopoverContent
        side={collapsed ? "right" : "bottom"}
        align="start"
        sideOffset={12}
        className="w-56"
      >
        <div className="flex flex-col">
          {activeBrand && (
            <div className="border-b border-border p-2">
              <div className="flex items-center gap-1.5">
                <BrandAvatar
                  name={activeBrand.name}
                  id={activeBrand.id}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-base text-foreground truncate">
                    {activeBrand.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Other brands */}
          <div className="p-2">
            <p className="pt-4 flex flex-col items-center justify-center text-xs font-normal text-muted-foreground mb-2">
              <Plus className="h-4 w-4" />
              <span className="text-sm font-normal text-muted-foreground">
                Add a brand to get started
              </span>
            </p>
            {otherBrands.length > 0 && (
              <div className="mb-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search brands"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                </div>
              </div>
            )}
            <div className="max-h-48 overflow-y-auto">
              {filteredOthers.length === 0 ? (
                <p className="py-3 text-sm text-muted-foreground">
                  {search.trim()
                    ? "No brands match your search"
                    : ""}
                </p>
              ) : (
                <ul className="space-y-0.5 px-2">
                  {filteredOthers.map((brand) => (
                    <li key={brand.id}>
                      <button
                        type="button"
                        onClick={() => onSelectBrand(brand.id)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-foreground",
                          "hover:bg-surface transition-colors text-left"
                        )}
                      >
                        <BrandAvatar
                          name={brand.name}
                          id={brand.id}
                        />
                        <span className="truncate">{brand.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Add brand */}
          <div className="border-t p-2">
            <Link href="/onboarding" className="block">
              <Button className="w-full gap-2" size="sm">
                <Plus className="h-4 w-4" />
                Add brand
              </Button>
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
