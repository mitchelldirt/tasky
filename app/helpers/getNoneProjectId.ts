import { getUserId } from "~/session.server";

export async function getNoneProjectId(request: Request) {
  const userId = await getUserId(request);
}