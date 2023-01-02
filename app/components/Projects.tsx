import { json, redirect } from "@remix-run/node";
import type { Project } from "@prisma/client";

type projectList = {
  projects: Project[]
}

export default function ProjectList({projects}: projectList) {
  return (
    <>
      <ul className="flex flex-col">
        {projects.map((project) => (
          <li key={project.id} className={`text-${project.color}-500`}>
            {project.name}
          </li>
        ))}
      </ul>
    </>
  );
}