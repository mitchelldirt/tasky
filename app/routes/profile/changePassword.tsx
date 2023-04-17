import { Form, Link, useActionData, useCatch } from "@remix-run/react";
import { badRequest, validatePassword } from "~/utils";
import { getUserId } from "~/session.server";
import { isCurrentPassword, updatePassword } from "~/models/user.server";

import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export default function ChangePassword() {
  const data = useActionData<typeof action>();

  return (
    <>
      <Form className="flex w-3/4 flex-col items-center" method="patch">
        <h2 className="text-bold border-t-2 border-green-200 pt-4 text-center text-2xl text-white">
          Update Password
        </h2>
        <div>
          {data ? (
            <>
              <span className="mt-4 flex">
                <p
                  className="form-validation-error text-center text-red-500"
                  role="alert"
                >
                  {data.formError}
                </p>
                <span className="relative left-3 inline-flex h-3 w-3 animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
              </span>
            </>
          ) : null}
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text text-white">Current</span>
          </label>
          <input
            name="currentPassword"
            type="password"
            placeholder="Type current password here"
            className="input-bordered input w-full max-w-xs"
            defaultValue={""}
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text text-white">New</span>
          </label>
          <input
            name="password"
            type="password"
            placeholder="Type new password here"
            className="input-bordered input w-full max-w-xs"
            defaultValue={""}
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text text-white">Confirm</span>
          </label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password here"
            className="input-bordered input w-full max-w-xs"
          />
        </div>

        <div className="mt-4 mb-6 flex flex-row gap-10">
          <Link
            id="changePassword"
            aria-label="Cancel password change"
            to={"/profile"}
          >
            <button aria-labelledby="changePassword" className="btn-error btn">
              Cancel
            </button>
          </Link>
          <button
            aria-label="Save your new password"
            className="btn-success btn"
          >
            Save
          </button>
        </div>
      </Form>
    </>
  );
}

export async function action({ request }: ActionArgs) {
  const body = await request.formData();

  const currentPassword = body.get("currentPassword");
  const password = body.get("password");
  const confirmPassword = body.get("confirmPassword");

  if (
    validatePassword(password) === false ||
    validatePassword(confirmPassword) === false
  ) {
    return badRequest({
      fields: null,
      formError: `Password must be at least 6 characters`,
    });
  }

  if (password !== confirmPassword) {
    return badRequest({
      fields: {
        password: password,
      },
      formError: `Passwords do not match`,
    });
  }

  const userId = await getUserId(request);
  if (userId === undefined) return redirect("/login");

  if (validatePassword(currentPassword)) {
    const isUsersPassword = await isCurrentPassword(userId, currentPassword);

    if (!isUsersPassword) {
      return badRequest({
        fields: null,
        formError: "Current password incorrect",
      });
    }

    if (validatePassword(password)) {
      updatePassword(userId, password);
    }

    return redirect(`/profile`);
  }

  throw new Response("Uh oh something went wrong", {
    status: 400,
  });
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
