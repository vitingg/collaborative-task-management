import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: () => {
    throw redirect({
      to: "/register",
    });
  },
});
