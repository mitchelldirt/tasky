import EditTask from "~/components/editTask";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { getTaskById } from "~/models/task.server";
import type { LoaderArgs } from "@remix-run/node";
import { getProjects } from "~/models/project.server";
import { getUserId } from "~/session.server";
import { z, ZodAny } from "zod";

const dataSchema = z.object({
  task: z.object({
    id: z.string(),
    description: z.string(),
    project: z.any(),
    priority: z.number(),
    title: z.string(),
  }),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      color: z.string(),
    })
  ),
});

export type TaskContext = z.infer<typeof dataSchema>;

export async function loader({ params, request }: LoaderArgs) {
  if (typeof params.taskId !== "string") {
    throw new Error("Uh Oh");
  }

  const userId = await getUserId(request);

  if (!userId) {
    return { redirect: "/login" };
  }

  // get the current url
  const url = new URL(request.url);

  const projects = await getProjects({ userId: userId });
  const task = await getTaskById({ id: params.taskId });

  return {
    taskContext: { task: task, projects: projects },
    previousRoute: url.pathname.slice(0, url.pathname.indexOf("/task")),
  };
}

export default function EditTaskRoute() {
  const data = useLoaderData<typeof loader>();

  if ("taskContext" in data) {
    if (!data || !isValidData(data.taskContext)) {
      return <p>Something went wrong</p>;
    }

    return (
      <>
        <EditTask
          previousRoute={data.previousRoute}
          taskContext={data.taskContext}
        />
      </>
    );
  }

  return <p>Something went wrong</p>;
}

function isValidData(input: unknown): input is z.infer<typeof dataSchema> {
  const isValidSchema = dataSchema.safeParse(input);
  return isValidSchema.success;
}
