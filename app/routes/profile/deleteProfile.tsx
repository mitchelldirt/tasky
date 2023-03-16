import { Form, Link, useActionData, useCatch } from "@remix-run/react";
import { badRequest, validateEmail } from "~/utils";
import { getUserId } from "~/session.server";
import { deleteUserByUserId, updateEmail } from "~/models/user.server";

import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export default function ChangeEmail() {
  const data = useActionData<typeof action>();

  return (
    <>
      <Form className="flex w-3/4 flex-col items-center" method="patch">
        <h2 className="text-bold border-t-2 border-green-200 pt-4 text-center text-2xl">
          Delete Account
        </h2>

        <div className="mt-4 flex flex-row gap-10 mb-6">
          <button type="button" onClick={(e) => {
            document.getElementById("delete")?.classList.remove("hidden");
          }} className="btn-error btn">
            DELETE
          </button>
          <Link to={"/profile"} className="btn text-white">
            Cancel
          </Link>
        </div>
        <div id="delete" className="flex hidden flex-col justify-center gap-4">
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

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </div>
  );
}
