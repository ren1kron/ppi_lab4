// src/pages/reports/ReportsPage.tsx
import { useEffect, useState } from "react";
import { dailySummary, listSimulations, simulationReport } from "@api/client";
import type { Simulation } from "../../types";
import { Card, CardContent, CardActions, Button, Grid, Typography, Stack } from "@mui/material";
import { useAuth } from "@auth/useAuth";
import { has } from "@auth/permissions";

export default function ReportsPage() {
  const { role } = useAuth();

  const [summary, setSummary] = useState<string>("…");
  const [sims, setSims] = useState<Simulation[]>([]);

  const reload = () => {
    void Promise.all([dailySummary(), listSimulations()]).then(([sum, simList]) => {
      setSummary(sum.text);
      setSims(simList);
    });
  };

  useEffect(() => {
    reload();
  }, []);

  const canViewReports = has(role, "REPORTS_VIEW");
  const canRefreshSimReport = has(role, "SIM_REPORT_REFRESH"); // обычно только MONITOR

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Отчёты</Typography>
      </Grid>

      {canViewReports && (
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Ежедневная сводка для Архитектора (UC-105)</Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", mt: 1 }}>{summary}</Typography>
            </CardContent>
          </Card>
        </Grid>
      )}

      {canViewReports && (
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Стабильность персональных симуляций (UC-404)</Typography>

              <Stack mt={1} spacing={1}>
                {sims.map((s) => (
                  <Card key={s.id} variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1">{s.title}</Typography>
                      <Typography variant="body2">Stability: {s.stability.toFixed(1)} / 100</Typography>
                      <Typography variant="body2">Resources: {s.resources}</Typography>
                      <Typography variant="body2">Activity: {s.activityScore.toFixed(1)} / 100</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Отчёт: {new Date(s.lastReportAt).toLocaleString()}
                      </Typography>
                    </CardContent>
                    {canRefreshSimReport && (
                      <CardActions>
                        <Button onClick={() => void simulationReport(s.id).then(reload)}>
                          Обновить отчёт
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                ))}

                {sims.length === 0 && (
                  <Typography color="text.secondary">Нет активных персональных симуляций</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}
