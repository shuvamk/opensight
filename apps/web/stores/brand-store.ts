import { create } from "zustand";

interface BrandStore {
  activeBrandId: string | null;
  setActiveBrand: (id: string) => void;
}

export const useBrandStore = create<BrandStore>((set) => ({
  activeBrandId: null,
  setActiveBrand: (id: string) => set({ activeBrandId: id }),
}));
