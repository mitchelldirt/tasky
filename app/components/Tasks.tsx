import TaskView from "./Task";
import type { Project, Task } from "@prisma/client";
import { LiveReload } from "@remix-run/react";
import NoTasks from "./NoTasks";
import { useEffect, useState } from "react";

type taskList = {
  tasks: Task[] | Array<any>;
  displayProject: boolean;
};

export default function Tasks({
  tasks,
  displayProject,
  name = "",
}: taskList & Partial<Pick<Project, "name">>) {
  const [path, setPath] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPath(window.location.pathname);
  }, []);

  return (
    <>
      <main className="flex w-full flex-col items-center">
        {tasks.length === 0 &&
        path.includes("completed") === false &&
        path.includes("search") === false &&
        path !== "" ? (
          <NoTasks />
        ) : (
          <ol className="flex w-full flex-col items-center md:w-3/4">
            {/* TODO: Refactor the below to match how completed prop works. That way you can do completed instead of completed.completed */}
            {tasks.map((task) => (
              <TaskView
                title={{ title: task.title || "Error" }}
                dueDate={{ dueDate: task.dueDate || new Date() }}
                priority={{ priority: task.priority || 5 }}
                name={{ name: name }}
                hasTime={{ time: task.time }}
                id={{ id: task.id }}
                project={task.project}
                completed={task.completed}
                completedAt={task.completedAt}
                key={task.id}
                displayProject={displayProject}
              />
            ))}
          </ol>
        )}
        <LiveReload />
      </main>
    </>
  );
}
