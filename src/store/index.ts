import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import profileSlice, { ProfileSliceType } from "./user";

export const useStore = create<ProfileSliceType>()(
    persist(
        (...a) => ({
            ...profileSlice(...a),
        }),
        {
            name: "createiq-storage",
            storage: createJSONStorage(() => localStorage),
        }
    ),
);
