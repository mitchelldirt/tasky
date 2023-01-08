import { Form, Link, useActionData, useCatch } from "@remix-run/react";
import { badRequest, validateEmail } from "~/utils";

import { ActionArgs, redirect } from "@remix-run/node";

export default function ChangeEmail() {
  const data = useActionData<typeof action>();

  return (
    <>
      <Form className="w-3/4" method="patch">
        <h2 className="text-bold border-t-2 border-green-200 pt-4 text-center text-2xl">
          Update Email Address
        </h2>
        <div>
        {data ? (
            <p className="form-validation-error text-red-500" role="alert">
              {data.formError}
            </p>
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

        <div className="mt-4 flex flex-row justify-evenly">
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
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  // if (email !== confirmEmail)

  console.log(email, confirmEmail);
  return redirect(`/profile`)
}

// email already exists
// export function CatchBoundary() {
//   const caught = useCatch();
// }
