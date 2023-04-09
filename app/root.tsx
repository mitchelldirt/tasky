import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { getAllTasks } from "./models/task.server";
import { useEffect, useRef, useState } from "react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  if (!user) {
    return json({
      user: await getUser(request),
    });
  }

  return json({
    user: user,
    userTasks: await getAllTasks({ userId: user.id }),
  });
}

export default function App() {
  const data = useLoaderData();

  const toast = useRef<HTMLDivElement>(null);

  const [totalTasks, setTotalTasks] = useState(data.userTasks.length);

  useEffect(() => {
    if (data.userTasks.length > totalTasks) {
      console.log(toast);
      if (toast.current) {
        console.log(toast.current);
        toast.current.classList.remove("animate-slide-up");
        toast.current.classList.remove("hidden");
        void toast.current.offsetWidth;
        toast.current.classList.add("animate-slide-up");
      }
    }
    setTotalTasks(data.userTasks.length);
  }, [data.userTasks, totalTasks]);

  return (
    <html lang="en" className="h-full bg-black">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <script
          async
          src={"https://cdn.jsdelivr.net/npm/tw-elements/dist/js/index.min.js"}
        />
        <div
          ref={toast}
          className="toast-center toast toast-top absolute left-1/2 hidden w-3/4 animate-slide-up px-0 sm:w-1/3 lg:w-1/4"
        >
          <div className="alert alert-info w-full bg-green-200">
            <div className="w-full">
              <span className="w-full text-center">New task created! 🎉</span>
            </div>
          </div>
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
