import { useEffect, useState } from "react";
import {
  listCandidates,
  oracleForecast,
  agentOfferBluePill,
  sentinelStrikeRequest,
  markAwakened
} from "@api/client";
import type { Candidate, Forecast } from "../../types";
import { Card, CardContent, CardActions, Grid, Typography, Button, Stack, Box, Chip, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, Paper, Divider } from "@mui/material";
import { fmtProb } from "@utils/format";
import { useAuth } from "@auth/useAuth";
import { has } from "@auth/permissions";

export default function CandidatesPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  const [items, setItems] = useState<Candidate[]>([]);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const reload = async () => {
    try {
      setLoading(true);
      setError(null);
      const candidates = await listCandidates();
      setItems(candidates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки кандидатов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

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

  const getDissentColor = (dissentIndex: number) => {
    if (dissentIndex >= 9.5) return "error";
    if (dissentIndex >= 7.0) return "warning";
    return "success";
  };

  const getDissentLabel = (dissentIndex: number) => {
    if (dissentIndex >= 9.5) return "Критический";
    if (dissentIndex >= 7.0) return "Высокий";
    return "Низкий";
  };

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
          Управление кандидатами
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Мониторинг потенциальных угроз и управление кандидатами (UC-201..204, 203)
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Кандидаты ({filteredItems.length})</Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Фильтр по статусу</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Фильтр по статусу"
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
      </Paper>

      <Grid container spacing={3}>
        {filteredItems.map(c => (
          <Grid size={{ md: 4, sm: 6, xs: 12 }} key={c.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h3">
                    {c.name}
                  </Typography>
                  <Chip
                    label={c.status}
                    color="default"
                    size="small"
                  />
                </Stack>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Досье
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {c.dossier}
                  </Typography>
                </Box>

                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Индекс диссидентства
                  </Typography>
                  <Chip
                    label={`${c.dissentIndex.toFixed(1)} (${getDissentLabel(c.dissentIndex)})`}
                    color={getDissentColor(c.dissentIndex) as any}
                    size="small"
                  />
                </Stack>

                {forecast && forecast.candidateId === c.id && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" gutterBottom color="primary">
                        Прогноз Оракула
                      </Typography>
                      <Stack spacing={1}>
                        {forecast.options.map((o) => (
                          <Box key={o.action}>
                            <Typography variant="body2" fontWeight="medium">
                              {o.action}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Вероятность: {fmtProb(o.probability)}
                            </Typography>
                          </Box>
                        ))}
                        {forecast.note && (
                          <Alert severity="info" sx={{ mt: 1 }}>
                            <Typography variant="caption">
                              {forecast.note}
                            </Typography>
                          </Alert>
                        )}
                      </Stack>
                    </Box>
                  </>
                )}
              </CardContent>

              <CardActions sx={{ flexDirection: "column", alignItems: "stretch", gap: 1, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Действия
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {/* UC-202: запрос прогноза — Агент Смит или Оракул */}
                  {has(user.role, "CANDIDATE_FORECAST") && (
                    <Button
                      variant="outlined"
                      onClick={() => void oracleForecast(c.id).then(setForecast)}
                    >
                      Прогноз (UC-202)
                    </Button>
                  )}

                  {/* UC-203: синяя таблетка — Агент Смит */}
                  {has(user.role, "CANDIDATE_BLUE_PILL") && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => void agentOfferBluePill(c.id).then(reload)}
                    >
                      Синяя таблетка (UC-203)
                    </Button>
                  )}

                  {/* UC-204: запрос удара — Смотритель */}
                  {has(user.role, "SENTINEL_STRIKE_REQUEST") && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => void sentinelStrikeRequest(c.id, "Near Zion Sector").then(reload)}
                    >
                      Запросить удар (UC-204)
                    </Button>
                  )}

                  {/* Демо-действие: отметить как «Проснувшийся» — показываем тем, у кого есть действия над кандидатами */}
                  {(has(user.role, "CANDIDATE_FORECAST") || has(user.role, "CANDIDATE_BLUE_PILL")) && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => void markAwakened(c.id).then(reload)}
                    >
                      Отметить «Проснувшийся»
                    </Button>
                  )}
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {filteredItems.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {filterStatus === "ALL" ? "Кандидатов нет" : `Нет кандидатов со статусом "${filterStatus}"`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  В системе пока нет кандидатов для мониторинга
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
