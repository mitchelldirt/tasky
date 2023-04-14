import relaxation from "~/assets/undraw_relaxation_re_ohkx.svg";

export default function NoTasks() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <p className="my-4 text-lg font-bold text-white sm:text-2xl">
        Woo hoo you completed all of your tasks!
      </p>
      <img
        src={relaxation}
        alt="Relaxation"
        className="w-3/4 md:w-3/4 lg:w-1/2"
      />
    </div>
  );
}
