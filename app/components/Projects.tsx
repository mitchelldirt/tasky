import { json, redirect } from "@remix-run/node";
import type { Project } from "@prisma/client";

type projectList = {
  projects: Project[]
}

export default function ProjectList({projects}: projectList) {
  return (
    <>
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <button key={project.id} className={`text-${project.color}-500 btn-wide btn`}>
            {project.name}
          </button>
        ))}
      </div>
    </>
  );
}