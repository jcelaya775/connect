import { IConnectPost } from "@/models/Post";
import { platformTypes } from "@/types/platform";
import { GenericPost, IFacebookPost, IInstagramPost } from "@/types/post";
import { ObjectId } from "mongodb";

export const getPostId = (post: GenericPost): ObjectId | string => {
  switch (post.main_platform) {
    case platformTypes.connect:
      return (post as IConnectPost)._id;
    case platformTypes.facebook:
      return (post as IFacebookPost).id;
    case platformTypes.instagram:
      return (post as IInstagramPost).id;
    default:
      return "";
  }
};
