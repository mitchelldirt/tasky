import { title } from "process";
import TaskView from "./Task";
import { Project, Task } from "@prisma/client";
import { LiveReload } from "@remix-run/react";

type taskList = {
  tasks: Task[] | Array<any>;
};

export default function Tasks({
  tasks,
  name = "",
}: taskList & Partial<Pick<Project, "name">>) {
  console.log(tasks);
  return (
    <>
      <main className="flex flex-col items-center">
        <ol className="flex flex-col items-center w-full md:w-3/4">
          {tasks
            ? tasks.map((task) => (
                <TaskView
                  title={{ title: task.title || "Tet" }}
                  dueDate={{ dueDate: task.dueDate || new Date() }}
                  priority={{ priority: task.priority || 5 }}
                  name={{ name: name }}
                  hasTime={{time: task.time}}
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
