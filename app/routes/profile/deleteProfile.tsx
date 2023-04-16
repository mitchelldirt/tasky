import { Form, Link } from "@remix-run/react";
import { getUserId } from "~/session.server";
import { deleteUserByUserId } from "~/models/user.server";

import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export default function ChangeEmail() {
  return (
    <>
      <Form className="flex w-3/4 flex-col items-center" method="patch">
        <h2 className="text-bold border-t-2 border-green-200 pt-4 text-center text-2xl text-white">
          Delete Account
        </h2>

        <div className="mt-4 mb-6 flex flex-row gap-10">
          <button
            type="button"
            onClick={(e) => {
              document.getElementById("delete")?.classList.remove("hidden");
              document.getElementById("delete")?.classList.add("flex");
            }}
            className="btn-error btn"
          >
            DELETE
          </button>
          <Link to={"/profile"} className="btn text-white">
            Cancel
          </Link>
        </div>
        <div id="delete" className="mb-6 hidden flex-col justify-center gap-4">
          <p className="text-white">
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <button type="submit" className="btn-error btn">
            DELETE
          </button>
          <Link to={"/profile"} className="btn text-white">
            Cancel
          </Link>
        </div>
      </Form>
    </>
  );
}

export async function action({ request }: ActionArgs) {
  const userId = await getUserId(request);
  if (userId === undefined) return redirect("/login");
  await deleteUserByUserId(userId);
  return redirect("/");
}
