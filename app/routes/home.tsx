import ProjectList from "~/components/Projects";
import { useCatch, useLoaderData, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import { getUserId } from "~/session.server";
import { getProjects } from "~/models/project.server";

import type { LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) throw redirect("/");

  if (typeof userId !== "string")
    throw new Response("Invalid userID format", {
      status: 400,
    });

  const projects = await getProjects({ userId });

  return json({ projects });
}

export default function Home() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <div className="navbar">
        <div className="navbar-start">
          <div className="alert alert-success bg-green-400 absolute bottom-0 left-0 w-full rounded-none shadow-lg sm:static sm:alert sm:w-fit sm:alert-success">
            <div>
              <span className="text-base">🚀 15 tasks completed today!</span>
            </div>
          </div>
        </div>
        <div className="navbar-center">
          <p className="btn-ghost btn hover:bg-transparent text-xl normal-case text-green-400">
            To.Do
          </p>
        </div>
        <div className="navbar-end">
          <button className="btn-ghost btn-circle btn">
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
          <button className="btn-ghost btn-circle btn">
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
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
              <div className="h-8 w-8 rounded-full">
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
                <Link to={'/profile'} className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Form className="p-0" action="/logout" method="post">
                  <button className="text-left w-full py-2 px-4">Logout</button>
                </Form>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <main className="flex flex-col items-center">
        <div className="mb-6 flex flex-col">
          <button className="btn-wide btn justify-start rounded-b-none border-0 border-b-2 border-slate-400 text-white hover:border-slate-200">
            🗂 &nbsp; All Tasks
          </button>
          <button className="btn-wide btn justify-start rounded-none border-0 border-b-2 border-slate-400 text-white hover:border-slate-200">
            📆 &nbsp; Today's Tasks
          </button>
          <button className="btn-wide btn justify-start rounded-t-none border-0 text-white hover:border-b-2 hover:border-slate-200">
            ✅ &nbsp; Completed Tasks
          </button>
        </div>
        <div className="w-fit rounded-md">
          <ProjectList projects={data.projects} />
        </div>
      </main>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 400) {
    return (
      <div>
        <p>Please log out and log back in. Your userID was invalid.</p>
      </div>
    );
  }
}
