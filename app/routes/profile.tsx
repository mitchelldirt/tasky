import { Link, Form, useLoaderData } from "@remix-run/react";
import { getUserById } from "~/models/user.server";
import {getUserId} from '~/session.server'

import type { LoaderArgs } from "@remix-run/node";

export async function loader({request}: LoaderArgs) {
const userId = await getUserId(request);

if (typeof userId !== 'string') {
throw new Response()
}
const user = await getUserById(userId);
return user
}

export default function Profile() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
    <Link className="absolute top-4 left-4 text-green-400" to={'/home'}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
</svg>
    </Link>


    <main className="w-full h-full flex flex-col justify-center items-center text-3xl font-bold">
      <h1>Profile</h1>
      <Form method="post">
      
      </Form>
    </main>
    </>
  )
}