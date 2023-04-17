import { LiveReload, Link } from "@remix-run/react";

export default function ProjectsHeader() {
  return (
    <>
      <div className="flex w-80 flex-row items-center justify-between">
        <h2 className="text-xl font-bold text-white">Projects</h2>
        <Link
          aria-label="Create a new project to store tasks in"
          to={"newProject"}
        >
          <label htmlFor="createProjectModal" className="hover:cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-9 w-9 text-green-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m6-6H6"
              />
            </svg>
          </label>
        </Link>
      </div>
      <LiveReload />
    </>
  );
}
