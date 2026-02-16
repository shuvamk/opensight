"use client";

import { useEffect } from "react";
import { useBrands } from "@/hooks/useBrand";
import { useBrandStore } from "@/stores/brand-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface BrandSwitcherProps {
  collapsed?: boolean;
}

export default function BrandSwitcher({ collapsed }: BrandSwitcherProps) {
  const { data, isLoading } = useBrands();
  const brands = Array.isArray(data) ? data : [];
  const { activeBrandId, setActiveBrand } = useBrandStore();

  useEffect(() => {
    if (!isLoading && brands.length > 0 && !activeBrandId) {
      setActiveBrand(brands[0].id);
    }
  }, [isLoading, brands, activeBrandId, setActiveBrand]);

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (!brands || brands.length === 0) {
    return <div className="text-xs text-text-secondary">No brands</div>;
  }

  return (
    <Select value={activeBrandId || ""} onValueChange={setActiveBrand}>
      <SelectTrigger className={collapsed ? "w-12" : "w-full"}>
        <SelectValue placeholder="Select a brand" />
      </SelectTrigger>
      <SelectContent>
        {brands.map((brand) => (
          <SelectItem key={brand.id} value={brand.id}>
            {brand.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
