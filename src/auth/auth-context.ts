import { createContext } from "react";
import type { Role } from "../types";

export type AuthState = { role: Role; setRole: (r: Role) => void };

// Не экспортируем никакие компоненты отсюда
export const AuthCtx = createContext<AuthState | null>(null);
