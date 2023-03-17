import { completeTask, restoreTask } from "~/models/task.server";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "react-router";

export function loader ({params}: {params: {id: string}}) {
  const id = params.id;
  return id;
}

export async function action({ request }: ActionArgs) {
  const data = await request.formData();
  const id = data.get("id");
  const restore = data.get("restore");
  const path = request.headers.get("Referer");
  
  if (restore === 'true') {
    await restoreTask(id as string);
    return redirect(path as string);
  }

  await completeTask(id as string);  
  return redirect(path as string);
}