import { completeTask } from "~/models/task.server";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect, useLoaderData } from "react-router";

export function loader ({params}: {params: {id: string}}) {
  const id = params.id;
  return id;
}

// TODO: Fix this. It is garbage. You might just need to throw it in the action under the route.
export async function action({ request }: ActionArgs) {
  const data = await request.formData();
  const id = data.get("id");
  const path = data.get("path");
  await completeTask(id as string);
  console.log(request.url)
  return redirect(path as string);
}