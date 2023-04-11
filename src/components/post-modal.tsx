import * as React from "react";
import Image from 'next/image'
import Insta from '../images/insta_logo.svg'
import Facebook from '../images/facebook_logo.svg'
import Connect from '../images/connect_logo.svg'

const PostModal = () => {
  const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [description, setDescription] = React.useState('')
  const [upload, setUpload] = React.useState('no file uploaded');

  const [instagramChecked, setInstagramChecked] = React.useState(false);
  const [facebookChecked, setFacebookChecked] = React.useState(false);
  const [connectChecked, setConnectChecked] = React.useState(true);

  const [instagramAudience, setInstagramAudience] = React.useState('');
  const [facebookAudience, setFacebookAudience] = React.useState('');
  const [connectAudience, setConnectAudience] = React.useState('');

  const toggleInstagram = () => setInstagramChecked(!instagramChecked)
  const toggleFacebook = () => setFacebookChecked(!facebookChecked)
  const toggleConnect = () => setConnectChecked(!connectChecked)

  function resetPost() {
    setDescription('');
    setUpload('no file uploaded');
    setInstagramChecked(false);
    setFacebookChecked(false);
    setConnectChecked(true);
    setInstagramAudience('');
    setFacebookAudience('');
    setConnectAudience('');
  };

  return (
    <>
      <input type="checkbox" id="create-post" className="modal-toggle" />
      
      <div className="modal ">
        <div className="modal-box rounded-lg">
          <h3 className="py-0 my-0 font-bold text-lg">Create Post</h3>
          <div className="divider pb-3 my-0"></div>
          <div className="form-control">
            <textarea
              className="textarea textarea-borderd border rounded-lg border-gray-400 h-24 w-full resize-none"
              placeholder="Enter your description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}>
            </textarea>
          </div>
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
                <p className="pointer-hand text-gray-500 "><span className="text-sm">Upload</span> files here</p>
              </div>
              <input type="file" className="hidden" ref={inputRef} onChange={(e) =>  e.target.value == "" ? ' ' :setUpload(inputRef.current.files[0].name)} />
            </label>
          </div>
          <p className="test-gray-500 text-sm py-2">File: {upload}</p>
          
          <div className="divider pb-3 my-0"></div>
          <div>
            <input type="checkbox" onClick={toggleFacebook} checked={facebookChecked} className="toggle toggle-sm toggle-primary rounded-full inline-block align-middle" />
            <Image src={Facebook} alt="Facebook" className="w-7 h-7 inline-block align-middle m-1"></Image>
            Facebook
            <select value={facebookAudience} onChange={(e) => setFacebookAudience(e.target.value)} className="select select-xs border-gray-400 w-1/2 max-w-xs rounded-full ml-2 sm:ml-5">
              <option disabled value=''>-- Choose Audience --</option>
              <option value='public'>Public</option>
              <option value='friends'>Friends Only</option>
              <option value='private'>Private</option>
            </select>
          </div>
          <div>
            <input type="checkbox" onClick={toggleInstagram} checked={instagramChecked} className="toggle toggle-sm toggle-primary rounded-full inline-block align-middle" />
            <Image src={Insta} alt="Insta" className="w-7 h-7 inline-block align-middle m-1"></Image>
            Instagram
            <select value={instagramAudience} onChange={(e) => setInstagramAudience(e.target.value)} className="select select-xs border-gray-400 w-1/2 max-w-xs rounded-full ml-1 sm:ml-5">
              <option disabled value=''>-- Choose Audience --</option>
              <option value='public'>Public</option>
              <option value='friends'>Friends Only</option>
              <option value='private'>Private</option>
            </select>
          </div>
          <div className="pt-1">
            <input type="checkbox" onClick={toggleConnect} checked={connectChecked} className="toggle toggle-sm toggle-primary rounded-full inline-block align-middle" />
            <Image src={Connect} alt="Connect" className="w-5 h-5 inline-block align-middle ml-2 mr-2"></Image>
            Connect
            <select value={connectAudience} onChange={(e) => setConnectAudience(e.target.value)} className="select select-xs border-gray-400 w-1/2 max-w-xs rounded-full ml-4 sm:ml-7">
              <option disabled value=''>-- Choose Audience --</option>
              <option value='public'>Public</option>
              <option value='friends'>Friends Only</option>
              <option value='private'>Private</option>
            </select>
          </div>

          <div className="modal-action">
            <label htmlFor="create-post" className="btn btn-sm btn-ghost bg-gray-200 gap-2 py-0 px-5 normal-case" onClick={() => resetPost()}>Cancel</label>
            <label htmlFor="create-post" className="btn btn-sm btn-primary gap-2 py-0 px-5 normal-case">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Post
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostModal;