import { createFileRoute, redirect } from "@tanstack/react-router";
import { Header } from "./-components/header";
import { Content } from "./-components/content";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/_dashboard/dashboard")({
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-16 w-full min-h-screen bg-background relative px-24 py-12">
      <Header />
      <Content />
    </div>
  );
}
