import { Link, Form, LiveReload } from "@remix-run/react";
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
          <Link to={props.previousRoute || "/home"}>
            <label
              htmlFor="editTaskModal"
              className="btn-sm btn-circle btn absolute right-2 top-2"
            >
              ✕
            </label>
          </Link>
          <h3 className="w-full text-center text-lg font-bold">Edit Task</h3>
          <Form method="patch">
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
                name="title"
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
                defaultValue={props.taskContext.task.projectId || "none"}
                name="project"
                className="select-bordered select"
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
                defaultValue={props.taskContext.task.dueDate ? extractDate(new Date(props.taskContext.task.dueDate)) : ""
                }
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
                defaultValue={
                  props.taskContext.task.time && props.taskContext.task.dueDate 
                    ? extractTime(props.taskContext.task.dueDate)
                    : ""
                }
                name="dueTime"
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Priority</span>
              </label>
              <fieldset
                defaultValue={props.taskContext.task.priority}
                className="form-control w-full max-w-xs rounded-lg border-2 border-gray-400 border-opacity-20"
              >
                <div className="form-control ">
                  <label className="label cursor-pointer">
                    <span className="label-text">none</span>
                    <input
                      type="radio"
                      name="priority"
                      value={4}
                      className="radio checked:bg-gray-400"
                      defaultChecked={props.taskContext.task.priority === 4}
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
                      defaultChecked={props.taskContext.task.priority === 3}
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
                      defaultChecked={props.taskContext.task.priority === 2}
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
                      defaultChecked={props.taskContext.task.priority === 1}
                    />
                  </label>
                </div>
              </fieldset>
            </div>

            <button
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
