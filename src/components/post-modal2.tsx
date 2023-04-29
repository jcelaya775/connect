import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Insta from "../images/insta_color_logo.png";
import Facebook from "../images/fb_color_logo.png";
import Connect from "../images/connect_logo.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { platformTypes } from "@/types/platform";
import { GenericPost } from "@/types/post";

type PostModalProps = {
  newPost?: boolean;
  setVisible: (visible: boolean) => void;
};

const PostModal = ({ newPost = true, setVisible }: PostModalProps) => {
  const queryClient = useQueryClient();

  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [description, setDescription] = useState("");
  const [fileUpload, setFileUpload] = useState<File | undefined>(undefined);

  const [instagramChecked, setInstagramChecked] = useState(false);
  const [facebookChecked, setFacebookChecked] = useState(false);
  const [connectChecked, setConnectChecked] = useState(true);

  const [instagramAudience, setInstagramAudience] = useState(true);
  const [facebookAudience, setFacebookAudience] = useState(true);
  const [connectAudience, setConnectAudience] = useState<string>("public");

  const toggleInstagram = () => setInstagramChecked(!instagramChecked);
  const toggleFacebook = () => setFacebookChecked(!facebookChecked);
  const toggleConnect = () => setConnectChecked(!connectChecked);

  function resetPost() {
    setDescription("");
    setFileUpload(undefined);
    setInstagramChecked(false);
    setFacebookChecked(false);
    setConnectChecked(true);
    setInstagramAudience(true);
    setFacebookAudience(true);
    setConnectAudience("public");
  }


  
  const postToConnect = async (postData: any) => {
    if (fileUpload) {
      const formData = new FormData();
      formData.append('file', fileUpload);
      const { data: { signedUrl, filename }} = await axios.post("/api/platforms/connect/image", formData);
      if (!signedUrl) {
        throw new Error("Error uploading file");
      }
      postData.connect.content.image = {
        signedUrl,
        filename,
      }
    }
    
    const { data } = await axios.post("/api/platforms/connect/posts", postData.connect);
    if (!data) {
      throw new Error("Error posting to Connect");
    }
    
    return data;
  };
  
  
  
    const postToFacebook = async (postData: any) => {
      let data;
      
      if (fileUpload) {
        const formData = new FormData();
        formData.append('file', fileUpload);
        formData.append('caption', description);
        let res = await axios.post("/api/platforms/facebook/posts", formData)
        data = res.data
      } else {
        postData.facebook.message = description;
        const res = await axios.post("/api/platforms/facebook/posts", {
          message: description
        })
        data = res.data;
      }
    
      return data;
    };
    
  
  const createPostMutation = useMutation(
    async (postData: any) => {
      const results = [];

      if (postData.connect.platforms.includes(platformTypes.facebook)) {
        const facebookResult = await postToFacebook(postData.facebook);
        postData.connect.facebook_id = facebookResult.postId;
        results.push(facebookResult);
      }

      // TODO: If posted to other platforms, store post ID in Connect post
      if (postData.connect.platforms.includes(platformTypes.connect)) {
        const connectResult = await postToConnect(postData.connect);
        results.push(connectResult);
      }

      return results;
    },
    {
      onSuccess: (post: any) => {
        queryClient.invalidateQueries(["posts"]);
        resetPost();
        setVisible(false);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    let platforms: platformTypes[] = [];
    connectChecked && platforms.push(platformTypes.connect);
    facebookChecked && platforms.push(platformTypes.facebook);
    instagramChecked && platforms.push(platformTypes.instagram);
  
    const postData: any = {
      connect: {
        platforms,
        content: {
          body: description,
        },
      },
    }

    const file = inputRef.current?.files?.[0];
      if(file) {
        const { signedUrl, filename }: {signedUrl: string, filename: string} = await postToConnect({ file });
        postData.connect.content.image = {
          signedUrl,
          filename,
        };
      
        createPostMutation.mutate(postData);
      }
    // } else {
    //   facebookChecked && platforms.push(platformTypes.facebook);
    //   instagramChecked && platforms.push(platformTypes.instagram);
    //   const postData = {
    //     connect: {
    //       platforms,
    //       content: {
    //         body: description,
    //       },
    //     },
    //     facebook: {
    //       message: description,
    //     },
    //   };
    //   createPostMutation.mutate(postData);
    // }
  };
  
  
  return (
    <>
      <input type="checkbox" id="create-post" className="modal-toggle" />

      <div className="modal">
        <div className="modal-box rounded-lg">
          <form onSubmit={handleSubmit}>
            <h3 className="py-0 my-0 font-bold text-lg">
              {newPost ? "Create" : "Edit"} Post
            </h3>
            <div className="divider pb-3 my-0"></div>
            <div className="form-control">
              <textarea
                className="textarea textarea-borderd border rounded-lg border-current h-24 w-full resize-none"
                placeholder="Enter your post text..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center justify-center w-full pt-5">
              <label className="flex flex-col rounded-lg border-4 border-dashed border-current w-full h-30 p-10 group text-center">
                <div className="h-full w-full text-center flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="pointer-hand text-gray-500 ">
                    <span className="text-sm">Upload</span> files here
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={inputRef}
                  onChange={(e) =>
                    setFileUpload(inputRef.current?.files?.[0])
                }
                />
              </label>
            </div>
            <p className="text-gray-500 text-sm py-2">File: {fileUpload?.name}</p>

            {newPost && (
              <>
                <div className="divider pb-3 my-0"></div>
                <div className="flex flex-row">
                  <div className="flex-1">
                    <Image
                      src={Facebook}
                      alt="Facebook"
                      className="w-7 h-7 inline-block align-middle m-1"
                    />
                    <input
                      type="checkbox"
                      onClick={toggleFacebook}
                      checked={facebookChecked}
                      className="toggle toggle-md toggle-primary rounded-full inline-block align-middle ml-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Image
                      src={Insta}
                      alt="Insta"
                      className="w-7 h-7 inline-block align-middle m-1"
                    />
                    <input
                      type="checkbox"
                      onClick={toggleInstagram}
                      checked={instagramChecked}
                      className="toggle toggle-md toggle-primary rounded-full inline-block align-middle ml-1"
                    />
                  </div>
                  <div className="flex-1">
                    <svg
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current w-7 h-7 inline ml-1"
                    >
                      <path d="M9.26 13a2 2 0 0 1 .01-2.01A3 3 0 0 0 9 5H5a3 3 0 0 0 0 6h.08a6.06 6.06 0 0 0 0 2H5A5 5 0 0 1 5 3h4a5 5 0 0 1 .26 10zm1.48-6a2 2 0 0 1-.01 2.01A3 3 0 0 0 11 15h4a3 3 0 0 0 0-6h-.08a6.06 6.06 0 0 0 0-2H15a5 5 0 0 1 0 10h-4a5 5 0 0 1-.26-10z"></path>
                    </svg>
                    <input
                      type="checkbox"
                      onClick={toggleConnect}
                      checked={connectChecked}
                      className="toggle toggle-md toggle-primary rounded-full inline-block align-middle ml-2"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="modal-action">
              <label
                htmlFor="create-post"
                className="btn btn-sm btn-ghost gap-2 py-0 px-5 normal-case"
                onClick={() => resetPost()}
              >
                Cancel
              </label>
              <button
                type="submit"
                className="btn btn-sm btn-primary gap-2 py-0 px-5 normal-case"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostModal;
