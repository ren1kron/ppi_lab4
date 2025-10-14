// src/pages/tickets/TicketsPage.tsx
import { useEffect, useState } from "react";
import {
  listTickets,
  monitorClassifyAndAssign,
  mechanicFix,
  agentComplete,
  escalateToArchitect,
  architectDecision,
  monitorClose,
  agentRequestReinforcement
} from "@api/client";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Paper
} from "@mui/material";
import SeverityChip from "@components/SeverityChip";
import StatusChip from "@components/StatusChip";
import type { Role, Severity, Ticket } from "../../types";
import { useAuth } from "@auth/useAuth";
import { has } from "@auth/permissions";

export default function TicketsPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  const [items, setItems] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [severity, setSeverity] = useState<Severity>(1);
  const [assignTo, setAssignTo] = useState<Role>("MECHANIC");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const reload = async () => {
    try {
      setLoading(true);
      setError(null);
      const tickets = await listTickets();
      setItems(tickets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки тикетов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    if (selected) {
      setSeverity(selected.severity);
      setAssignTo((selected.assigneeRole ?? "MECHANIC") as Role);
      setNote("");
    }
  }, [selected]);

  const filteredItems = items.filter(item =>
    filterStatus === "ALL" || item.status === filterStatus
  );

  const getStatusCounts = () => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item.status] = (counts[item.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Управление тикетами
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Мониторинг и обработка системных инцидентов
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Левая панель - список тикетов */}
        <Grid size={{ md: 5, xs: 12 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Тикеты ({filteredItems.length})</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Фильтр</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Фильтр"
                >
                  <MenuItem value="ALL">Все ({items.length})</MenuItem>
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <MenuItem key={status} value={status}>
                      {status} ({count})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={1}>
              {filteredItems.length === 0 && (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color="text.secondary">
                      {filterStatus === "ALL" ? "Тикетов нет" : `Нет тикетов со статусом "${filterStatus}"`}
                    </Typography>
                  </CardContent>
                </Card>
              )}
              {filteredItems.map((t) => (
                <Card
                  key={t.id}
                  onClick={() => setSelected(t)}
                  sx={{
                    cursor: "pointer",
                    border: selected?.id === t.id ? "2px solid #00e5ff" : "1px solid transparent",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      border: "1px solid #00e5ff",
                      boxShadow: 2
                    }
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {t.title}
                      </Typography>
                      <StatusChip status={t.status} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t.description}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SeverityChip s={t.severity} />
                      <Typography variant="caption" color="text.secondary">
                        Исполнитель: {t.assigneeRole ?? "—"}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Правая панель - детали тикета */}
        <Grid size={{ md: 7, xs: 12 }}>
          {selected ? (
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h2">
                    {selected.title}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <SeverityChip s={selected.severity} />
                    <StatusChip status={selected.status} />
                  </Stack>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {selected.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* UC-102 — классификация и назначение (MONITOR) */}
                {has(user.role, "TICKET_CLASSIFY") && (
                  <Box mb={3}>
                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      Классификация и назначение (UC-102)
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mb={2}>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Уровень</InputLabel>
                        <Select
                          value={severity}
                          onChange={(e) => setSeverity(Number(e.target.value) as Severity)}
                          label="Уровень"
                        >
                          <MenuItem value={1}>Уровень 1</MenuItem>
                          <MenuItem value={2}>Уровень 2</MenuItem>
                          <MenuItem value={3}>Уровень 3</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Назначить</InputLabel>
                        <Select
                          value={assignTo}
                          onChange={(e) => setAssignTo(e.target.value as Role)}
                          label="Назначить"
                        >
                          <MenuItem value="MECHANIC">Механику</MenuItem>
                          <MenuItem value="AGENT_SMITH">Агенту Смиту</MenuItem>
                        </Select>
                      </FormControl>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          monitorClassifyAndAssign(selected.id, severity, assignTo).then(reload)
                        }
                      >
                        Применить
                      </Button>
                    </Stack>
                  </Box>
                )}

                <TextField
                  fullWidth
                  label="Комментарий / Патч / Отчёт"
                  multiline
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Действия
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {/* UC-106 — эскалация Архитектору (MONITOR) */}
                  {has(user.role, "TICKET_ESCALATE") && (
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => escalateToArchitect(selected.id, note).then(reload)}
                    >
                      Эскалировать (UC-106)
                    </Button>
                  )}

                  {/* UC-107 — решение Архитектора (ARCHITECT) */}
                  {has(user.role, "TICKET_DECIDE") && (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => architectDecision(selected.id, "IGNORE", note).then(reload)}
                      >
                        Арх.: Игнор
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          architectDecision(selected.id, "ALLOCATE_RESOURCES", note).then(reload)
                        }
                      >
                        Арх.: Ресурсы
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => architectDecision(selected.id, "DELETE_SECTOR", note).then(reload)}
                      >
                        Арх.: Удалить сектор
                      </Button>
                    </>
                  )}

                  {/* UC-103 — фикс Механика (MECHANIC) */}
                  {has(user.role, "TICKET_FIX") && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => mechanicFix(selected.id, note).then(reload)}
                    >
                      Механик: Исправить (UC-103)
                    </Button>
                  )}

                  {/* UC-104 — завершение Агентом (AGENT_SMITH) */}
                  {has(user.role, "TICKET_AGENT_COMPLETE") && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => agentComplete(selected.id, note).then(reload)}
                    >
                      Агент: Выполнено (UC-104)
                    </Button>
                  )}

                  {/* UC-205 — запрос подкрепления (AGENT_SMITH) */}
                  {has(user.role, "TICKET_REQUEST_REINFORCEMENT") && (
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => agentRequestReinforcement(selected.id).then(reload)}
                    >
                      Запросить подкрепление (UC-205)
                    </Button>
                  )}

                  {/* Закрытие тикета (MONITOR) */}
                  {has(user.role, "TICKET_CLOSE") && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => monitorClose(selected.id).then(reload)}
                    >
                      Закрыть тикет
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Выберите тикет
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Выберите тикет из списка слева для просмотра деталей и выполнения действий
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
