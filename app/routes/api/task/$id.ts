import { completeTask, deleteTask, duplicateTask, restoreTask } from "~/models/task.server";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "react-router";
import { badRequest } from "~/utils";
import { useLoaderData } from "@remix-run/react";

export function loader({ params }: { params: { id: string } }) {
  const id = params.id;
  return id;
}

export async function action({ request }: ActionArgs) {
  const data = await request.formData();
  const id = data.get("id");
  const restore = data.get("restore");
  const path = request.headers.get("Referer");
  console.log(id, path, restore, request.method)

//TODO: The below type checking seems a bit hacky

  if (typeof id !== "string" || typeof path !== "string") {
    return badRequest({
      message: "Invalid request",
    })
  }

  

  if (request.method === "PATCH") {
    if (restore === 'true') {
      await restoreTask(id);
      return redirect(path);
    }
    await completeTask(id);
    return redirect(path);
  }

  else if (request.method === "DELETE") {
    await deleteTask(id);
    return redirect(path.slice(0, path.indexOf('/task')));
  }

  else if (request.method === "POST") {
    await duplicateTask(id);
    return redirect(path.slice(0, path.indexOf('/task')));
  }
}