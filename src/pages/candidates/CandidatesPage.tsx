import { useEffect, useState } from "react";
import {
  listCandidates, oracleForecast, agentOfferBluePill, sentinelStrikeRequest, markAwakened
} from "@api/client";
import { Candidate, Forecast } from "../../types";
import { Card, CardContent, CardActions, Grid, Typography, Button, Stack } from "@mui/material";
import { fmtProb } from "@utils/format";

export default function CandidatesPage() {
  const [items, setItems] = useState<Candidate[]>([]);
  const [forecast, setForecast] = useState<Forecast | null>(null);

  const reload = () => listCandidates().then(setItems);
  useEffect(reload, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><Typography variant="h5">Кандидаты (UC-201..204, 203)</Typography></Grid>

      {items.map(c => (
        <Grid item md={4} sm={6} xs={12} key={c.id}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">{c.name}</Typography>
                <Typography color={c.dissentIndex >= 9.5 ? "error" : "inherit"}>DI: {c.dissentIndex.toFixed(1)}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">{c.dossier}</Typography>
              <Typography variant="caption">Статус: {c.status}</Typography>

              {forecast && forecast.candidateId === c.id && (
                <Stack mt={1} spacing={0.5}>
                  <Typography variant="subtitle2">Прогноз Оракула:</Typography>
                  {forecast.options.map(o => <Typography key={o.action} variant="body2">• {o.action}: {fmtProb(o.probability)}</Typography>)}
                </Stack>
              )}
            </CardContent>
            <CardActions>
              {/* UC-202: запрос прогноза */}
              <Button onClick={() => oracleForecast(c.id).then(setForecast)}>Прогноз Оракула (UC-202)</Button>
              {/* UC-203: синяя таблетка */}
              <Button onClick={() => agentOfferBluePill(c.id).then(reload)}>Синяя таблетка (UC-203)</Button>
              {/* UC-204: удар Сентинелей (эскалация в реальный мир) */}
              <Button color="warning" onClick={() => sentinelStrikeRequest(c.id, "Near Zion Sector").then(reload)}>Запросить удар (UC-204)</Button>
              {/* Пометить как «Проснувшийся» (демо) */}
              <Button color="secondary" onClick={() => markAwakened(c.id).then(reload)}>Отметить «Проснувшийся»</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
