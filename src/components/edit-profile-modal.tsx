import * as React from "react";

const EditProfileModal = () => {
    const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const [bio, setBio] = React.useState('')
    const [pfp, setPFP] = React.useState('no file uploaded');
    const [cover, setCover] = React.useState('no file uploaded');
  
  
    function resetProfile() {
      setBio('');
      setPFP('no file uploaded');
      setCover('no file uploaded');
    };
  
    return (
      <>
        <input type="checkbox" id="edit-profile-modal" className="modal-toggle" />
        
        <div className="modal ">
          <div className="modal-box rounded-lg">
            <h3 className="py-0 my-0 font-bold text-xl">Edit Profile</h3>
            <div className="divider pb-3 my-0"></div>
            <div className="form-control">

                <h3 className="font-bold">Biography</h3>
              <textarea
                className="textarea textarea-borderd border rounded-lg border-gray-400 h-24 w-full resize-none"
                placeholder="Enter your bio..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}>
              </textarea>
            </div>
            <h3 className="mt-5 -mb-5 font-bold">Profile Picture</h3>
            <div className="flex items-center justify-center w-full pt-5">
              <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-30 p-10 group text-center">
                <div className="h-full w-full text-center flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="pointer-hand text-gray-500 "><span className="text-sm">Upload</span> profile picture here</p>
                </div>
                <input type="file" className="hidden" ref={inputRef} onChange={(e) =>  e.target.value == "" ? ' ' :setPFP(inputRef.current.files[0].name)} />
              </label>
            </div>
            <p className="test-gray-500 text-sm py-2">File: {pfp}</p>

            <h3 className="mt-5 -mb-5 font-bold">Cover Photo</h3>
            <div className="flex items-center justify-center w-full pt-5">
              <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-30 p-10 group text-center">
                <div className="h-full w-full text-center flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="pointer-hand text-gray-500 "><span className="text-sm">Upload</span> cover photo here</p>
                </div>
                <input type="file" className="hidden" ref={inputRef} onChange={(e) =>  e.target.value == "" ? ' ' :setCover(inputRef.current.files[0].name)} />
              </label>
            </div>
            <p className="test-gray-500 text-sm py-2">File: {cover}</p>
            
            <div className="divider pb-3 my-0"></div>

  
            <div className="modal-action">
              <label htmlFor="edit-profile-modal" className="btn btn-sm btn-ghost bg-gray-400 gap-2 py-0 px-5 normal-case" onClick={() => resetProfile()}>Reset</label>
              <label htmlFor="edit-profile-modal" className="btn btn-sm btn-primary gap-2 py-0 px-5 normal-case">
              Save Changes
              </label>
            </div>
          </div>
        </div>
      </>
    );
  }

export default EditProfileModal;