import { useEffect, useState } from "react";
import {
  listCandidates,
  oracleForecast,
  agentOfferBluePill,
  sentinelStrikeRequest,
  markAwakened
} from "@api/client";
import type { Candidate, Forecast } from "../../types";
import { Card, CardContent, CardActions, Grid, Typography, Button, Stack } from "@mui/material";
import { fmtProb } from "@utils/format";
import { useAuth } from "@auth/useAuth";
import { has } from "@auth/permissions";

export default function CandidatesPage() {
  const { role } = useAuth();

  const [items, setItems] = useState<Candidate[]>([]);
  const [forecast, setForecast] = useState<Forecast | null>(null);

  const reload = () => { void listCandidates().then(setItems); };
  useEffect(() => { reload(); }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={12}><Typography variant="h5">Кандидаты (UC-201..204, 203)</Typography></Grid>

      {items.map(c => (
        <Grid size={{ md: 4, sm: 6, xs: 12 }} key={c.id}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{c.name}</Typography>
                <Typography color={c.dissentIndex >= 9.5 ? "error" : "inherit"}>
                  DI: {c.dissentIndex.toFixed(1)}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">{c.dossier}</Typography>
              <Typography variant="caption">Статус: {c.status}</Typography>

              {forecast && forecast.candidateId === c.id && (
                <Stack mt={1} spacing={0.5}>
                  <Typography variant="subtitle2">Прогноз Оракула:</Typography>
                  {forecast.options.map((o) => (
                    <Typography key={o.action} variant="body2">
                      • {o.action}: {fmtProb(o.probability)}
                    </Typography>
                  ))}
                  {forecast.note && (
                    <Typography variant="caption" color="text.secondary">
                      {forecast.note}
                    </Typography>
                  )}
                </Stack>
              )}
            </CardContent>

            <CardActions>
              {/* UC-202: запрос прогноза — Агент Смит или Оракул */}
              {has(role, "CANDIDATE_FORECAST") && (
                <Button onClick={() => void oracleForecast(c.id).then(setForecast)}>
                  Прогноз (UC-202)
                </Button>
              )}

              {/* UC-203: синяя таблетка — Агент Смит */}
              {has(role, "CANDIDATE_BLUE_PILL") && (
                <Button onClick={() => void agentOfferBluePill(c.id).then(reload)}>
                  Синяя таблетка (UC-203)
                </Button>
              )}

              {/* UC-204: запрос удара — Смотритель */}
              {has(role, "SENTINEL_STRIKE_REQUEST") && (
                <Button
                  color="warning"
                  onClick={() => void sentinelStrikeRequest(c.id, "Near Zion Sector").then(reload)}
                >
                  Запросить удар (UC-204)
                </Button>
              )}

              {/* Демо-действие: отметить как «Проснувшийся» — показываем тем, у кого есть действия над кандидатами */}
              {(has(role, "CANDIDATE_FORECAST") || has(role, "CANDIDATE_BLUE_PILL")) && (
                <Button color="secondary" onClick={() => void markAwakened(c.id).then(reload)}>
                  Отметить «Проснувшийся»
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}

      {items.length === 0 && (
        <Grid>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Кандидатов нет</Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}
