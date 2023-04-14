import empty from "~/assets/undraw_empty_street_re_atjq.svg";

export default function NoProjects() {
  return (
    <div className="flex h-full w-fit flex-col items-center justify-center">
      <img src={empty} alt="Empty street" className="my-6 w-3/4 sm:w-1/2" />
      <h2 className="my-4 text-lg font-bold text-white sm:text-2xl">
        No Projects
      </h2>
      <p className="text-bold text-md text-white sm:text-xl">
        Create a project to organize your tasks
      </p>
    </div>
  );
}
