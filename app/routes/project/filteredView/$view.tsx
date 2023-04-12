import { Outlet, useLoaderData } from "@remix-run/react";
import { LoaderArgs, redirect } from "@remix-run/server-runtime";
import { subHours } from "date-fns";
import { useState } from "react";
import NonProjectNavBar from "~/components/NonProjectNavBar";
import Tasks from "~/components/Tasks";
import {
  getAllCompletedTasks,
  getAllTasks,
  getTodayTasks,
} from "~/models/task.server";
import { getUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const filterView = params.view;
  const userId = await getUserId(request);
  if (!userId) throw redirect("/");

  const url = new URL(request.url);
  const tz = url.searchParams.get("tz");

  let tasks = null;
  let viewInfo = {
    name: "",
    color: "",
  };

  if (filterView === "all") {
    tasks = await getAllTasks({ userId });
    viewInfo.name = "All Tasks";
    viewInfo.color = "purple";
  } else if (filterView === "today") {
    if (!tz)
      throw redirect(
        `/home?tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`
      );
    tasks = await getTodayTasks({ userId }, tz);
    viewInfo.name = "Today";
    viewInfo.color = "yellow";
  } else if (filterView === "completed") {
    tasks = await getAllCompletedTasks({ userId });
    viewInfo.name = "Completed";
    viewInfo.color = "green";
  }

  return { tasks, viewInfo, filterView };
}

export default function AllTasks() {
  const data = useLoaderData<typeof loader>();

  if (!data || typeof data !== "object") {
    return null;
  }

  const tasks = data.tasks;
  const viewInfo = data.viewInfo;
  const nameOfView = data.filterView;

  return (
    <>
      <NonProjectNavBar name={viewInfo.name} color={viewInfo.color} />
      <Outlet context={nameOfView} />

      {tasks ? <Tasks tasks={data.tasks || []} displayProject={true} /> : null}
    </>
  );
}
