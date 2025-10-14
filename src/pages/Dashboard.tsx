import { Card, CardContent, CardActions, Button, Grid, Typography, Stack } from "@mui/material";
import Field from "@components/Field";
import { useEffect, useState } from "react";
import { getSummary, kernelDetectGlitch, kernelDetectCandidate } from "@api/client";
import type { AppSummary } from "../types";

export default function Dashboard() {
  const [s, setS] = useState<AppSummary | null>(null);
  const [title, setTitle] = useState("Глитч текстуры");
  const [desc, setDesc] = useState("Рябь стен");
  const [mass, setMass] = useState(false);
  const [candName, setCandName] = useState("Subject XYZ-777");
  const [dissent, setDissent] = useState(8.6);

  useEffect(() => { getSummary().then(setS); }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><Typography variant="h5">Обзор</Typography></Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Сводка</Typography>
            <Stack mt={1} spacing={0.5}>
              <Typography>Открытые инциденты: {s?.openIncidents ?? "…"}</Typography>
              <Typography>Кандидаты: {s?.candidates ?? "…"}</Typography>
              <Typography>Сироты: {s?.orphanPrograms ?? "…"}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* UC-101: Kernel creates glitch */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Зафиксировать глитч (UC-101)</Typography>
            <Field label="Заголовок" value={title} onChange={e => setTitle(e.target.value)} />
            <Field label="Описание" value={desc} onChange={e => setDesc(e.target.value)} />
            <Field label="Массовый?" value={mass ? "Да" : "Нет"} onClick={() => setMass(!mass)} />
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={() => kernelDetectGlitch({ title, description: desc, massImpact: mass }).then(()=>getSummary().then(setS))}>
              Создать тикет (назначить Смотрителю)
            </Button>
          </CardActions>
        </Card>
      </Grid>

      {/* UC-201: Kernel detect candidate */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Обнаружить «Кандидата» (UC-201)</Typography>
            <Field label="Имя" value={candName} onChange={e => setCandName(e.target.value)} />
            <Field label="Индекс несогласия" type="number" value={dissent} onChange={e => setDissent(Number(e.target.value))} />
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={() => kernelDetectCandidate(candName, dissent).then(()=>getSummary().then(setS))}>
              Создать досье и уведомления
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
