"use client";

import {
    Dialog,
    DialogPopup,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as brandsApi from "@/lib/api/brands";
import type { Brand } from "@/lib/api/brands/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface BrandRenameDialogProps {
    brand: Brand | null;
    onClose: () => void;
}

export function BrandRenameDialog({ brand, onClose }: BrandRenameDialogProps) {
    const queryClient = useQueryClient();
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (brand) setValue(brand.name);
    }, [brand]);

    const handleSubmit = async () => {
        if (!brand || !value.trim()) return;
        setIsLoading(true);
        try {
            await brandsApi.updateBrand(brand.id, { name: value.trim() });
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={!!brand} onOpenChange={(open) => !open && onClose()}>
            <DialogPopup showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Rename brand</DialogTitle>
                </DialogHeader>
                <div className="px-6 pb-2">
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Brand name"
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        autoFocus
                    />
                </div>
                <DialogFooter variant="bare">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!value.trim() || isLoading}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogPopup>
        </Dialog>
    );
}