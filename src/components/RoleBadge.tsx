import { Chip } from "@mui/material";
import { Role } from "../types";

const labels: Record<Role, string> = {
  ARCHITECT: "Архитектор",
  KERNEL: "Системное Ядро",
  MONITOR: "Смотритель",
  AGENT_SMITH: "Агент Смит",
  ORACLE: "Оракул",
  KEYMAKER: "Хранитель",
  SENTINEL_CTRL: "Контроллер Сентинелей",
  MECHANIC: "Механик"
};

export default function RoleBadge({ role }: { role: Role }) {
  return <Chip size="small" label={labels[role]} variant="outlined" />;
}
