import { Link } from "@remix-run/react";

type SearchNavBarProps = {
  previousRoute: string;
};

export default function SearchNavBar({ previousRoute }: SearchNavBarProps) {
  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link
          className="absolute top-4 left-4 text-green-400"
          to={previousRoute.includes("/search") ? `/home` : previousRoute}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
