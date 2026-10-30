import { createFileRoute } from "@tanstack/react-router";
import { PermitApp } from "@/components/permit/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <PermitApp />;
}
