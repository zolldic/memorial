import { createBrowserRouter } from "react-router";
import { Root } from "@/shared/components/layout/Root";
import { Home } from "@/features/home/pages/Home";
import { SearchResults } from "@/features/search/pages/SearchResults";
import { About } from "@/features/core/pages/About";
import { WorkWithUs } from "@/features/core/pages/WorkWithUs";
import { MartyrsList } from "@/features/martyrs/pages/MartyrsList";
import { MartyrDetail } from "@/features/martyrs/pages/MartyrDetail";
import { ShareMemory } from "@/features/memories/pages/ShareMemory";
import { NotFound } from "@/features/core/components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "search", Component: SearchResults },
      { path: "about", Component: About },
      { path: "work", Component: WorkWithUs },
      { path: "martyrs", Component: MartyrsList },
      { path: "martyrs/:id", Component: MartyrDetail },
      { path: "share", Component: ShareMemory },
      { path: "*", Component: NotFound },
    ],
  },
]);
