import { Role } from "../types";
import { useAuth } from "@auth/useAuth";

export default function RoleGate({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const { role } = useAuth();
  if (!allow.includes(role)) return null; // можно вернуть 403/NotFound, но скрыть — ок
  return <>{children}</>;
}
