import { Form, Link } from "@remix-run/react";
import { tasksQtyEmoji } from "~/helpers/tasksQtyEmoji";

export default function HomeNavBar({
  tasksCompletedToday,
}: {
  tasksCompletedToday: number;
}) {
  const emoji = tasksQtyEmoji(tasksCompletedToday);

  return (
    <div className="navbar">
      <div className="navbar-start">
        <section
          id="completedTasksCount"
          className="alert alert-success fixed bottom-0 left-0 w-full rounded-none bg-green-400 shadow-lg sm:static sm:alert sm:w-fit sm:alert-success"
        >
          <div>
            <span data-cy="tasksCompletedToday" className="text-base">
              {emoji} {tasksCompletedToday} tasks completed today!
            </span>
          </div>
        </section>
      </div>
      <div className="navbar-center">
        <p className="btn-ghost btn text-xl normal-case text-green-400 hover:bg-transparent">
          Tasky
        </p>
      </div>
      <div className="navbar-end">
        <Link to={"/search"}>
          <button
            data-cy="homeNavBarSearchButton"
            aria-label="search"
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
          data-cy="homeNavBarNewTaskButton"
          aria-label="Create a new task"
          to={"newTask"}
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
        </Link>
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
            <div
              data-cy="profileDropdownButton"
              className="h-8 w-8 rounded-full text-white"
            >
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
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
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
                data-cy="profileMenuButton"
                aria-label="Profile page with stats"
                to={"/profile"}
                className="justify-between text-white"
              >
                Profile
              </Link>
            </li>
            <li>
              <Form className="p-0" action="/logout" method="post">
                <button
                  data-cy="profileLogoutButton"
                  aria-label="Logout of your account"
                  className="w-full py-2 px-4 text-left text-white"
                >
                  Logout
                </button>
              </Form>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
