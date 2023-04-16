import ProjectList from "~/components/Projects";
import { useLoaderData, LiveReload, Outlet } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import HomeNavBar from "~/components/HomeNavBar";
import ViewsMenu from "~/components/Views";
import { getUserId } from "~/session.server";
import { getProjects } from "~/models/project.server";

import type { LoaderArgs } from "@remix-run/node";
import ProjectsHeader from "~/components/ProjectsHeader";
import { tasksCompletedToday } from "~/models/task.server";
import { grabCookieValue } from "~/helpers/cookies";
import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Tasky" },
    {
      name: "description",
      content: "Tasky is a task manager for the modern web.",
    },
  ];
};

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) throw redirect("/");

  // grab the tz cookie from the request
  const cookies = request.headers.get("Cookie");
  if (!cookies) throw new Response("No cookies found", { status: 400 });
  const tzCookieValue = grabCookieValue("tz", cookies);

  if (typeof userId !== "string")
    throw new Response("Invalid userID format", {
      status: 400,
    });

  const projects = await getProjects({ userId });

  let tasksCompletedTodayQty = NaN;
  if (tzCookieValue) {
    tasksCompletedTodayQty = await tasksCompletedToday(
      { userId },
      tzCookieValue
    );
  }

  return json({ projects, tasksCompletedTodayQty, noneId: `none-${userId}` });
}

export default function Home() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <HomeNavBar tasksCompletedToday={data.tasksCompletedTodayQty} />
      <LiveReload />
      <main className="flex flex-col items-center">
        <ViewsMenu />
        <div className="flex w-80 flex-col items-center rounded-md">
          <ProjectsHeader />
          <Outlet />
          <ProjectList projects={data.projects} noneId={data.noneId} />
        </div>
      </main>
    </>
  );
}
