import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItemButton, ListItemText, Select, MenuItem } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import RoleBadge from "@components/RoleBadge";
import { Role } from "../types";
import { useAuth } from "@auth/useAuth";
import { appRoutes } from "../routes";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { role, setRole } = useAuth();

  const visibleMenu = appRoutes.filter(r => r.roles.includes(role));

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
          {visibleMenu.map(m => (
            <ListItemButton key={m.path} selected={location.pathname === m.path} component={Link} to={m.path}>
              <ListItemText primary={m.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flex: 1, p: 3, mt: 8, ml: "240px" }}>{children}</Box>
    </Box>
  );
}
