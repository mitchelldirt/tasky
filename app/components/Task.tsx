import type { Task, Project } from "@prisma/client";
import { parse } from "node:path/win32";
import dueDateColor from "~/helpers/dueDateColor";
import parseDueDate from "~/helpers/parseDueDate";
import priorityColor from "~/helpers/priorityColor";

type TaskProps = {
  title: { title: Task["title"] };
  dueDate: { dueDate: Task["dueDate"] };
  priority: { priority: Task["priority"] };
  name: { name: Project["name"] };
  hasTime: { time: Task["time"] };
};

export default function TaskView({
  title,
  dueDate,
  priority,
  name,
  hasTime,
}: TaskProps) {
  const parsedDueDate = parseDueDate(dueDate.dueDate.toString(), hasTime.time);
  
  const dueDateTextColor = dueDateColor(
    parsedDueDate.date,
    parsedDueDate.isOverdue
  );
  
  const priorityTextColor = priorityColor(priority.priority);
  return (
    <>
      <div className="mb-2 flex w-4/5 flex-row items-center gap-2">
        <svg
          className={`h-8 w-8 ${priorityTextColor}`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <circle cx="12" cy="12" r="9" />
        </svg>

        <div className="w-full border-b-2 border-gray-400">
          <div className="flex flex-col">
            <p className="text-white">{title.title}</p>
            <div
              className={`${dueDateTextColor} flex flex-row gap-3`}
            >
              <p>{parsedDueDate.date}</p>
              {hasTime.time ? <p>{parsedDueDate.time}</p> : null}
            </div>
          </div>
          <span>{name.name}</span>
        </div>
      </div>
    </>
  );
}
