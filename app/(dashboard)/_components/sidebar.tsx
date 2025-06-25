import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6 flex items-center"> {/* Use flex to align logo and text */}
        <Logo />
        <span className="ml-2 text-xl font-semibold text-gray-700">Learnify</span> {/* Add the website name */}
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
