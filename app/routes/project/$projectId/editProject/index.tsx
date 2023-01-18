import { Form, Link, useActionData } from "@remix-run/react";
import { createProject } from "~/models/project.server";
import { getUserId } from "~/session.server";
import { redirect } from "@remix-run/node";

import type { ActionArgs } from "@remix-run/node";
import { badRequest } from "~/utils";

export default function NewProjectModal({projectId}: any) {
  const actionData = useActionData<typeof action>();

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
          <Link to={`/project/${projectId}`}>
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
          <Form method="post">
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

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input-bordered input w-full max-w-xs"
                name="name"
                minLength={3}
                maxLength={27}
              />
            </div>

            <div className="w-full max-w-xs">
              <label className="label">
                <span className="label-text">Color</span>
              </label>
              <div className="input mb-6 grid w-full grid-cols-5 justify-items-center gap-4">
                <input
                  value={"red"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-red-400 bg-red-400 text-red-400 checked:border-white"
                />

                <input
                  value={"blue"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-blue-400 bg-blue-400 text-blue-400 checked:border-white"
                />

                <input
                  value={"yellow"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-yellow-400 bg-yellow-400 text-yellow-400 checked:border-white"
                />

                <input
                  value={"green"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-green-400 bg-green-400 text-green-400 checked:border-white"
                />

                <input
                  value={"purple"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-purple-400 bg-purple-400 text-purple-400 checked:border-white"
                />

                <input
                  value={"orange"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-orange-400 bg-orange-400 text-orange-400 checked:border-white"
                />

                <input
                  value={"teal"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-teal-400 bg-teal-400 text-teal-400 checked:border-white"
                />

                <input
                  value={"pink"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-pink-400 bg-pink-400 text-pink-400 checked:border-white"
                />

                <input
                  value={"white"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-white bg-white text-white checked:border-black"
                />

                <input
                  value={"lime"}
                  type="radio"
                  name="color"
                  required
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-lime-400 bg-lime-400 text-lime-400 checked:border-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn w-full text-white hover:bg-green-400"
            >
              Create
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}

export async function action({ request }: ActionArgs) {
  const allowedColors = [
    "red",
    "blue",
    "yellow",
    "orange",
    "green",
    "purple",
    "pink",
    "white",
    "lime",
    "teal",
  ];
  
  const data = await request.formData();
  const name = data.get("name");
  const color = data.get("color");

  const userId = await getUserId(request);
  if (userId === undefined) return redirect("/login");

  if (!color) {
    return badRequest({
      formError: "Please select a color",
    });
  }

  if (
    typeof name !== "string" ||
    typeof color !== "string" ||
    allowedColors.includes(color) === false
  ) {
    return badRequest({
      formError: "Form submitted incorrectly, please try again.",
    });
  }

  if (name.length < 3 || name.length > 27) {
    return badRequest({
      formError: "The name of the project must be between 3 and 27 characters",
    });
  }

  switch (request.method) {
    case "PATCH": {
      await createProject({ userId: userId }, name, color);
      return redirect("/project");
    }
  }

  return badRequest({
    formError: "Uh oh - something went wrong on our end.",
  });
}
