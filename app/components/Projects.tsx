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
        {projects.map((project, index) => {
          const textColorClass = createTailwindTextColor(project.color);

          if (index === 0) {
            return (
              <>
                <Link to={`/project/${project.id}`}>
                  <button
                    key={project.id}
                    className={`${textColorClass} btn-wide btn justify-start rounded-b-none border-0 border-b-2 border-slate-400 hover:border-slate-200`}
                  >
                    {project.name}
                  </button>
                </Link>
              </>
            );
          }

          if (index === projects.length - 1) {
            return (
              <>
                <Link to={`/project/${project.id}`}>
                  <button
                    key={project.id}
                    className={`btn-wide btn justify-start rounded-t-none border-0 text-${project.color}-400 hover:border-b-2 hover:border-slate-200`}
                  >
                    {project.name}
                  </button>
                </Link>
              </>
            );
          }

          return (
            <>
              <Link to={`/project/${project.id}`}>
                <button
                  key={project.id}
                  className={`btn-wide btn justify-start rounded-none border-0 border-b-2 border-slate-400 text-${project.color}-400 hover:border-slate-200`}
                >
                  {project.name}
                </button>
              </Link>
            </>
          );
        })}
      </div>
    </>
  );
}
