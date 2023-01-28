import { Form, Link, useActionData } from "@remix-run/react";
import { createProject } from "~/models/project.server";
import { getUserId } from "~/session.server";
import { redirect } from "@remix-run/node";

import type { ActionArgs } from "@remix-run/node";
import { badRequest } from "~/utils";


export default function newToDo() {
  return (
    <>
    </>
  )
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
    case "POST": {
      await createProject({ userId: userId }, name, color);
      return redirect("/home");
    }
  }

  return badRequest({
    formError: "Uh oh - something went wrong on our end.",
  });
}
