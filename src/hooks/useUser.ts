import { IUser } from "@/models/User";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await axios.get("/api/auth");
      setUser(data.user);
    };

    getUser();
  }, []);

  return user;
}
