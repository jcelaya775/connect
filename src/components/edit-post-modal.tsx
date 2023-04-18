import { useState, useRef } from "react";
import Image from "next/image";
import Insta from "../images/insta_logo.svg";
import Facebook from "../images/facebook_logo.svg";
import Connect from "../images/connect_logo.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const EditPostModal = () => {
  const queryClient = useQueryClient();

  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [description, setDescription] = useState("");
  const [upload, setUpload] = useState("no file uploaded");

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
    setUpload("no file uploaded");
    setInstagramChecked(false);
    setFacebookChecked(false);
    setConnectChecked(true);
    setInstagramAudience(true);
    setFacebookAudience(true);
    setConnectAudience("public");
  }

  const createPostMutation = useMutation(
    async (postData: any) => {
      const res = await axios.post("/api/posts", postData);

      if (res.data.success === false) {
        throw new Error("Error creating post");
      }

      console.log(res.data);
      return res.data;
    },
    {
      onSuccess: () => {
        // Clear the input fields
        queryClient.invalidateQueries(["connectPosts"]);
        resetPost();
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Define postData object based on your form inputs
    const postData = {
      visibility: connectAudience,
      // TODO: Add community
      // community: description ?? "Default Community",
      content: {
        body: description,
      },
    };

    // Call the createPostMutation hook
    createPostMutation.mutate(postData);
    
  };

  return (
    <>
      <input type="checkbox" id="edit-post-modal" className="modal-toggle" />

      <div className="modal">
        <div className="modal-box rounded-lg">
          <form onSubmit={handleSubmit}>
            <h3 className="py-0 my-0 font-bold text-lg">Edit Post</h3>
            <div className="divider pb-3 my-0"></div>
            <div className="form-control">
              <textarea
                className="textarea textarea-borderd border rounded-lg border-gray-400 h-24 w-full resize-none"
                placeholder="Enter your description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center justify-center w-full pt-5">
              <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-30 p-10 group text-center">
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
                  // onChange={(e) =>
                  //   e.target.value === ""
                  //     ? " "
                  //     : setUpload(inputRef.current.files[0].name)
                  // }
                />
              </label>
            </div>
            <p className="text-gray-500 text-sm py-2">File: {upload}</p>

            <div className="divider pb-3 my-0"></div>
            <div>
              <input
                type="checkbox"
                onClick={toggleFacebook}
                checked={facebookChecked}
                className="toggle toggle-sm toggle-primary rounded-full inline-block align-middle"
              />
              <Image
                src={Facebook}
                alt="Facebook"
                className="w-7 h-7 inline-block align-middle m-1"
              />
              Facebook
              <select
                onClick={() => setFacebookAudience(false)}
                className="select select-xs border-gray-400 w-1/2 max-w-xs rounded-full ml-2 sm:ml-5"
              >
                <option disabled selected={facebookAudience}>
                  -- Choose Audience --
                </option>
                <option>Public</option>
                <option>Friends Only</option>
              </select>
            </div>
            <div>
              <input
                type="checkbox"
                onClick={toggleInstagram}
                checked={instagramChecked}
                className="toggle toggle-sm toggle-primary rounded-full inline-block align-middle"
              />
              <Image
                src={Insta}
                alt="Insta"
                className="w-7 h-7 inline-block align-middle m-1"
              />
              Instagram
              <select
                onClick={() => setInstagramAudience(false)}
                className="select select-xs border-gray-400 w-1/2 max-w-xs rounded-full ml-1 sm:ml-5"
              >
                <option disabled selected={instagramAudience}>
                  -- Choose Audience --
                </option>
                <option>Public</option>
                <option>Friends Only</option>
              </select>
            </div>
            <div className="pt-1">
              <input
                type="checkbox"
                onClick={toggleConnect}
                checked={connectChecked}
                className="toggle toggle-sm toggle-primary rounded-full inline-block align-middle"
              />
              <Image
                src={Connect}
                alt="Connect"
                className="w-5 h-5 inline-block align-middle ml-2 mr-2"
              />
              Connect
              <select
                onClick={() => setConnectAudience(false)}
                className="select select-xs border-gray-400 w-1/2 max-w-xs rounded-full ml-4 sm:ml-7"
              >
                <option disabled selected={connectAudience}>
                  -- Choose Audience --
                </option>
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>

            <div className="modal-action">
              <label
                htmlFor="edit-post-modal"
                className="btn btn-sm btn-ghost bg-gray-200 gap-2 py-0 px-5 normal-case"
                onClick={() => resetPost()}
              >
                Cancel
              </label>
              <button
                type="submit"
                className="btn btn-sm btn-primary gap-2 py-0 px-5 normal-case"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPostModal;
