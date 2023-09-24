import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/models/User";
import axios from "axios";

export default function useUser(uid?: string) {
  const queryClient = useQueryClient();
  const queryKey: string[] = uid ? ["users", uid!] : ["users", "me"];
  const endpoint: string = uid ? `/api/users/${uid}` : `/api/auth`;

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery<IUser>({
    queryKey,
    queryFn: async () => {
      const { data } = await axios.get(endpoint);
      return data.user;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 60 * 1, // 1 hour
  });

  const {
    data: profilePicture,
    isLoading: profilePictureLoading,
    error: profilePictureError,
  } = useQuery({
    queryKey: ["users", uid, "profilePicture"],
    queryFn: async () => {
      const endpoint: string = uid
        ? `/api/users/${uid}/profile-picture`
        : "/api/settings/profile-picture";
      const { data } = await axios.get(endpoint);
      return data.profilePicture;
    },
  });

  const {
    data: biography,
    isLoading: biographyLoading,
    error: biographyError,
  } = useQuery({
    queryKey: ["users", uid, "biography"],
    queryFn: async () => {
      const endpoint: string = uid
        ? `/api/users/${uid}/biography`
        : "/api/settings/biography";
      const { data } = await axios.get(endpoint);
      return data.biography;
    },
  });

  const updateProfilePictureMutation = useMutation({
    mutationKey: ["users", uid, "profilePicture"],
    mutationFn: async (formData: FormData) => {
      const { data } = await axios.put(
        "/api/settings/profile-picture",
        formData
      );
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const updateBiographyMutation = useMutation({
    mutationKey: ["users", uid, "biography"],
    mutationFn: async (biography: string) => {
      const { data } = await axios.put("/api/settings/biography", {
        biography,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return {
    user,
    userLoading,
    userError,
    biography,
    biographyLoading,
    biographyError,
    profilePicture,
    profilePictureLoading,
    profilePictureError,
    updateProfilePictureMutation,
    updateBiographyMutation,
  };
}
