import create from "zustand";

type LikeStore = {
  likes: Record<string, number>;
  incrementLike: (postId: string) => void;
};

const useLikeStore = create<LikeStore>((set) => ({
  likes: {},
  incrementLike: (postId: string) =>
    set((state) => ({
      likes: {
        ...state.likes,
        [postId]: (state.likes[postId] || 0) + 1,
      },
    })),
}));