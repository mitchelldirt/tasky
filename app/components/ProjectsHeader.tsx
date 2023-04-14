import { LiveReload, Link } from "@remix-run/react";

export default function ProjectsHeader() {
  return (
    <>
      <div className="flex w-3/4 flex-row items-center justify-between md:w-1/3 lg:w-1/5">
        <h2 className="font-bold text-white">Projects</h2>
        <Link to={"newProject"}>
          <label htmlFor="createProjectModal" className="hover:cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-green-400"
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
