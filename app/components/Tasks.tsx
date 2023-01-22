import { title } from "process";
import TaskView from "./Task";
import { Task } from "@prisma/client";
import { LiveReload } from "@remix-run/react";

type taskList = {
  tasks: Task[] | Array<any>;
};

export default function Tasks({ tasks }: taskList) {
  console.log(tasks)
  return (
    <>
      <main>
        <ol>
          {tasks
            ? tasks.map((task) => (
                <TaskView
                  title={{ title: task.title || "Tet" }}
                  dueDate={{ dueDate: task.dueDate || new Date() }}
                  priority={{ priority: task.priority || 5 }}
                  name={{ name: "Test" }}
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
