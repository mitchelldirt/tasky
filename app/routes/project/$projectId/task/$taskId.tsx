import EditTask from "~/components/editTask";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { getTaskById } from "~/models/task.server";
import type { LoaderArgs } from "@remix-run/node";
import { getProjects } from "~/models/project.server";
import { getUserId } from "~/session.server";
import { z } from "zod";

const dataSchema = z.object({
  task: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    projectId: z.string(),
  }),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      color: z.string(),
    })
  ),
});

export async function loader({ params, request }: LoaderArgs) {
  if (typeof params.taskId !== "string") {
    throw new Error("Uh Oh");
  }

  const userId = await getUserId(request);

  if (!userId) {
    return { redirect: "/login" };
  }

  const projects = await getProjects({ userId: userId });
  const task = await getTaskById({ id: params.taskId });

  return { task: task, projects: projects };
}

export default function EditTaskRoute() {
  const data = useLoaderData<typeof loader>();

  if (data && !isValidData(data)) {
    return <p>Something went wrong</p>;
  }

  return (
    <>
    <p>HELLO</p>
      <EditTask previousRoute="/home" taskContext={data.task} />
    </>
  );
}

function isValidData(input: unknown): input is z.infer<typeof dataSchema> {
  const isValidSchema = dataSchema.safeParse(input);
  return isValidSchema.success;
}
