import { redirect } from "next/navigation";

export default function Home() {
  redirect("/financial-intake/step-1");
}