import { createTailwindTextColor } from "~/helpers/colorClass";

import type { Project } from "@prisma/client";
import { Link } from "@remix-run/react";

type projectList = {
  projects: Project[];
};

export default function ProjectList({ projects }: projectList) {
  return (
    <>
      <div className="flex flex-col">
        {projects
          .filter((project) => project.id !== "none")
          .map((project, index) => {
            const textColorClass = createTailwindTextColor(project.color);

            if (index === 0) {
              return (
                <Link key={project.id} to={`/project/${project.id}`}>
                  <button
                    className={`${textColorClass} btn-wide btn justify-start rounded-b-none border-0 border-b-2 border-slate-400 hover:border-slate-200`}
                  >
                    {project.name}
                  </button>
                </Link>
              );
            }

            // If the project is the last one in the list, round the bottom border.
            // -2 because of the project 'none' which we filter out.
            if (index === projects.length - 2) {
              return (
                <Link key={project.id} to={`/project/${project.id}`}>
                  <button
                    className={`btn-wide btn justify-start rounded-t-none border-0 text-${project.color}-400 hover:border-b-2 hover:border-slate-200`}
                  >
                    {project.name}
                  </button>
                </Link>
              );
            }

            return (
              <Link key={project.id} to={`/project/${project.id}`}>
                <button
                  className={`btn-wide btn justify-start rounded-none border-0 border-b-2 border-slate-400 text-${project.color}-400 hover:border-slate-200`}
                >
                  {project.name}
                </button>
              </Link>
            );
          })}
      </div>
    </>
  );
}
