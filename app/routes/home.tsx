import ProjectList from "~/components/Projects";
import { useCatch, useLoaderData, Form } from "@remix-run/react";
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
          <div className="alert alert-success w-fit shadow-lg">
            <div>
              <span>🚀 15 tasks completed today!</span>
            </div>
          </div>
        </div>
        <div className="navbar-center">
          <p className="btn-ghost btn text-xl normal-case text-green-500">
            To.Do
          </p>
        </div>
        <div className="navbar-end">
          <button className="btn-ghost btn-circle btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
              <div className="h-8 w-8 rounded-full">
                <img
                  alt="placeholder"
                  src="https://placeimg.com/80/80/people"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <a href="/home" className="justify-between">
                  Profile
                </a>
              </li>
              <li>
                <Form action="/logout" method="post">
                  <button>Logout</button>
                </Form>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ProjectList projects={data.projects} />
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
