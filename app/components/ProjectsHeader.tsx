import { LiveReload } from "@remix-run/react";

export default function ProjectsHeader() {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h2 className="font-bold">Projects</h2>
        <label htmlFor="createProjectModal" className="hover:cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m6-6H6"
            />
          </svg>
        </label>
      </div>
      <LiveReload />
      <input type="checkbox" id="createProjectModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="createProjectModal"
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold w-full text-center">Create Project</h3>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="input-bordered input w-full max-w-xs"
            />
          </div>

          <div className="form-control w-full max-w-xs mb-6">
            <label className="label">
              <span className="label-text">Color</span>
            </label>
            <select className="select-bordered select">
              <option disabled selected>
                Pick one
              </option>
              <option className="text-red-400">Red</option>
              <option>Blue</option>
              <option>Green</option>
            </select>
          </div>

          <button className="btn w-full text-white hover:bg-green-400">Create</button>

        </div>
      </div>
    </>
  );
}
