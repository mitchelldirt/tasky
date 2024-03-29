import { Link } from "@remix-run/react";

type NonProjectNavBarProps = {
  name: string;
  color: string;
};

export default function NonProjectNavBar({
  name,
  color,
}: NonProjectNavBarProps) {
  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link
          data-cy="NonProjectNavBarBack"
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

        <h1 className={`ml-14 text-2xl font-bold text-${color}-400`}>{name}</h1>
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end">
        <Link
          id="NonProjectNavBarSearch"
          aria-label="Search for tasks"
          to={`/search`}
        >
          <button
            aria-labelledby="NonProjectNavBarSearch"
            className="btn-ghost btn-circle btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
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
          id="nonProjectNavBarNewTask"
          aria-label="Create a new task"
          to="newTask"
        >
          <button
            aria-labelledby="nonProjectNavBarNewTask"
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
      </div>
    </div>
  );
}
