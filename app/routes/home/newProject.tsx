import { Form, Link, useActionData } from "@remix-run/react";
import { createProject, getProjects } from "~/models/project.server";
import { getUserId } from "~/session.server";
import { redirect } from "@remix-run/node";

import type { ActionArgs } from "@remix-run/node";
import { badRequest } from "~/utils";

export default function NewProjectModal() {
  const actionData = useActionData<typeof action>();

  return (
    <>
      <input
        aria-label="This is a modal"
        type="checkbox"
        id="createProjectModal"
        className="modal-toggle"
        checked
        readOnly
      />
      <div className="modal">
        <div className="modal-box relative">
          <Link to={`/home`}>
            <button
              aria-label="Close modal"
              className="btn-sm btn-circle btn absolute right-2 top-2 text-white"
            >
              ✕
            </button>
          </Link>
          <h1 className="w-full text-center text-lg font-bold text-green-400">
            Create Project
          </h1>
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
                <span id="newProjectName" className="label-text text-white">
                  Name
                </span>
              </label>
              <input
                aria-labelledby="newProjectName"
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
                <span id="newProjectColor" className="label-text text-white">
                  Color
                </span>
              </label>
              <div className="input mb-6 grid w-full grid-cols-5 justify-items-center gap-4">
                <input
                  aria-labelledby="newProjectColor"
                  value={"red"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-red-400 bg-red-400 text-red-400 checked:border-white"
                />

                <input
                  aria-label="Blue project color"
                  value={"blue"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-blue-400 bg-blue-400 text-blue-400 checked:border-white"
                />

                <input
                  aria-label="Yellow project color"
                  value={"yellow"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-yellow-400 bg-yellow-400 text-yellow-400 checked:border-white"
                />

                <input
                  aria-label="Green project color"
                  value={"green"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-green-400 bg-green-400 text-green-400 checked:border-white"
                />

                <input
                  aria-label="Purple project color"
                  value={"purple"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-purple-400 bg-purple-400 text-purple-400 checked:border-white"
                />

                <input
                  aria-label="Orange project color"
                  value={"orange"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-orange-400 bg-orange-400 text-orange-400 checked:border-white"
                />

                <input
                  aria-label="Teal project color"
                  value={"teal"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-teal-400 bg-teal-400 text-teal-400 checked:border-white"
                />

                <input
                  aria-label="Pink project color"
                  value={"pink"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-pink-400 bg-pink-400 text-pink-400 checked:border-white"
                />

                <input
                  aria-label="White project color"
                  value={"white"}
                  type="radio"
                  name="color"
                  id=""
                  className="h-4 w-4 appearance-none rounded-full border-2 border-white bg-white text-white checked:border-black"
                />

                <input
                  aria-label="Lime green project color"
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
              aria-label="Create the new project"
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

  const projectNames = await getProjects({ userId });

  for (let project of projectNames) {
    if (project.name === name) {
      return badRequest({
        formError: "You already have a project with that name",
      });
    }
  }

  switch (request.method) {
    case "POST": {
      await createProject({ userId: userId }, name, color);
      return redirect(`/home`);
    }
  }

  return badRequest({
    formError: "Uh oh - something went wrong on our end.",
  });
}
