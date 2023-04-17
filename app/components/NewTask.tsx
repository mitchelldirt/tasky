import { Link, Form, LiveReload } from "@remix-run/react";

import type { Project } from "@prisma/client";
import { format } from "date-fns-tz";

// create a type with action data and outlet context
type ActionData = {
  formError?: string;
};

// TODO: Why are these optional?
type OutletContext = {
  projects?: Project[];
  projectId?: string;
  noneId?: string;
};

const staticRoutes: object = {
  home: `/home`,
  all: "/project/filteredView/all",
  today: `/project/filteredView/today`,
  completed: "/project/filteredView/completed",
};

export default function NewTaskModal({
  actionData,
  context,
}: {
  actionData: ActionData | null;
  context: OutletContext;
}) {
  let projectId = "";
  if (typeof context.projectId === "string") {
    projectId = context.projectId;
  }

  return (
    <>
      <input
        aria-label="Create task modal ignore this"
        type="checkbox"
        id="createToDoModal"
        className="modal-toggle"
        checked
        readOnly
      />
      <div className="modal">
        <div className="modal-box relative">
          <Link
            to={
              //@ts-expect-error
              projectId && staticRoutes[projectId]
                ? //@ts-expect-error
                  staticRoutes[projectId]
                : `/project/${context.projectId}`
            }
          >
            <label
              htmlFor="createProjectModal"
              className="btn-sm btn-circle btn absolute right-2 top-2 text-white"
            >
              ✕
            </label>
          </Link>
          <h1 className="w-full text-center text-lg font-bold text-green-400">
            Create Task
          </h1>
          <Form method="post">
            <input type="hidden" name="projectId" value={context.projectId} />
            <input type="hidden" name="noneId" value={context.noneId} />
            {actionData ? (
              <span className="mt-4 flex justify-center">
                <p
                  className="form-validation-error text-center text-red-500"
                  role="alert"
                >
                  {actionData.formError}
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
                type="text"
                placeholder="Type here"
                className="input-bordered input w-full text-white"
                name="title"
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
                className="textarea-bordered textarea h-24 text-white"
                placeholder="Type here"
                name="description"
              ></textarea>
            </div>
            <div className="flex flex-row justify-between gap-2">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span id="newTaskDueDate" className="label-text text-white">
                    Due date
                  </span>
                </label>
                <input
                  aria-labelledby="newTaskDueDate"
                  type="date"
                  placeholder=""
                  className="input-bordered input w-full max-w-xs text-white"
                  defaultValue={format(new Date(), "yyyy-MM-dd")}
                  name="dueDate"
                />
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span id="newTaskDueTime" className="label-text text-white">
                    Due time
                  </span>
                </label>
                <input
                  aria-labelledby="newTaskDueTime"
                  type="time"
                  placeholder=""
                  className="input-bordered input w-full max-w-xs text-white"
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
                  defaultValue={context.projectId || "none"}
                  name="project"
                  className="select-bordered select text-white"
                >
                  <option value={context.noneId}>NONE</option>
                  {context.projects
                    ?.filter((project) => project.id !== context.noneId)
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
                    aria-label="No priority"
                    id="priorityRadio1"
                    data-tip="None"
                  >
                    <input
                      aria-labelledby="priorityRadio1"
                      type="radio"
                      name="priority"
                      value={4}
                      className="radio border-white checked:border-gray-400 checked:bg-gray-400"
                      defaultChecked
                    />
                  </div>

                  <div
                    className="tooltip h-6"
                    aria-label="Low priority"
                    id="priorityRadio2"
                    data-tip="Low"
                  >
                    <input
                      aria-labelledby="priorityRadio2"
                      type="radio"
                      name="priority"
                      value={3}
                      className="radio border-white checked:border-blue-400 checked:bg-blue-400"
                    />
                  </div>

                  <div
                    className="tooltip h-6"
                    aria-label="Medium priority"
                    id="priorityRadio3"
                    data-tip="Medium"
                  >
                    <input
                      aria-labelledby="priorityRadio3"
                      type="radio"
                      name="priority"
                      value={2}
                      className="radio self-center border-white checked:border-orange-400 checked:bg-orange-400"
                    />
                  </div>

                  <div
                    className="tooltip h-6"
                    aria-label="High priority"
                    id="priorityRadio4"
                    data-tip="High"
                  >
                    <input
                      aria-labelledby="priorityRadio4"
                      type="radio"
                      name="priority"
                      value={1}
                      className="radio border-white checked:border-red-400 checked:bg-red-400"
                    />
                  </div>
                </fieldset>
              </div>
            </div>

            <button
              type="submit"
              className="btn mt-4 w-full text-white hover:bg-green-400"
            >
              Create
            </button>
            <LiveReload />
          </Form>
        </div>
      </div>
    </>
  );
}
