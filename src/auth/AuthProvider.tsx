import { useState } from "react";
import type { Role } from "../types";
import { AuthCtx } from "./auth-context";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("MONITOR");
  return <AuthCtx.Provider value={{ role, setRole }}>{children}</AuthCtx.Provider>;
}
