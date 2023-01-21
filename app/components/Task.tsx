import type { Task, Project } from "@prisma/client";

type TaskProps = {
  title: { title: Task["title"] };
  dueDate: { dueDate: Task["dueDate"] };
  priority: { priority: Task["priority"] };
  name: { name: Project["name"] };
};

export default function TaskView({title, dueDate, priority, name}: TaskProps) {
  return (
    <>
      <div className="flex flex-row">
        <svg
          className="h-8 w-8 text-white"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <circle cx="12" cy="12" r="9" />
        </svg>

        <div className="flex flex-col">
          <p>{title.title}</p>
          <p>{dueDate.dueDate.toUTCString()}</p>
        </div>
        <span>{name.name}</span>
      </div>
    </>
  );
}
