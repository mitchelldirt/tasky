import EditTask from "~/components/editTask";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { getTaskById } from "~/models/task.server";
import type { LoaderArgs } from "@remix-run/node";


export async function loader({ params, request }: LoaderArgs) {
  if (typeof params.taskId !== "string") {
    throw new Error("Uh Oh");
  }

  const task = await getTaskById({ id: params.taskId });
  return task;
}

export default function EditTaskRoute() {
  const data = useLoaderData<typeof loader>();
return (
  <>
  <EditTask previousRoute="/home" taskContext={data} /> 
  </>
)  
}