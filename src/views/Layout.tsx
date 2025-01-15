import { Outlet, NavLink } from "react-router";
import { Button } from "@/components/ui/button";

const Layout = () => {
  return (
    <>
      <header className="p-4 bg-zinc-900 text-zinc-50 flex flex-wrap items-center justify-between">
        <div>
          <img src="/tauri.svg" alt="logo" className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-2xl">Facevote V2</h1>
        </div>
        <div>
          <NavLink to={"/"}>
            <Button variant={"secondary"}>Home</Button>
          </NavLink>
        </div>
      </header>
      <section className="bg-zinc-800 text-zinc-50">
        <Outlet />
      </section>
    </>
  );
};

export default Layout;
