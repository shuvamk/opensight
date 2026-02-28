"use client";

import {
    Dialog,
    DialogPopup,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as brandsApi from "@/lib/api/brands";
import type { Brand } from "@/lib/api/brands/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface BrandDeleteDialogProps {
    brand: Brand | null;
    onClose: () => void;
    onDeleted?: (id: string) => void;
}

export function BrandDeleteDialog({ brand, onClose, onDeleted }: BrandDeleteDialogProps) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        if (!brand) return;
        setIsLoading(true);
        try {
            await brandsApi.deleteBrand(brand.id);
            onDeleted?.(brand.id);
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
                    <DialogTitle>Delete brand</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete &quot;{brand?.name}&quot;? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter variant="bare">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogPopup>
        </Dialog>
    );
}