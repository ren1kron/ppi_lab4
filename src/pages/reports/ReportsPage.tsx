import { useEffect, useState } from "react";
import { dailySummary, listSimulations, simulationReport } from "@api/client";
import { Simulation } from "../../types";
import { Card, CardContent, CardActions, Button, Grid, Typography, Stack } from "@mui/material";

export default function ReportsPage() {
  const [summary, setSummary] = useState<string>("…");
  const [sims, setSims] = useState<Simulation[]>([]);

  const reload = () => Promise.all([dailySummary().then(r => setSummary(r.text)), listSimulations().then(setSims)]);
  useEffect(() => { reload(); }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={12}><Typography variant="h5">Отчёты (UC-105, UC-404)</Typography></Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Ежедневная сводка для Архитектора (UC-105)</Typography>
            <Typography sx={{ whiteSpace: "pre-wrap", mt: 1 }}>{summary}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Стабильность персональных симуляций (UC-404)</Typography>
            <Stack mt={1} spacing={1}>
              {sims.map(s => (
                <Card key={s.id} variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1">{s.title}</Typography>
                    <Typography variant="body2">Stability: {s.stability.toFixed(1)} / 100</Typography>
                    <Typography variant="body2">Resources: {s.resources}</Typography>
                    <Typography variant="body2">Activity: {s.activityScore.toFixed(1)} / 100</Typography>
                    <Typography variant="caption">Отчёт: {new Date(s.lastReportAt).toLocaleString()}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick={() => simulationReport(s.id).then(() => reload())}>Обновить отчёт</Button>
                  </CardActions>
                </Card>
              ))}
              {sims.length === 0 && <Typography color="text.secondary">Нет активных персональных симуляций</Typography>}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
