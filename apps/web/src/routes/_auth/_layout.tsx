import { createFileRoute, Outlet } from "@tanstack/react-router";
import background from "@/assets/images/Login_Background.png";

export const Route = createFileRoute("/_auth/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative md:min-h-screen grid grid-cols-2 md:grid-cols-2">
      <img
        className="absolute w-full h-full inset-0 object-cover z-[-1]"
        src={background}
      />

      <div className=" md:col-start-2 col-span-2 mt-8 md:mt-3 z-10">
        <div className="bg-background p-8 h-full w-full flex flex-col justify-center items-center rounded-tr-2xl md:rounded-tr-none rounded-tl-2xl ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
