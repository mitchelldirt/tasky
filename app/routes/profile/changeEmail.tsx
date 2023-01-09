import { Form, Link, useActionData, useCatch } from "@remix-run/react";
import { badRequest, validateEmail } from "~/utils";
import { getUserId } from "~/session.server";
import { updateEmail } from "~/models/user.server";

import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export default function ChangeEmail() {
  const data = useActionData<typeof action>();

  return (
    <>
      <Form className="flex w-3/4 flex-col items-center" method="patch">
        <h2 className="text-bold border-t-2 border-green-200 pt-4 text-center text-2xl">
          Update Email Address
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
            <span className="label-text">New</span>
          </label>
          <input
            name="email"
            type="text"
            placeholder="Type new email here"
            className="input-bordered input w-full max-w-xs"
            defaultValue={data?.fields?.email ? data.fields.email : ""}
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Confirm</span>
          </label>
          <input
            name="confirmEmail"
            type="text"
            placeholder="Confirm new email here"
            className="input-bordered input w-full max-w-xs"
          />
        </div>

        <div className="mt-4 flex flex-row gap-10">
          <Link to={"/profile"}>
            <button className="btn-error btn">Cancel</button>
          </Link>
          <button className="btn-success btn">Save</button>
        </div>
      </Form>
    </>
  );
}

export async function action({ request }: ActionArgs) {
  const body = await request.formData();

  const email = body.get("email");
  const confirmEmail = body.get("confirmEmail");

  if (validateEmail(email) === false || validateEmail(confirmEmail) === false) {
    return badRequest({
      fields: null,
      formError: `Invalid Email`,
    });
  }

  if (email !== confirmEmail) {
    return badRequest({
      fields: {
        email: email,
      },
      formError: `Emails do not match`,
    });
  }

  const userId = await getUserId(request);
  if (userId === undefined) return redirect("/login");

  if (validateEmail(email)) {
    const query = await updateEmail(userId, email);
    console.log(query, 'hello2')

    if ("error" in query) {
      console.log("error af");
      return badRequest({
        fields: null,
        formError: query.error,
      });
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
