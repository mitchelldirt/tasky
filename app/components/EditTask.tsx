import { Link, Form, LiveReload, useActionData } from "@remix-run/react";
import { extractDate, extractTime } from "~/helpers/dueDateFunctions";
import type { formError } from "~/types";
import type { TaskContext } from "~/routes/project/$projectId/task/$taskId";

type editTaskModalProps = {
  formError?: formError;
  previousRoute: string;
  taskContext: TaskContext;
  noneId: string;
};

export default function EditTask({ ...props }: editTaskModalProps) {
  const actionData = useActionData();
  return (
    <>
      <input
        type="checkbox"
        id="editTaskModal"
        className="modal-toggle"
        checked
        readOnly
      />
      <div className="modal">
        <div className="modal-box relative">
          <div className="absolute right-2 top-2">
            <div className="flex flex-row items-center justify-center gap-3">
              <div className="dropdown-end dropdown">
                <label
                  data-cy="editTaskActionsMenu"
                  tabIndex={0}
                  className="btn-ghost btn-circle avatar btn"
                >
                  <div className="h-6 w-6 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                      />
                    </svg>
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-black p-2 text-white shadow"
                >
                  <li className="h-10 hover:bg-gray-500">
                    <Form
                      method="post"
                      action={`/api/task/${props.taskContext.task.id}`}
                      className="h-full w-full p-0"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={props.taskContext.task.id}
                      />
                      <button
                        data-cy="editTaskDuplicate"
                        className="h-full w-full"
                        type="submit"
                      >
                        Duplicate
                      </button>
                    </Form>
                  </li>
                  <li className="h-10 hover:bg-red-500">
                    <Form
                      method="delete"
                      action={`/api/task/${props.taskContext.task.id}`}
                      className="h-full w-full p-0"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={props.taskContext.task.id}
                      />
                      <button
                        data-cy="editTaskDelete"
                        className="h-full w-full"
                        type="submit"
                      >
                        Delete
                      </button>
                    </Form>
                  </li>
                </ul>
              </div>
              <div>
                <Link to={`${props.previousRoute}` || `/home`}>
                  <label
                    htmlFor="editTaskModal"
                    className="btn-sm btn-circle btn text-white"
                  >
                    ✕
                  </label>
                </Link>
              </div>
            </div>
          </div>
          <h1 className="w-full text-center text-lg font-bold text-green-400">
            Edit Task
          </h1>
          <Form method="patch">
            {actionData?.formError ? (
              <div className="w-full text-center text-red-700">
                {actionData.formError}
              </div>
            ) : null}
            <input type="hidden" name="id" value={props.taskContext.task.id} />
            <input
              type="hidden"
              name="previousRoute"
              value={props.previousRoute}
            />
            {props.formError ? (
              <span className="mt-4 flex justify-center">
                <p
                  className="form-validation-error text-center text-red-500"
                  role="alert"
                >
                  {props.formError}
                </p>
              </span>
            ) : null}

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-white">
                  Name
                  <span className="ml-2 text-lg text-red-400">*</span>
                </span>
              </label>
              <input
                data-cy="editTaskTitle"
                type="text"
                placeholder="Type here"
                className="input-bordered input w-full  text-white"
                name="title"
                defaultValue={props.taskContext.task.title}
                required
                minLength={3}
                maxLength={27}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Description</span>
              </label>
              <textarea
                data-cy="editTaskDescription"
                className="textarea-bordered textarea h-24 text-white"
                placeholder="Type here"
                defaultValue={props.taskContext.task.description}
                name="description"
              ></textarea>
            </div>
            <div className="flex flex-row justify-between gap-2">
              <div className="form-control w-full max-w-xs">
                <label className="label text-white">
                  <span
                    id="editTaskDueDate"
                    aria-label="Change the due date"
                    className="label-text text-white"
                  >
                    Due date
                  </span>
                </label>
                <input
                  data-cy="editTaskDueDate"
                  aria-labelledby="editTaskDueDate"
                  type="date"
                  placeholder=""
                  className="input-bordered input w-full max-w-xs text-white"
                  defaultValue={
                    props.taskContext.task.dueDate
                      ? extractDate(props.taskContext.task.dueDate)
                      : ""
                  }
                  name="dueDate"
                />
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span
                    id="editTaskDueTime"
                    aria-label="Change the due time"
                    className="label-text text-white"
                  >
                    Due time
                  </span>
                </label>
                <input
                  data-cy="editTaskDueTime"
                  aria-labelledby="editTaskDueTime"
                  type="time"
                  placeholder=""
                  className="input-bordered input w-full max-w-xs text-white"
                  defaultValue={
                    props.taskContext.task.time &&
                    props.taskContext.task.dueDate
                      ? extractTime(props.taskContext.task.dueDate)
                      : ""
                  }
                  name="dueTime"
                />
              </div>
            </div>

            <div className="flex flex-row justify-between gap-2">
              <div className="form-control w-1/2 max-w-xs">
                <label className="label">
                  <span className="label-text text-white">
                    Project
                    <span className="ml-2 text-lg text-red-400">*</span>
                  </span>
                </label>
                <select
                  data-cy="editTaskProject"
                  defaultValue={props.taskContext.task.projectId || "none"}
                  name="project"
                  className="select-bordered select text-white"
                >
                  <option value={props.noneId}>NONE</option>
                  {props.taskContext.projects
                    ?.filter((project) => project.id !== props.noneId)
                    .map((project) => {
                      return (
                        <option value={project.id} key={project.id}>
                          {project.name}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="w-full max-w-xs">
                <label className="label h-11">
                  <span className="label-text text-white">
                    Priority
                    <span className="ml-2 text-lg text-red-400">*</span>
                  </span>
                </label>
                <fieldset className="form-control flex h-12 w-full max-w-xs flex-row items-center justify-around rounded-lg border-2 border-gray-400 border-opacity-20">
                  <div
                    className="tooltip h-6"
                    id="editTakePriorityRadio1"
                    aria-label="No Priority"
                    data-tip="None"
                  >
                    <input
                      data-cy="editTaskPriorityNone"
                      aria-labelledby="editTakePriorityRadio1"
                      type="radio"
                      name="priority"
                      value={4}
                      className="radio border-white checked:border-gray-400 checked:bg-gray-400"
                      defaultChecked={props.taskContext.task.priority === 4}
                    />
                  </div>

                  <div
                    className="tooltip h-6"
                    id="editTakePriorityRadio2"
                    aria-label="Low Priority"
                    data-tip="Low"
                  >
                    <input
                      data-cy="editTaskPriorityLow"
                      aria-labelledby="editTakePriorityRadio2"
                      type="radio"
                      name="priority"
                      value={3}
                      className="radio border-white checked:border-blue-400 checked:bg-blue-400"
                      defaultChecked={props.taskContext.task.priority === 3}
                    />
                  </div>

                  <div
                    className="tooltip h-6"
                    id="editTakePriorityRadio3"
                    aria-label="Medium Priority"
                    data-tip="Medium"
                  >
                    <input
                      data-cy="editTaskPriorityMedium"
                      aria-labelledby="editTakePriorityRadio3"
                      type="radio"
                      name="priority"
                      value={2}
                      className="radio self-center border-white checked:border-orange-400 checked:bg-orange-400 "
                      defaultChecked={props.taskContext.task.priority === 2}
                    />
                  </div>

                  <div
                    className="tooltip h-6"
                    id="editTakePriorityRadio4"
                    aria-label="High Priority"
                    data-tip="High"
                  >
                    <input
                      data-cy="editTaskPriorityHigh"
                      aria-labelledby="editTakePriorityRadio4"
                      type="radio"
                      name="priority"
                      value={1}
                      className="radio border-white checked:border-red-400 checked:bg-red-400"
                      defaultChecked={props.taskContext.task.priority === 1}
                    />
                  </div>
                </fieldset>
              </div>
            </div>

            <button
              data-cy="editTaskSubmit"
              type="submit"
              className="btn mt-4 w-full text-white hover:bg-green-400"
            >
              Update
            </button>
          </Form>
        </div>
        <LiveReload />
      </div>
    </>
  );
}
