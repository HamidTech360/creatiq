import { StateCreator } from "zustand";
import { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface ProfileSliceType {
    profile: Profile | null;
    setProfile: (profile: Profile | null) => void;
    clearProfile: () => void;
}

const profileSlice: StateCreator<ProfileSliceType> = (set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),
    clearProfile: () => set({ profile: null }),
});

export default profileSlice;
