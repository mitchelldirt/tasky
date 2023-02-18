import { Link, Form, LiveReload } from "@remix-run/react";
import type { Task } from "@prisma/client";
import type { formError } from "~/types";
import type { TaskContext } from "~/routes/project/$projectId/task/$taskId"; 

// TODO: Add props for the task id and the route that opened this modal
// TODO: Remove the any type on taskContext
type editTaskModalProps = {
  formError?: formError;
  previousRoute: string;
  taskContext: TaskContext;
};

export default function EditTask({ ...props }: editTaskModalProps) {
  return (
    <>
      <input
        type="checkbox"
        id="createProjectModal"
        className="modal-toggle"
        checked
        readOnly
      />
      <div className="modal">
        <div className="modal-box relative">
          {/*TODO: Catch the error in the loader above so that you don't have to route to home on failure. Or create an uh oh page*/}
          <Link to={props.previousRoute || "/home"}>
            <label
              htmlFor="createProjectModal"
              className="btn-sm btn-circle btn absolute right-2 top-2"
            >
              ✕
            </label>
          </Link>
          <h3 className="w-full text-center text-lg font-bold">
            Create Project
          </h3>
          <Form method="patch">
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

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  Name
                  <span className="ml-2 text-lg text-red-400">*</span>
                </span>
              </label>
              <input
                type="text"
                defaultValue={props.taskContext.task.title}
                placeholder="Type here"
                className="input-bordered input w-full max-w-xs"
                name="name"
                required
                minLength={3}
                maxLength={27}
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  Project
                  <span className="ml-2 text-lg text-red-400">*</span>
                </span>
              </label>
              <select
                defaultValue={props.taskContext.task.project || "none"}
                name="project"
                className="select-bordered select"
              >
                <option value={"none"}>NONE</option>
                {/* {context.projects
                  ?.filter((project) => project.id !== "none")
                  .map((project) => {
                    return (
                      <option value={project.id} key={project.id}>
                        {project.name}
                      </option>
                    );
                  })} */}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea-bordered textarea h-24"
                placeholder="Type here"
                defaultValue={props.taskContext.task.description}
                name="description"
              ></textarea>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Due date</span>
              </label>
              <input
                type="date"
                placeholder=""
                className="input-bordered input w-full max-w-xs"
                defaultValue={new Date().toISOString().slice(0, 10)}
                name="dueDate"
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Due time</span>
              </label>
              <input
                type="time"
                placeholder=""
                className="input-bordered input w-full max-w-xs"
                name="dueTime"
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Priority</span>
              </label>
              <fieldset defaultValue={props.taskContext.task.priority} className="form-control w-full max-w-xs rounded-lg border-2 border-gray-400 border-opacity-20">
                <div className="form-control ">
                  <label className="label cursor-pointer">
                    <span className="label-text">none</span>
                    <input
                      type="radio"
                      name="priority"
                      value={4}
                      className="radio checked:bg-gray-400"
                      checked={props.taskContext.task.priority === 4}
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">low</span>
                    <input
                      type="radio"
                      name="priority"
                      value={3}
                      className="radio checked:bg-blue-400"
                      checked={props.taskContext.task.priority === 3}
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">medium</span>
                    <input
                      type="radio"
                      name="priority"
                      value={2}
                      className="radio checked:bg-orange-400"
                      checked={props.taskContext.task.priority === 2}
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">high</span>
                    <input
                      type="radio"
                      name="priority"
                      value={1}
                      className="radio checked:bg-red-400"
                      checked={props.taskContext.task.priority === 1}
                    />
                  </label>
                </div>
              </fieldset>
            </div>

            <button
              type="submit"
              className="btn mt-4 w-full text-white hover:bg-green-400"
            >
              Create
            </button>
          </Form>
        </div>
        <LiveReload />
      </div>
    </>
  );
}
