// MainLayout.tsx
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Button,
    IconButton,
    Fade
} from "@mui/material";
import { ExitToApp as LogoutIcon } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RoleBadge from "@components/RoleBadge";
import { useAuth } from "@auth/useAuth";
import { appRoutes } from "../routes";
import { useEffect } from "react";
import { MatrixBackground } from "@components/MatrixBackground";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (!user) return;

        // Проверяем доступность текущего пути
        const availableRoutes = appRoutes.filter(r => r.roles.includes(user.role));
        const isCurrentPathAvailable = availableRoutes.some(route =>
            location.pathname === route.path || location.pathname === '/'
        );

        // Если путь недоступен и есть доступные маршруты - редирект
        if (!isCurrentPathAvailable && availableRoutes.length > 0) {
            navigate(availableRoutes[0].path, { replace: true });
        }
    }, [user, location.pathname, navigate]);

    if (!user) {
        return null;
    }

    const visibleMenu = appRoutes.filter(r => r.roles.includes(user.role));
    const shouldShowSidebar = visibleMenu.length > 1;

    return (
        <Box sx={{ display: "flex", minHeight: '100vh' }}>
            {/* Matrix Background Effect */}
            <MatrixBackground />

            <AppBar
                position="fixed"
                sx={{
                    background: "linear-gradient(90deg, #001a00 0%, #003300 100%)",
                    borderBottom: "2px solid #00ff41",
                    boxShadow: "0 0 30px rgba(0, 255, 65, 0.5)",
                    backdropFilter: "blur(10px)"
                }}
            >
                <Toolbar sx={{ gap: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            flex: 1,
                            fontFamily: "'Orbitron', sans-serif",
                            fontWeight: 700,
                            letterSpacing: '0.1em'
                        }}
                    >
                        MATRIX CONTROL
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "inherit",
                            fontFamily: "'Share Tech Mono', monospace"
                        }}
                    >
                        {user.username}
                    </Typography>
                    <RoleBadge role={user.role} />
                    <IconButton
                        color="inherit"
                        onClick={logout}
                        title="Выйти из системы"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(0, 255, 65, 0.1)'
                            }
                        }}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {shouldShowSidebar && (
                <Fade in timeout={800}>
                    <Drawer
                        variant="permanent"
                        sx={{
                            [`& .MuiDrawer-paper`]: {
                                width: 240,
                                mt: 8,
                                background: "linear-gradient(180deg, #001a00 0%, #000d00 100%)",
                                borderRight: "2px solid #00ff41",
                                boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)",
                                backdropFilter: "blur(10px)"
                            }
                        }}
                    >
                        <List>
                            {visibleMenu.map(m => (
                                <ListItemButton
                                    key={m.path}
                                    selected={location.pathname === m.path}
                                    component={Link}
                                    to={m.path}
                                    sx={{
                                        borderLeft: '3px solid transparent',
                                        margin: '2px 8px',
                                        borderRadius: '4px',
                                        fontFamily: "'Rajdhani', sans-serif",
                                        fontWeight: 600,
                                        '&.Mui-selected': {
                                            background: "linear-gradient(90deg, rgba(0, 255, 65, 0.2) 0%, rgba(0, 255, 65, 0.1) 100%)",
                                            color: "#00ff41",
                                            borderLeft: "3px solid #00ff41",
                                            '&::before': {
                                                content: '">"',
                                                position: "absolute",
                                                left: "8px",
                                                color: "#00ff41",
                                                fontWeight: "bold"
                                            }
                                        },
                                        '&:hover': {
                                            background: "rgba(0, 255, 65, 0.1)",
                                            borderLeft: "3px solid #00ff41"
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={m.label}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                fontFamily: "'Rajdhani', sans-serif",
                                                fontWeight: 600
                                            }
                                        }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Drawer>
                </Fade>
            )}

            <Box
                component="main"
                sx={{
                    flex: 1,
                    p: 3,
                    mt: 8,
                    ml: shouldShowSidebar ? "240px" : 0,
                    transition: 'margin-left 0.3s ease',
                    minHeight: 'calc(100vh - 64px)',
                    position: 'relative'
                }}
            >
                {children}
            </Box>
        </Box>
    );
}