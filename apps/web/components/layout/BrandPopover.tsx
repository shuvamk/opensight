"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as brandsApi from "@/lib/api/brands";
import type { Brand } from "@/lib/api/brands/types";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Pin, Plus, Search } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { BrandAvatar } from "./BrandAvatar";
import { BrandDeleteDialog } from "./BrandDeleteDialog";
import BrandMenu from "./BrandMenu";
import { BrandRenameDialog } from "./BrandRenameDialog";

interface BrandPopoverProps {
  brands: Brand[];
  activeBrand: Brand | null;
  onSelectBrand: (id: string) => void;
  onBrandDeleted?: (deletedId: string) => void;
  collapsed?: boolean;
  children: React.ReactNode;
}

export default function BrandPopover({
  brands,
  activeBrand,
  onSelectBrand,
  onBrandDeleted,
  collapsed,
  children,
}: BrandPopoverProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [brandToRename, setBrandToRename] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  const filteredOthers = useMemo(() => {
    const others = brands.filter((b) => b.id !== activeBrand?.id);
    if (!search.trim()) return others;
    const q = search.trim().toLowerCase();
    return others.filter((b) => b.name.toLowerCase().includes(q));
  }, [brands, activeBrand?.id, search]);

  const handlePinToggle = async (brand: Brand) => {
    try {
      await brandsApi.updateBrand(brand.id, { pinned: !brand.pinned });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    } catch {
      // ignore
    }
  };

  const triggerElement = React.isValidElement(children)
    ? children
    : <button type="button">{children}</button>;

  return (
    <>
      <Popover>
        <PopoverTrigger render={triggerElement} />
        <PopoverContent
          side={collapsed ? "right" : "bottom"}
          align="start"
          sideOffset={12}
          className="w-56 p-0"
        >
          <div className="flex flex-col">
            {activeBrand && (
              <div className="border-b border-border p-2">
                <div className="flex items-center gap-1.5">
                  <BrandAvatar name={activeBrand.name} id={activeBrand.id} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-base text-foreground truncate">
                      {activeBrand.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-2">
              {filteredOthers.length === 0 && !search.trim() ? (
                <p className="pt-4 flex flex-col items-center justify-center text-xs font-normal text-muted-foreground mb-2">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-normal text-muted-foreground">
                    Add a brand to get started
                  </span>
                </p>
              ) : (
                <p className="pb-1 text-xs font-light text-foreground">
                  Other brands:
                </p>
              )}

              {brands.length > 0 && (
                <div className="relative mb-1.5">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search brands"
                    size="sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-4 h-7 text-sm leading-none"
                  />
                </div>
              )}

              <div className="max-h-48 overflow-y-auto">
                {filteredOthers.length === 0 ? (
                  <p className="py-3 text-sm text-muted-foreground">
                    {search.trim() ? "No brands match your search" : ""}
                  </p>
                ) : (
                  <ul className="space-y-0.5">
                    {filteredOthers.map((brand) => (
                      <li
                        key={brand.id}
                        className="flex items-center gap-0.5 rounded-md group hover:bg-surface"
                      >
                        <button
                          type="button"
                          onClick={() => onSelectBrand(brand.id)}
                          className={cn(
                            "flex-1 min-w-0 flex items-center gap-1 rounded-md p-1 text-sm font-light text-foreground",
                            "hover:bg-surface transition-colors text-left"
                          )}
                        >
                          <BrandAvatar size={14} name={brand.name} id={brand.id} />
                          <span className="truncate">{brand.name}</span>
                        </button>
                          {brand.pinned && (
                            <Pin className="size-3 rotate-45 text-primary" />
                          )}
                        <BrandMenu
                          brand={brand}
                          setBrandToRename={setBrandToRename}
                          handlePinToggle={handlePinToggle}
                          setBrandToDelete={setBrandToDelete}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

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

      {/* Dialogs are Base UI — same focus manager, no conflicts */}
      <BrandRenameDialog
        brand={brandToRename}
        onClose={() => setBrandToRename(null)}
      />
      <BrandDeleteDialog
        brand={brandToDelete}
        onClose={() => setBrandToDelete(null)}
        onDeleted={onBrandDeleted}
      />
    </>
  );
}