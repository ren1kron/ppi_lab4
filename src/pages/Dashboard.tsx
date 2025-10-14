import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography,
  Stack,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Fade
} from "@mui/material";
import Field from "@components/Field";
import { useEffect, useState } from "react";
import { getSummary, kernelDetectGlitch, kernelDetectCandidate } from "@api/client";
import type { AppSummary } from "../types";
import { useAuth } from "@auth/useAuth";
import { has } from "@auth/permissions";
import { BugReport, Person, Code, Warning, CheckCircle, Error as ErrorIcon } from "@mui/icons-material";

export default function Dashboard() {
  const { role } = useAuth();
  const [s, setS] = useState<AppSummary | null>(null);
  const [title, setTitle] = useState("Глитч текстуры");
  const [desc, setDesc] = useState("Рябь стен");
  const [mass, setMass] = useState(false);
  const [candName, setCandName] = useState("Subject XYZ-777");
  const [dissent, setDissent] = useState(8.6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const summary = await getSummary();
        setS(summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки сводки');
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  const handleCreateGlitch = async () => {
    try {
      await kernelDetectGlitch({ title, description: desc, massImpact: mass });
      setSuccess(`Глитч "${title}" успешно зафиксирован`);
      setTitle("Глитч текстуры");
      setDesc("Рябь стен");
      setMass(false);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания глитча');
    }
  };

  const handleCreateCandidate = async () => {
    try {
      await kernelDetectCandidate(candName, dissent);
      setSuccess(`Кандидат "${candName}" добавлен в систему`);
      setCandName("Subject XYZ-777");
      setDissent(8.6);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания кандидата');
    }
  };

  if (loading) {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
            sx={{
              background: "linear-gradient(45deg, rgba(10,10,10,0.9) 0%, rgba(26,26,26,0.9) 100%)",
              borderRadius: 2,
              border: "1px solid rgba(0, 255, 65, 0.3)"
            }}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress
                size={60}
                thickness={4}
                sx={{
                  color: '#00ff41',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  }
                }}
            />
            <Typography
                variant="h6"
                sx={{
                  color: '#00ff41',
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: '0.1em'
                }}
            >
              ЗАГРУЗКА СИСТЕМЫ...
            </Typography>
          </Stack>
        </Box>
    );
  }

  return (
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Matrix Background Effect */}
        <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
            linear-gradient(45deg, rgba(10,10,10,0.95) 0%, rgba(26,26,26,0.95) 100%),
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="matrix" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><text x="0" y="15" fill="rgba(0,255,65,0.03)" font-family="monospace" font-size="12">01</text></pattern></defs><rect width="100" height="100" fill="url(%23matrix)"/></svg>')
          `,
              opacity: 0.4,
              zIndex: -1,
              animation: "matrixScroll 20s linear infinite"
            }}
        />

        <Box mb={4}>
          <Fade in timeout={800}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 900,
                  background: "linear-gradient(90deg, #00ff41, #00e5ff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  textAlign: 'center',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textShadow: '0 0 30px rgba(0, 255, 65, 0.5)'
                }}
            >
              СИСТЕМНЫЙ МОНИТОР
            </Typography>
          </Fade>
          <Fade in timeout={1000}>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  textAlign: 'center',
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: '0.1em'
                }}
            >
              МАТРИЦА :: ПАНЕЛЬ УПРАВЛЕНИЯ
            </Typography>
          </Fade>
        </Box>

        {error && (
            <Fade in timeout={500}>
              <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    border: '2px solid #ff1744',
                    background: 'linear-gradient(45deg, rgba(211, 47, 47, 0.1) 0%, rgba(244, 67, 54, 0.1) 100%)',
                    fontFamily: "'Share Tech Mono', monospace",
                    '& .MuiAlert-icon': {
                      color: '#ff5252'
                    }
                  }}
                  icon={<ErrorIcon />}
              >
                <Typography variant="subtitle2" gutterBottom>
                  СИСТЕМНАЯ ОШИБКА
                </Typography>
                {error}
              </Alert>
            </Fade>
        )}

        {success && (
            <Fade in timeout={500}>
              <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    border: '2px solid #00ff41',
                    background: 'linear-gradient(45deg, rgba(0, 200, 83, 0.1) 0%, rgba(0, 255, 65, 0.1) 100%)',
                    fontFamily: "'Share Tech Mono', monospace",
                    '& .MuiAlert-icon': {
                      color: '#66ff66'
                    }
                  }}
                  icon={<CheckCircle />}
              >
                <Typography variant="subtitle2" gutterBottom>
                  ОПЕРАЦИЯ УСПЕШНА
                </Typography>
                {success}
              </Alert>
            </Fade>
        )}

        <Grid container spacing={3}>
          {(has(role, "VIEW_DASHBOARD")) && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Fade in timeout={1200}>
                  <Card
                      sx={{
                        height: '100%',
                        background: "linear-gradient(145deg, rgba(26,26,26,0.9) 0%, rgba(42,42,42,0.9) 100%)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(0, 255, 65, 0.3)",
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, #00ff41, transparent)',
                          animation: 'scanLine 3s linear infinite'
                        },
                        '&:hover': {
                          borderColor: '#00ff41',
                          boxShadow: '0 8px 30px rgba(0, 255, 65, 0.3)',
                          transform: 'translateY(-4px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                      className="glitch-effect"
                  >
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <Warning sx={{ color: '#00e5ff', fontSize: 28 }} />
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              fontFamily: "'Rajdhani', sans-serif",
                              fontWeight: 600,
                              color: '#00e5ff',
                              letterSpacing: '0.05em'
                            }}
                        >
                          СВОДКА СИСТЕМЫ
                        </Typography>
                      </Stack>

                      <Divider
                          sx={{
                            my: 2,
                            borderColor: 'rgba(0, 255, 65, 0.3)',
                            borderWidth: '1px'
                          }}
                      />

                      <Stack spacing={3}>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontFamily: "'Share Tech Mono', monospace" }}
                            >
                              АКТИВНЫЕ ИНЦИДЕНТЫ
                            </Typography>
                            <BugReport sx={{ color: '#00ff41', fontSize: 20 }} />
                          </Stack>
                          <Typography
                              variant="h3"
                              color="primary"
                              sx={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontWeight: 700,
                                textShadow: '0 0 20px rgba(0, 255, 65, 0.5)'
                              }}
                          >
                            {s?.openIncidents ?? "0"}
                          </Typography>
                        </Box>

                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontFamily: "'Share Tech Mono', monospace" }}
                            >
                              КАНДИДАТЫ
                            </Typography>
                            <Person sx={{ color: '#00e5ff', fontSize: 20 }} />
                          </Stack>
                          <Typography
                              variant="h3"
                              color="secondary"
                              sx={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontWeight: 700,
                                textShadow: '0 0 20px rgba(0, 229, 255, 0.5)'
                              }}
                          >
                            {s?.candidates ?? "0"}
                          </Typography>
                        </Box>

                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontFamily: "'Share Tech Mono', monospace" }}
                            >
                              ПРОГРАММЫ-СИРОТЫ
                            </Typography>
                            <Code sx={{ color: '#ff9100', fontSize: 20 }} />
                          </Stack>
                          <Typography
                              variant="h3"
                              color="warning.main"
                              sx={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontWeight: 700,
                                textShadow: '0 0 20px rgba(255, 145, 0, 0.5)'
                              }}
                          >
                            {s?.orphanPrograms ?? "0"}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
          )}

          {has(role, "KERNEL_CREATE_GLITCH") && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Fade in timeout={1400}>
                  <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: "linear-gradient(145deg, rgba(26,26,26,0.9) 0%, rgba(42,42,42,0.9) 100%)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(0, 255, 65, 0.3)",
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, #00ff41, transparent)',
                          animation: 'scanLine 3s linear infinite'
                        }
                      }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <BugReport sx={{ color: '#00ff41', fontSize: 28 }} />
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              fontFamily: "'Rajdhani', sans-serif",
                              fontWeight: 600,
                              color: '#00ff41',
                              letterSpacing: '0.05em'
                            }}
                        >
                          ФИКСАЦИЯ ГЛИТЧА (UC-101)
                        </Typography>
                      </Stack>

                      <Divider
                          sx={{
                            my: 2,
                            borderColor: 'rgba(0, 255, 65, 0.3)',
                            borderWidth: '1px'
                          }}
                      />

                      <Stack spacing={2}>
                        <Field
                            label="ЗАГОЛОВОК"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            sx={{
                              '& .MuiInputLabel-root': {
                                fontFamily: "'Share Tech Mono', monospace",
                                color: '#00ff41'
                              }
                            }}
                        />
                        <Field
                            label="ОПИСАНИЕ"
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            multiline
                            rows={2}
                            sx={{
                              '& .MuiInputLabel-root': {
                                fontFamily: "'Share Tech Mono', monospace",
                                color: '#00ff41'
                              }
                            }}
                        />
                        <Box>
                          <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                              sx={{ fontFamily: "'Share Tech Mono', monospace" }}
                          >
                            МАССОВЫЙ ЭФФЕКТ
                          </Typography>
                          <Chip
                              label={mass ? "АКТИВЕН" : "НЕАКТИВЕН"}
                              color={mass ? "error" : "default"}
                              onClick={() => setMass(!mass)}
                              clickable
                              variant="outlined"
                              sx={{
                                fontFamily: "'Share Tech Mono', monospace",
                                fontWeight: 600,
                                borderWidth: '2px',
                                '&:hover': {
                                  boxShadow: '0 0 10px rgba(255, 23, 68, 0.3)'
                                }
                              }}
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                    <CardActions>
                      <Button
                          variant="contained"
                          fullWidth
                          onClick={handleCreateGlitch}
                          startIcon={<BugReport />}
                          sx={{
                            py: 1.5,
                            fontFamily: "'Rajdhani', sans-serif",
                            fontWeight: 700,
                            letterSpacing: '0.1em'
                          }}
                      >
                        СОЗДАТЬ ТИКЕТ
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
          )}

          {has(role, "KERNEL_DETECT_CANDIDATE") && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Fade in timeout={1600}>
                  <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: "linear-gradient(145deg, rgba(26,26,26,0.9) 0%, rgba(42,42,42,0.9) 100%)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(0, 255, 65, 0.3)",
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, #00ff41, transparent)',
                          animation: 'scanLine 3s linear infinite'
                        }
                      }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <Person sx={{ color: '#00e5ff', fontSize: 28 }} />
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              fontFamily: "'Rajdhani', sans-serif",
                              fontWeight: 600,
                              color: '#00e5ff',
                              letterSpacing: '0.05em'
                            }}
                        >
                          ОБНАРУЖЕНИЕ КАНДИДАТА (UC-201)
                        </Typography>
                      </Stack>

                      <Divider
                          sx={{
                            my: 2,
                            borderColor: 'rgba(0, 255, 65, 0.3)',
                            borderWidth: '1px'
                          }}
                      />

                      <Stack spacing={2}>
                        <Field
                            label="ИДЕНТИФИКАТОР"
                            value={candName}
                            onChange={e => setCandName(e.target.value)}
                            sx={{
                              '& .MuiInputLabel-root': {
                                fontFamily: "'Share Tech Mono', monospace",
                                color: '#00e5ff'
                              }
                            }}
                        />
                        <Field
                            label="ИНДЕКС НЕСОГЛАСИЯ"
                            type="number"
                            value={dissent}
                            onChange={e => setDissent(Number(e.target.value))}
                            inputProps={{ min: 0, max: 10, step: 0.1 }}
                            sx={{
                              '& .MuiInputLabel-root': {
                                fontFamily: "'Share Tech Mono', monospace",
                                color: '#00e5ff'
                              }
                            }}
                        />
                        <Box>
                          <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                              sx={{ fontFamily: "'Share Tech Mono', monospace" }}
                          >
                            УРОВЕНЬ УГРОЗЫ
                          </Typography>
                          <Chip
                              label={dissent >= 9.5 ? "КРИТИЧЕСКИЙ" : dissent >= 7.0 ? "ВЫСОКИЙ" : "НИЗКИЙ"}
                              color={dissent >= 9.5 ? "error" : dissent >= 7.0 ? "warning" : "success"}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontFamily: "'Share Tech Mono', monospace",
                                fontWeight: 600,
                                borderWidth: '2px',
                                textTransform: 'uppercase'
                              }}
                          />
                          {dissent >= 9.5 && (
                              <Typography
                                  variant="caption"
                                  color="error"
                                  sx={{
                                    display: 'block',
                                    mt: 1,
                                    fontFamily: "'Share Tech Mono', monospace",
                                    fontWeight: 600
                                  }}
                              >
                                ⚠️ ТРЕБУЕТСЯ КАРАНТИН
                              </Typography>
                          )}
                        </Box>
                      </Stack>
                    </CardContent>
                    <CardActions>
                      <Button
                          variant="contained"
                          fullWidth
                          onClick={handleCreateCandidate}
                          startIcon={<Person />}
                          sx={{
                            py: 1.5,
                            fontFamily: "'Rajdhani', sans-serif",
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            background: dissent >= 9.5
                                ? 'linear-gradient(45deg, #ff1744 0%, #d32f2f 100%)'
                                : 'linear-gradient(45deg, #00e5ff 0%, #0099ff 100%)'
                          }}
                      >
                        {dissent >= 9.5 ? 'ЭКСТРЕННОЕ ДОСЬЕ' : 'СОЗДАТЬ ДОСЬЕ'}
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
          )}
        </Grid>

        {/* System Status Footer */}
        <Fade in timeout={2000}>
          <Box
              sx={{
                mt: 4,
                p: 2,
                background: 'rgba(0, 255, 65, 0.05)',
                border: '1px solid rgba(0, 255, 65, 0.2)',
                borderRadius: 1
              }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#00ff41',
                    animation: 'pulse 2s infinite'
                  }}
              />
              <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                СИСТЕМА АКТИВНА :: ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ: {new Date().toLocaleTimeString()}
              </Typography>
            </Stack>
          </Box>
        </Fade>
      </Box>
  );
}