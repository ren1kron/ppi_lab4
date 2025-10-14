import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItemButton, ListItemText, Select, MenuItem } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import RoleBadge from "@components/RoleBadge";
import { Role } from "../types";

const menu = [
    { to: "/", text: "Дашборд", icon: "📊" },
    { to: "/tickets", text: "Тикеты", icon: "🎫" },
    { to: "/candidates", text: "Кандидаты", icon: "👤" },
    { to: "/reboot", text: "Перезагрузка", icon: "🔄" },
    { to: "/orphans", text: "Программы-Сироты", icon: "👶" },
    { to: "/reports", text: "Отчёты", icon: "📈" }
];

export default function MainLayout({
                                       role, setRole, children
                                   }: { role: Role; setRole: (r: Role) => void; children: React.ReactNode }) {
    const location = useLocation();

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Фоновые эффекты */}
            <div className="matrix-bg" />
            <div className="digital-rain" />

            <AppBar position="fixed" elevation={0}>
                <Toolbar sx={{ gap: 2, py: 1 }}>
                    <Typography variant="h6" sx={{ flex: 1, fontFamily: "'Courier New', monospace" }}>
                        🌀 The Matrix Control
                    </Typography>
                    <RoleBadge role={role} />
                    <Select
                        size="small"
                        value={role}
                        onChange={e => setRole(e.target.value as Role)}
                        sx={{
                            color: "inherit",
                            "& .MuiSelect-icon": { color: "#00ff41" },
                            minWidth: 120
                        }}
                    >
                        {(["ARCHITECT","KERNEL","MONITOR","AGENT_SMITH","ORACLE","KEYMAKER","SENTINEL_CTRL","MECHANIC"] as Role[])
                            .map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                    </Select>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" sx={{
                [`& .MuiDrawer-paper`]: {
                    width: 260,
                    mt: 8,
                    background: "linear-gradient(180deg, #001a00 0%, #000d00 100%) !important"
                }
            }}>
                <List sx={{ py: 2 }}>
                    {menu.map(m => (
                        <ListItemButton
                            key={m.to}
                            selected={location.pathname === m.to}
                            component={Link}
                            to={m.to}
                            sx={{
                                mx: 1,
                                mb: 0.5,
                                borderRadius: 2,
                                "&.Mui-selected": {
                                    background: "linear-gradient(90deg, #00ff41 0%, rgba(0, 255, 65, 0.3) 100%)",
                                    color: "#000",
                                    fontWeight: 600,
                                    boxShadow: "0 2px 10px rgba(0, 255, 65, 0.3)"
                                }
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <span>{m.icon}</span>
                                        <span>{m.text}</span>
                                    </Box>
                                }
                                primaryTypographyProps={{
                                    fontFamily: "'Segoe UI', sans-serif",
                                    fontWeight: location.pathname === m.to ? 600 : 400
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flex: 1,
                    p: 3,
                    mt: 8,
                    ml: "260px",
                    background: "transparent",
                    position: "relative"
                }}
            >
                {children}
            </Box>
        </Box>
    );
}