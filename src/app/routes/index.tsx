import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { useTranslation } from "react-i18next";
import { Root } from "@/shared/components/layout/Root";
import { Home } from "@/features/home/pages/Home";
import { LoginPage } from "@/features/admin/auth/LoginPage";
import { ProtectedRoute } from "@/features/admin/auth/ProtectedRoute";
import { AdminLayout } from "@/features/admin/dashboard/AdminLayout";
import { DashboardPage } from "@/features/admin/dashboard/DashboardPage";
import { PendingMemoriesPage } from "@/features/admin/memories/PendingMemoriesPage";
import { MartyrsManagementPage } from "@/features/admin/martyrs/MartyrsManagementPage";
import { MartyrFormPage } from "@/features/admin/martyrs/MartyrFormPage";

// Lazy load heavy routes
const About = lazy(() => import("@/features/core/pages/About").then(m => ({ default: m.About })));
const WorkWithUs = lazy(() => import("@/features/core/pages/WorkWithUs").then(m => ({ default: m.WorkWithUs })));
const MartyrsList = lazy(() => import("@/features/martyrs/pages/MartyrsList").then(m => ({ default: m.MartyrsList })));
const MartyrDetail = lazy(() => import("@/features/martyrs/pages/MartyrDetail").then(m => ({ default: m.MartyrDetail })));
const ShareMemory = lazy(() => import("@/features/memories/pages/ShareMemory").then(m => ({ default: m.ShareMemory })));
const NotFound = lazy(() => import("@/features/core/components/NotFound").then(m => ({ default: m.NotFound })));

// Loading fallback component
function PageLoader() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-border border-t-foreground animate-spin mx-auto mb-4"></div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t('loading')}</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { 
        path: "about", 
        element: <Suspense fallback={<PageLoader />}><About /></Suspense>
      },
      { 
        path: "work", 
        element: <Suspense fallback={<PageLoader />}><WorkWithUs /></Suspense>
      },
      { 
        path: "martyrs", 
        element: <Suspense fallback={<PageLoader />}><MartyrsList /></Suspense>
      },
      { 
        path: "martyrs/:id", 
        element: <Suspense fallback={<PageLoader />}><MartyrDetail /></Suspense>
      },
      { 
        path: "share", 
        element: <Suspense fallback={<PageLoader />}><ShareMemory /></Suspense>
      },
      { 
        path: "*", 
        element: <Suspense fallback={<PageLoader />}><NotFound /></Suspense>
      },
    ],
  },
  {
    path: "/admin/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { 
        path: "martyrs", 
        element: <MartyrsManagementPage />
      },
      {
        path: "martyrs/new",
        element: <MartyrFormPage />
      },
      {
        path: "martyrs/:id/edit",
        element: <MartyrFormPage />
      },
      { 
        path: "memories", 
        element: <PendingMemoriesPage />
      },
    ],
  },
]);
