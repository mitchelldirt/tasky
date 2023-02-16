import { Link, Form } from "@remix-run/react";
import type { Task } from "@prisma/client";
import type { formError } from "~/types";

// TODO: Add props for the task id and the route that opened this modal
type editTaskModalProps = {
  formError?: formError;
  previousRoute: string;
  taskContext: Task;
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
            <input
              type="hidden"
              value={props.taskContext.id}
              name="projectId"
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
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input-bordered input w-full max-w-xs"
                name="name"
                defaultValue={props.taskContext.title}
                minLength={3}
                maxLength={27}
              />
            </div>

            <button
              type="submit"
              className="btn w-full text-white hover:bg-green-400"
            >
              Update
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}
