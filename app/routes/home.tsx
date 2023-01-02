import ProjectList from "~/components/Projects";
import { useCatch, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import { getUserId } from "~/session.server";
import { getProjects } from "~/models/project.server";

import type { LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) throw redirect("/");

  if (typeof userId !== "string") throw new Response("Invalid userID format", {
    status: 400
  });

  const projects = await getProjects({ userId });

  return json({ projects });
}

export default function Home() {
  const data = useLoaderData<typeof loader>();

    return (
      <>
        <ProjectList projects={data.projects} />
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
  )
}
}
