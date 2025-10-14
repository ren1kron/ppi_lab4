import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import MainLayout from "@layouts/MainLayout";
import { useAuthState } from "@auth/useAuth";

export default function App() {
  const { role, setRole } = useAuthState();
  const content = useRoutes(routes);
  return (
    <MainLayout role={role} setRole={setRole}>
      {content}
    </MainLayout>
  );
}
