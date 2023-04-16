import "tailwindcss/tailwind.css";
import PostModal from "./post-modal";

const OptionsDropdown = () => {
  return(
    <>
    <div className="dropdown dropdown-hover">
      <label tabIndex={0} className="cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fill-rule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" />
      </svg>

      </label>
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li><a>Edit</a></li>
          <li><a>Delete</a></li>
        </ul>
    </div>
    </>
  );
}

export default OptionsDropdown;