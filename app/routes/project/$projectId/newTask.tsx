import { useActionData } from "@remix-run/react";
import NewProjectModal from "~/routes/home/newProject";


export default function NewTask() {
  const data = useActionData<typeof action>();
  <NewProjectModal />
}