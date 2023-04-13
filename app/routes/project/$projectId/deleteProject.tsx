import { Form, Link, useActionData, useOutletContext } from "@remix-run/react";
import { deleteProject } from "~/models/project.server";
import { getUserId } from "~/session.server";
import { redirect } from "@remix-run/node";
import { badRequest } from "~/utils";

import type { ActionArgs } from "@remix-run/node";

export default function NewProjectModal() {
  const actionData = useActionData<typeof action>();
  //TODO: Fix the types here
  //@ts-ignore
  const context = useOutletContext<data>();
  let id = "";

  if (context && "id" in context) {
    id = context.id;
  }

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
          <Link to={`/project/${id}` || "/home"}>
            <label
              htmlFor="createProjectModal"
              className="btn-sm btn-circle btn absolute right-2 top-2"
            >
              ✕
            </label>
          </Link>
          <h3 className="mb-4 w-full text-center text-lg font-bold">
            Delete Project
          </h3>
          <Form method="delete">
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

            <input type="hidden" value={id} name="projectId" />
            <Link to={`/project/${id}` || `/home`}>
              <button
                type="button"
                className="btn mb-4 w-full text-white hover:border-white"
              >
                Cancel
              </button>
            </Link>

            <button
              type="submit"
              className="btn w-full text-red-400 hover:border-red-400"
            >
              Delete Project
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}

export async function action({ request }: ActionArgs) {
  const data = await request.formData();
  const projectId = data.get("projectId");

  const userId = await getUserId(request);
  if (userId === undefined) return redirect("/login");

  if (!projectId || typeof projectId !== "string") {
    //TODO: Figure out a better way to handle missing the project id
    return badRequest({
      formError: `Something went wrong on our end. ${projectId}`,
    });
  }

  switch (request.method) {
    case "DELETE": {
      await deleteProject({
        id: projectId,
      });
      return redirect(`/home`);
    }
  }

  return badRequest({
    formError: "Uh oh - something went wrong on our end.",
  });
}
