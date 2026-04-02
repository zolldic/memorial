import { RouterProvider } from "react-router";
import { router } from "@/app/routes";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/i18n";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
