import ProjectList from "~/components/Projects";
import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import { getUserId } from "~/session.server";
import { getProjects } from "~/models/project.server";

import type { LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/");

  if (typeof userId !== "string") return;

  const projects = await getProjects({ userId });

  console.log(projects);
  return json({ projects });
}

export default function Home() {
  const data = useLoaderData<typeof loader>();

  if (!data) return (<></>)

    return (
      <>
        <ProjectList projects={data.projects} />
      </>
    );
}
