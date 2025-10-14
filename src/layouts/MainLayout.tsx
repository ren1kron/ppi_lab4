import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItemButton, ListItemText, Button, IconButton } from "@mui/material";
import { ExitToApp as LogoutIcon } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import RoleBadge from "@components/RoleBadge";
import { useAuth } from "@auth/useAuth";
import { appRoutes } from "../routes";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) {
    return null; // Не должно произойти, так как этот компонент рендерится только для авторизованных пользователей
  }

  const visibleMenu = appRoutes.filter(r => r.roles.includes(user.role));

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>The Matrix</Typography>
          <Typography variant="body2" sx={{ color: "inherit" }}>
            {user.username}
          </Typography>
          <RoleBadge role={user.role} />
          <IconButton 
            color="inherit" 
            onClick={logout}
            title="Выйти из системы"
          >
            <LogoutIcon />
          </IconButton>
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
