import ProjectList from "~/components/Projects";
import { useCatch, useLoaderData, LiveReload, Outlet } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import HomeNavBar from "~/components/HomeNavBar";
import ViewsMenu from "~/components/Views";
import { getUserId } from "~/session.server";
import { getProjects } from "~/models/project.server";

import type { LoaderArgs } from "@remix-run/node";
import ProjectsHeader from "~/components/ProjectsHeader";
import { tasksCompletedToday } from "~/models/task.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) throw redirect("/");

  if (typeof userId !== "string")
    throw new Response("Invalid userID format", {
      status: 400,
    });

  const projects = await getProjects({ userId });
  const tasksCompletedTodayQty = await tasksCompletedToday({ userId });

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
        <div className="w-fit rounded-md">
          <ProjectsHeader />
          <Outlet />
          <ProjectList projects={data.projects} noneId={data.noneId} />
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
