// src/pages/orphans/OrphansPage.tsx
import { useEffect, useState } from "react";
import {
  listOrphans,
  decideOrphan,
  createPersonalSimulation,
  listSimulations
} from "@api/client";
import type { OrphanProgram, Simulation } from "../../types";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography,
  Stack,
  TextField
} from "@mui/material";
import { useAuth } from "@auth/useAuth";
import { has } from "@auth/permissions";

export default function OrphansPage() {
  const { role } = useAuth();

  const [items, setItems] = useState<OrphanProgram[]>([]);
  const [sims, setSims] = useState<Simulation[]>([]);

  // локальное состояние полей создания симуляции — по каждому сироте
  const [simTitle, setSimTitle] = useState<Record<string, string>>({});
  const [simRes, setSimRes] = useState<Record<string, number>>({});

  const reload = () => {
    void Promise.all([listOrphans(), listSimulations()]).then(([o, s]) => {
      setItems(o);
      setSims(s);
    });
  };

  useEffect(() => {
    reload();
  }, []);

  const getTitle = (id: string) => simTitle[id] ?? "Персональная симуляция";
  const getRes = (id: string) => simRes[id] ?? 10;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h5">Сироты и Симуляции</Typography>
      </Grid>

      {items.map((o) => {
        const sim = o.simulationId ? sims.find((s) => s.id === o.simulationId) : undefined;
        const canDecide = has(role, "ORPHANS_VIEW") && has(role, "ORPHAN_DECIDE");
        const canCreateSim = has(role, "ORPHANS_VIEW") && has(role, "SIM_CREATE");

        return (
          <Grid size={{ md: 4, sm: 6, xs: 12 }} key={o.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{o.name}</Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Статус: {o.status}
                </Typography>

                {sim && (
                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    <Typography variant="subtitle2">Симуляция</Typography>
                    <Typography variant="body2">Название: {sim.title}</Typography>
                    <Typography variant="body2">Stability: {sim.stability.toFixed(1)} / 100</Typography>
                    <Typography variant="body2">Resources: {sim.resources}</Typography>
                    <Typography variant="body2">Activity: {sim.activityScore.toFixed(1)} / 100</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Отчёт: {new Date(sim.lastReportAt).toLocaleString()}
                    </Typography>
                  </Stack>
                )}
              </CardContent>

              <CardActions sx={{ flexDirection: "column", alignItems: "stretch", gap: 1 }}>
                {/* UC-402 — решение по сироте: MONITOR */}
                {canDecide && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      onClick={() => void decideOrphan(o.id, "Save").then(reload)}
                      disabled={o.status === "Saved"}
                    >
                      Сохранить (UC-402)
                    </Button>
                    <Button
                      color="warning"
                      onClick={() => void decideOrphan(o.id, "Delete").then(reload)}
                      disabled={o.status === "Deleted"}
                    >
                      Удалить (UC-402)
                    </Button>
                  </Stack>
                )}

                {/* UC-403 — создание персональной симуляции: KEYMAKER */}
                {canCreateSim && (
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <TextField
                      size="small"
                      label="Название симуляции"
                      value={getTitle(o.id)}
                      onChange={(e) =>
                        setSimTitle((m) => ({ ...m, [o.id]: e.target.value }))
                      }
                      sx={{ minWidth: 220 }}
                    />
                    <TextField
                      size="small"
                      label="Ресурсы"
                      type="number"
                      value={getRes(o.id)}
                      onChange={(e) =>
                        setSimRes((m) => ({
                          ...m,
                          [o.id]: Number(e.target.value || 0)
                        }))
                      }
                      sx={{ width: 120 }}
                      inputProps={{ min: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() =>
                        void createPersonalSimulation(o.id, getTitle(o.id), getRes(o.id)).then(
                          reload
                        )
                      }
                      disabled={o.status !== "Saved" || Boolean(o.simulationId)}
                    >
                      Создать (UC-403)
                    </Button>
                  </Stack>
                )}

                {/* Подсказка условий для KEYMAKER */}
                {canCreateSim && (o.status !== "Saved" || o.simulationId) && (
                  <Typography variant="caption" color="text.secondary">
                    Для создания симуляции программа должна быть «Saved» и без существующей симуляции.
                  </Typography>
                )}
              </CardActions>
            </Card>
          </Grid>
        );
      })}

      {items.length === 0 && (
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Программ-«Сирот» не найдено</Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}
