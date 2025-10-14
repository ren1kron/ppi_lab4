import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import MainLayout from "@layouts/MainLayout";
import AuthProvider from "@auth/AuthProvider";

export default function App() {
  const content = useRoutes(routes);
  return (
    <AuthProvider>
      <MainLayout>{content}</MainLayout>
    </AuthProvider>
  );
}
