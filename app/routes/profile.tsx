import { Link, useLoaderData, Outlet } from "@remix-run/react";
import { getUserById } from "~/models/user.server";
import { getUserId } from "~/session.server";

import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import {
  getTasksCompletedAllTime,
  getTasksCompletedPerProject,
} from "~/models/task.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Profile" }];
};

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);

  if (typeof userId !== "string") {
    throw new Response();
  }
  const user = await getUserById(userId);
  const totalCompletedTasks = await getTasksCompletedAllTime({
    userId: userId,
  });
  const completedTasksPerProject = await getTasksCompletedPerProject({
    userId: userId,
  });

  return {
    user: user,
    totalTasks: totalCompletedTasks,
    projectTasks: completedTasksPerProject,
  };
}

export default function Profile() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
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

      <main className="mb-6 mt-20 flex h-full w-full flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-green-400">Profile</h1>

        <h2 className="text-2xl text-white">Lifetime Stats</h2>
        <p data-cy="totalCompletedTasks" className="text-lg text-white">
          Total Completed Tasks: {data.totalTasks ? data.totalTasks : 0}
        </p>
        {Array.isArray(data.projectTasks) && data.projectTasks.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="text-white" colSpan={2}>
                  Total Completed Tasks Per Project
                </th>
              </tr>
            </thead>
            <tbody>
              {data.projectTasks.map((project) => (
                <tr className="w-full" key={project.id}>
                  <td
                    className="border-2 border-gray-400 text-left text-white"
                    width="50%"
                  >
                    {project.name}
                  </td>
                  <td
                    className="border-2 border-gray-400 text-center text-white"
                    width="50%"
                  >
                    {project.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        <p className="text-white">Email: {data?.user?.email}</p>
        <Link aria-label="Change your email address" to={"changeEmail"}>
          <button className="btn gap-2 text-blue-500">
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
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            Change Email
          </button>
        </Link>

        <Link aria-label="Change your password" to={"changePassword"}>
          <button className="btn gap-2 text-yellow-500">
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
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            Change Password
          </button>
        </Link>

        <Link aria-label="Delete your account/profile" to={"deleteProfile"}>
          <button className="btn mb-6 gap-2 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
              height="24"
              width="24"
            >
              <path d="M6 22v-4.25q-.975-.425-1.712-1.137Q3.55 15.9 3.038 15q-.513-.9-.775-1.925Q2 12.05 2 11q0-3.95 2.8-6.475Q7.6 2 12 2t7.2 2.525Q22 7.05 22 11q0 1.05-.262 2.075-.263 1.025-.775 1.925-.513.9-1.25 1.613-.738.712-1.713 1.137V22Zm2-2h1v-2h2v2h2v-2h2v2h1v-3.55q.95-.225 1.688-.75.737-.525 1.25-1.25.512-.725.787-1.6Q20 11.975 20 11q0-3.125-2.212-5.062Q15.575 4 12 4T6.213 5.938Q4 7.875 4 11q0 .975.275 1.85.275.875.787 1.6.513.725 1.263 1.25.75.525 1.675.75Zm2.5-5h3L12 12Zm-2-2q.825 0 1.413-.588.587-.587.587-1.412t-.587-1.413Q9.325 9 8.5 9q-.825 0-1.412.587Q6.5 10.175 6.5 11q0 .825.588 1.412Q7.675 13 8.5 13Zm7 0q.825 0 1.413-.588.587-.587.587-1.412t-.587-1.413Q16.325 9 15.5 9q-.825 0-1.412.587-.588.588-.588 1.413 0 .825.588 1.412.587.588 1.412.588ZM12 20Z" />
            </svg>
            DELETE ACCOUNT
          </button>
        </Link>

        <Outlet />
      </main>
    </>
  );
}
