import { IConnectPost } from "@/models/Post";
import { platformTypes } from "./platform";

export interface IFacebookPost {
  id: string;
  created_time: string;
  message: string;
  full_picture: string;
  admin_creator: {
    name: string;
    id: string;
  };
  subscribed: boolean;
  updated_time: string;
  main_platform: platformTypes;
  author: string;
}

// TODO: Update
export interface IInstagramPost {
  id: string;
  timestamp: string;
  caption: string;
  media_url: string;
  permalink: string;
  username: string;
  main_platform: platformTypes;
  author: string;
}

export type GenericPost = IConnectPost | IFacebookPost | IInstagramPost;
