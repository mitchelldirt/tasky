import { Form, Link } from "@remix-run/react";

export default function ChangePassword() {
  return (
    <>
      <Form className="w-3/4" method="patch">
        <h2 className="text-bold border-t-2 border-green-200 pt-4 text-center text-2xl">
          Update Password
        </h2>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">New</span>
          </label>
          <input
            type="text"
            placeholder="Type new password here"
            className="input-bordered input w-full max-w-xs"
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Confirm</span>
          </label>
          <input
            type="text"
            placeholder="Confirm new password here"
            className="input-bordered input w-full max-w-xs"
          />
        </div>

        <div className="mt-4 flex flex-row justify-evenly">
          <Link to={'/profile'}>
          <button className="btn-error btn">Cancel</button>
          </Link>
          <button className="btn-success btn">Save</button>
        </div>
      </Form>
    </>
  );
}
