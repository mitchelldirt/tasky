import TaskView from "./Task";
import type { Project, Task } from "@prisma/client";
import { LiveReload } from "@remix-run/react";

type taskList = {
  tasks: Task[] | Array<any>;
};

export default function Tasks({
  tasks,
  name = ""
}: taskList & Partial<Pick<Project, "name">>) {
  return (
    <>
      <main className="flex flex-col items-center">
        <ol className="flex w-full flex-col items-center md:w-3/4">
          {/* TODO: Refactor the below to match how completed prop works. That way you can do completed instead of completed.completed */}
          {tasks
            ? tasks.map((task) => (
                <TaskView
                  title={{ title: task.title || "Tet" }}
                  dueDate={{ dueDate: task.dueDate || new Date() }}
                  priority={{ priority: task.priority || 5 }}
                  name={{ name: name }}
                  hasTime={{ time: task.time }}
                  id={{ id: task.id }}
                  completed={task.completed}
                  completedAt={task.completedAt}
                  key={task.id}
                />
              ))
            : null}
        </ol>
        <LiveReload />
      </main>
    </>
  );
}
