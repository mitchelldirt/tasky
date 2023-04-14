import type {
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
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
import { grabCookieValue } from "./helpers/cookies";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: V2_MetaFunction = () => {
  return [{ title: "Tasky" }];
};

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

  const [totalTasks, setTotalTasks] = useState(10000000000000);

  // set the timezone cookie
  useEffect(() => {
    // if the document exists, set a cookie
    if (typeof document !== "undefined") {
      const isTzCookieSet = document.cookie.includes("tz");
      const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (isTzCookieSet === true) {
        // @ts-ignore
        const tzCookie = grabCookieValue("tz", document.cookie);
        if (tzCookie === currentTz) {
          return;
        } else {
          document.cookie = `tz=${currentTz}`;
          window.location.reload();
        }
      }

      if (isTzCookieSet === false) {
        document.cookie = `tz=${currentTz}`;
        window.location.reload();
      }
    }
  }, []);

  useEffect(() => {
    if (data.userTasks && data.userTasks.hasOwnProperty("length")) {
      setTotalTasks(data.userTasks.length);
      if (totalTasks && data.userTasks.length > totalTasks) {
        if (toast.current) {
          console.log(toast.current);
          toast.current.classList.remove("animate-slide-up");
          toast.current.classList.remove("hidden");
          void toast.current.offsetWidth;
          toast.current.classList.add("animate-slide-up");
        }
      }
    }
  }, [data.userTasks, totalTasks]);

  return (
    <html lang="en" className="h-full bg-black">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
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
