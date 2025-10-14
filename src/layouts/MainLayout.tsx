import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItemButton, ListItemText, Select, MenuItem } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import RoleBadge from "@components/RoleBadge";
import { Role } from "../types";

const menu = [
  { to: "/", text: "Дашборд" },
  { to: "/tickets", text: "Тикеты" },
  { to: "/candidates", text: "Кандидаты" },
  { to: "/reboot", text: "Перезагрузка" },
  { to: "/orphans", text: "Программы-Сироты" },
  { to: "/reports", text: "Отчёты" }
];

export default function MainLayout({
  role, setRole, children
}: { role: Role; setRole: (r: Role) => void; children: React.ReactNode }) {
  const location = useLocation();
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>The Matrix</Typography>
          <RoleBadge role={role} />
          <Select size="small" value={role} onChange={e => setRole(e.target.value as Role)} sx={{ color: "inherit" }}>
            {(["ARCHITECT","KERNEL","MONITOR","AGENT_SMITH","ORACLE","KEYMAKER","SENTINEL_CTRL","MECHANIC"] as Role[])
              .map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ [`& .MuiDrawer-paper`]: { width: 240, mt: 8 } }}>
        <List>
          {menu.map(m => (
            <ListItemButton key={m.to} selected={location.pathname === m.to} component={Link} to={m.to}>
              <ListItemText primary={m.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flex: 1, p: 3, mt: 8, ml: "240px" }}>{children}</Box>
    </Box>
  );
}
