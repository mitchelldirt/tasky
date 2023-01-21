import { title } from "process";
import TaskView from "./Task";
import { Task } from "@prisma/client";

const sampleTask: Partial<Task> = {
id: 'id',
dueDate: new Date,
description: 'desc',
priority: 5,
completed: false
}

export default function Tasks() {
  return (
    <>
      <main>
        <TaskView
        title={{title: sampleTask.title || 'Test'}}
        dueDate={{dueDate: sampleTask.dueDate || new Date}}
        priority={{priority: sampleTask.priority || 5}}
        name={{name: 'Test'}}
        />
      </main>
    </>
  );
}
