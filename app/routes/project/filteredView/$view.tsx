import type { V2_MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import NonProjectNavBar from "~/components/NonProjectNavBar";
import Tasks from "~/components/Tasks";
import { grabCookieValue } from "~/helpers/cookies";
import {
  getAllCompletedTasks,
  getAllTasks,
  getTodayTasks,
} from "~/models/task.server";
import { getUserId } from "~/session.server";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  let viewName = data.viewInfo.name;
  // * This is a hack to get the title to be "All tasks view" instead of "All tasks tasks view"
  if (data.viewInfo.name.includes("Tasks")) {
    viewName = "All";
  }
  return [
    {
      title:
        viewName.charAt(0) + viewName.slice(1).toLowerCase() + " tasks view",
    },
  ];
};

export async function loader({ request, params }: LoaderArgs) {
  const filterView = params.view;
  const userId = await getUserId(request);
  if (!userId) throw redirect("/");

  const cookies = request.headers.get("Cookie");
  if (!cookies) throw new Response("No cookies found", { status: 400 });
  const tzCookieValue = grabCookieValue("tz", cookies);

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
    if (!tzCookieValue) throw redirect(`/home`);
    tasks = await getTodayTasks({ userId }, tzCookieValue);
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
