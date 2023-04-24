import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/models/User";
import axios from "axios";

export default function useUser() {
  const {
    isLoading,
    error,
    data: user,
  } = useQuery<IUser>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axios.get("/api/auth");
      return data.user;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 60 * 1, // 1 hour
  });

  return user;
}
