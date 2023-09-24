import useUser from "@/hooks/useUser";
import { useState, useEffect, useRef, MutableRefObject } from "react";

type EditProfileModalProps = {
  setVisible: (visible: boolean) => void;
};

const EditProfileModal = ({ setVisible }: EditProfileModalProps) => {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const { biography, updateBiographyMutation, updateProfilePictureMutation } =
    useUser();
  const [bio, setBio] = useState(biography);
  const [pfp, setPFP] = useState("no file uploaded");
  const [cover, setCover] = useState("no file uploaded");

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if ((e.target as Element)?.classList.contains("modal")) {
        setVisible(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  });

  function resetProfile() {
    setBio("");
    setPFP("no file uploaded");
    setCover("no file uploaded");
  }

  const handleSubmit = () => {
    if (inputRef.current?.files?.[0]) {
      const formData = new FormData();
      formData.append("file", inputRef.current.files[0]);
      updateProfilePictureMutation.mutate(formData);
    }

    if (bio) updateBiographyMutation.mutate(bio);

    resetProfile();
    setVisible(false);
  };

  return (
    <>
      <input type="checkbox" id="edit-profile-modal" className="modal-toggle" />

      <div className="modal ">
        <div className="modal-box rounded-lg">
          <form onSubmit={handleSubmit}>
            <h3 className="py-0 my-0 font-bold text-xl">Edit Profile</h3>
            <div className="divider pb-3 my-0"></div>
            <div className="form-control">
              <h3 className="font-bold mb-5">Biography</h3>
              <textarea
                className="textarea textarea-borderd border rounded-lg border-gray-400 h-24 w-full resize-none"
                placeholder="Enter your bio..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>
            <h3 className="mt-5 font-bold">Profile Picture</h3>
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
                    <span className="text-sm">Upload</span> profile picture here
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={inputRef}
                  onChange={() =>
                    setPFP(
                      inputRef.current?.files?.[0]?.name ?? "no file uploaded"
                    )
                  }
                />
              </label>
            </div>
            <p className="text-gray-500 text-sm py-2">File: {pfp}</p>
            {/* <h3 className="mt-5 -mb-5 font-bold">Cover Photo</h3>
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
                  <span className="text-sm">Upload</span> cover photo here
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                ref={inputRef}
                // onChange={(e) =>
                //   e.target.value == ""
                //     ? " "
                //     : setCover(inputRef.current.files[0].name)
                // }
              />
            </label>
          </div> */}

            <div className="divider pb-3 my-0"></div>

            <div className="modal-action">
              <label
                htmlFor="edit-profile-modal"
                className="btn btn-sm btn-ghost bg-base-100 gap-2 py-0 px-5 normal-case"
                onClick={() => resetProfile()}
              >
                Reset
              </label>
              <button
                type="submit"
                className="btn btn-sm btn-primary gap-2 py-0 px-5 normal-case"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
