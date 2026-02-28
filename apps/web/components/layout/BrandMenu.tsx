import { Brand } from "@/lib/api/brands/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/menu";
import { Edit3, MoreVertical, Pin, Trash2 } from "lucide-react";

interface BrandMenuProps {
    brand: Brand;
    setBrandToRename: (brand: Brand) => void;
    handlePinToggle: (brand: Brand) => void;
    setBrandToDelete: (brand: Brand) => void;
}

export default function BrandMenu({
    brand,
    setBrandToRename,
    handlePinToggle,
    setBrandToDelete,

}: BrandMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 rounded-md opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 data-popup-open:opacity-100 text-muted-foreground hover:text-foreground hover:bg-surface inline-flex items-center justify-center"
                aria-label="Brand options"
            >
                <MoreVertical className="size-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={4}
                className="min-w-40"
            >
                <DropdownMenuItem onSelect={() => setBrandToRename(brand)}>
                    <Edit3 className="size-3" />
                    Rename
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handlePinToggle(brand)}>
                    <Pin className="size-3" />
                    {brand.pinned ? "Unpin brand" : "Pin brand"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setBrandToDelete(brand)}
                >
                    <Trash2 className="size-3" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}