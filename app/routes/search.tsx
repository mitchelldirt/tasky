import { Outlet, useLoaderData } from "@remix-run/react";
import SearchNavBar from "~/components/SearchNavBar";

import { redirect } from "@remix-run/server-runtime";
import { getAllTasks } from "~/models/task.server";
import { getUserId } from "~/session.server";
import { useEffect, useState } from "react";
import Tasks from "~/components/Tasks";

import type { Task } from "~/models/task.server";
import type { LoaderArgs } from "@remix-run/server-runtime";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");

  const allTasks = await getAllTasks({ userId: userId });
  let previousRoute = request.headers.get("Referer");
  let relativePath = previousRoute?.slice(previousRoute.indexOf("/", 8));

  return {
    previousRoute: relativePath,
    allTasks: allTasks,
  };
}

export default function Search() {
  const data = useLoaderData();
  const previousRoute = data.previousRoute;

  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // This function will be executed whenever `count` changes
    handleSearch();
  }, [data.allTasks]);

  function handleSearch(query: string = searchQuery) {
    setSearchQuery(query);
    if (query.length === 0) {
      setTasks([]);
      return;
    }
    const filteredTasks = data.allTasks.filter((task: Task) => {
      return (
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description?.toLowerCase().includes(query.toLowerCase())
      );
    });
    setTasks(filteredTasks);
  }

  return (
    <>
      <SearchNavBar previousRoute={previousRoute} />
      <div className="flex w-full flex-col items-center">
        <input
          type="text"
          name="search"
          placeholder="Search"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          className="input-bordered mb-4 w-3/4 rounded-md border border-gray-300 py-2 px-4 placeholder:text-white hover:border-green-400 focus:border-green-400 focus:outline-green-400"
        />
        <Outlet />
        <Tasks tasks={tasks} displayProject={true} />
      </div>
    </>
  );
}
