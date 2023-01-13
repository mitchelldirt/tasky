import { Form, Link } from "@remix-run/react";
import { createProject } from "~/models/project.server";
import { getUserId } from "~/session.server";
import {redirect} from '@remix-run/node'

import type { ActionArgs } from "@remix-run/node";

export default function newProjectModal() {
  return (
    <>
      <input
        type="checkbox"
        id="createProjectModal"
        className="modal-toggle"
        checked
      />
      <div className="modal">
        <div className="modal-box relative">
          <Link to={"/home"}>
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
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input-bordered input w-full max-w-xs"
                name="name"
              />
            </div>

            <div className="form-control mb-6 w-full max-w-xs">
              <label className="label">
                <span className="label-text">Color</span>
              </label>
              <select
                name="color"
                defaultValue={"blue"}
                className="select-bordered select"
              >
                <option disabled>Pick one</option>
                <option value={"red"} className="text-red-400">
                  red
                </option>
                <option value={"blue"}>blue</option>
                <option value={"green"}>green</option>
              </select>
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
  console.log("jello");
  const data = await request.formData();
  const name = data.get("name");
  const color = data.get("color");

  const userId = await getUserId(request);
  if (userId === undefined) return redirect("/login");

  if (typeof name !== 'string' || typeof color !== 'string') {
    return new Response('bad')
  }

  switch (request.method) {
    case "POST": {
      await createProject({userId: userId}, name, color);
      return redirect("/home");
    }
  }
}
