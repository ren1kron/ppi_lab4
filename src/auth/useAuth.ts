import { useState } from "react";
import { Role } from "../types";

// очень простой "логин по роли" для демо
export function useAuthState() {
  const [role, setRole] = useState<Role>("MONITOR");
  return { role, setRole };
}
