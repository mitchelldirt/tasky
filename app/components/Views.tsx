import { Link } from "@remix-run/react";

export default function ViewsMenu() {
  return (
    <div className="mb-6 flex flex-col">
      <Link
        to={"/project/filteredView/all"}
        className="btn-wide btn justify-start rounded-b-none border-0 border-b-2 border-slate-400 text-white hover:border-slate-200"
      >
        <div className="flex flex-row items-center justify-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-purple-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>

          <p className="text-white">All Tasks</p>
        </div>
      </Link>
      <Link
        to={`/project/filteredView/today`}
        className="btn-wide btn justify-start rounded-none border-0 border-b-2 border-slate-400 hover:border-slate-200"
      >
        <div className="flex flex-row items-center justify-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-yellow-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
          <p className="text-white">Today's Tasks</p>
        </div>
      </Link>
      <Link
        to={"/project/filteredView/completed"}
        className="btn-wide btn justify-start rounded-t-none border-0 text-white hover:border-b-2 hover:border-slate-200"
      >
        <div className="flex flex-row items-center justify-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-green-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <p className="text-white">Completed Tasks</p>
        </div>
      </Link>
    </div>
  );
}
