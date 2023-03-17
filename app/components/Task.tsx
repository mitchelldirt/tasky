import type { Task, Project } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
import dueDateColor from "~/helpers/dueDateColor";
import { parseDueDate } from "~/helpers/dueDateFunctions";
import priorityColor from "~/helpers/priorityColor";

type TaskProps = {
  title: { title: Task["title"] };
  dueDate: { dueDate: Task["dueDate"] };
  priority: { priority: Task["priority"] };
  name: { name: Project["name"] };
  hasTime: { time: Task["time"] };
  id: { id: Task["id"] };
  completed: Task["completed"];
  completedAt: Task["completedAt"];
};

export default function TaskView({
  title,
  dueDate,
  priority,
  name,
  hasTime,
  id,
  completed,
  completedAt,
}: TaskProps) {
  let parsedDueDate;
  let dueDateTextColor;

  if (completed === false && dueDate.dueDate && typeof dueDate.dueDate !== "object") {
    parsedDueDate = parseDueDate(dueDate.dueDate, hasTime.time, completed);

    dueDateTextColor = dueDateColor(
      parsedDueDate.date,
      parsedDueDate.isOverdue
    );
  } else if (completed === true && completedAt && typeof completedAt !== "object") {
    parsedDueDate = parseDueDate(completedAt, true, completed);
  }

  const priorityTextColor = priorityColor(priority.priority);
  console.log(completed);
  if (completed === false) {
    return (
      <>
        <div className="mb-2 flex w-4/5 flex-row items-center gap-2">
          <Form method="patch" action={`/api/task/${id.id}`}>
            <input type="hidden" name="id" value={id.id} />
            <input type="hidden" name="restore" value={`${completed}`} />
            <input type="hidden" name="currentTime" value={new Date().toString()} />
            <button type="submit" className="h-8 w-8 appearance-none">
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
            </button>
          </Form>

          <Link
            to={`task/${id.id}`}
            className="w-full border-b-2 border-gray-400"
          >
            <div className="flex flex-col">
              <p className="text-white">{title.title}</p>
              {parsedDueDate?.date ? (
                <div className={`${dueDateTextColor} flex flex-row gap-3`}>
                  <p>{parsedDueDate.date}</p>
                  {hasTime.time ? <p>{parsedDueDate.time}</p> : null}
                </div>
              ) : null}
            </div>
            <span>{name.name}</span>
          </Link>
        </div>
      </>
    );
  } else if (completed === true) {
    return (
      <>
        <div className="mb-2 flex w-4/5 flex-row items-center gap-2">
          <Form method="patch" action={`/api/task/${id.id}`}>
            <input type="hidden" name="id" value={id.id} />
            <input type="hidden" name="restore" value={`${completed}`} />
            <button type="submit" className="btn bg-white text-black w-fit h-fit hover:bg-green-200">
              Restore Task
            </button>
          </Form>

          <Link
            to={`task/${id.id}`}
            className="w-full border-b-2 border-gray-400"
          >
            <div className="flex flex-col">
              <p className="text-white">{title.title}</p>
              {parsedDueDate?.date ? (
                <div className={`${dueDateTextColor} flex flex-row gap-3`}>
                  <p>Completed: {parsedDueDate.date}</p>
                  <p>{parsedDueDate.time}</p>
                </div>
              ) : null}
            </div>
            <span>{name.name}</span>
          </Link>
        </div>
      </>
    );
  } else {
    return (
      <>
        <p>Uh oh: task rendering is broken</p>
      </>
    );
  }
}
