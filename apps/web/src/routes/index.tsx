import { createFileRoute, useNavigate } from "@tanstack/react-router";

const navigate = useNavigate();

export const Route = createFileRoute("/")({
  component: () => {
    navigate({ to: "/register" });
  },
});
