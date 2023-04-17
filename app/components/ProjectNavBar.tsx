import { Link } from "@remix-run/react";

import type { Project } from "@prisma/client";
import { calculateTextSize } from "~/helpers/calculateTextSize";

export default function ProjectNavBar({
  name = "Project",
  id = "null",
  color = "red",
}: Pick<Project, "color" | "name" | "id">) {
  const titleTextSize = calculateTextSize(name);

  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link
          aria-label="Navigate back to the home page"
          className="absolute top-4 left-4 text-green-400"
          to={`/home`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>

        <h1
          className={`${titleTextSize} ml-12 w-40 break-words font-bold sm:w-max text-${color}-400`}
        >
          {name}
        </h1>
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end">
        <Link
          id="projectNavSearchButton"
          aria-label="Search for a task"
          to={`/search`}
        >
          <button
            aria-labelledby="projectNavSearchButton"
            className="btn-ghost btn-circle btn text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </Link>
        <Link
          id="projectNavNewTaskButton"
          aria-label="Create a new task"
          to={`/project/${id}/newTask`}
        >
          <button
            aria-labelledby="projectNavNewTaskButton"
            className="btn-ghost btn-circle btn"
          >
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </Link>
        <button
          aria-label="Open a menu to edit or delete the project"
          className="dropdown-end dropdown"
        >
          <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
            <div className="h-6 w-6 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <Link
                aria-label="Edit the project"
                to={`/project/${id}/editProject`}
                className="justify-between"
              >
                Edit Project
              </Link>
            </li>
            <li>
              <Link
                aria-label="Delete the project"
                to={`/project/${id}/deleteProject`}
                className="justify-between"
              >
                Delete Project
              </Link>
            </li>
          </ul>
        </button>
      </div>
    </div>
  );
}
