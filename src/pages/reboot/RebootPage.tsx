import { useEffect, useState } from "react";
import { startAudit, completeAudit, listTheOneCandidates, chooseTheOne } from "@api/client";
import { Audit, TheOneCandidate } from "../../types";
import { Card, CardContent, CardActions, Button, Grid, Typography, Stack, Radio, RadioGroup, FormControlLabel } from "@mui/material";

export default function RebootPage() {
  const [audit, setAudit] = useState<Audit | null>(null);
  const [pool, setPool] = useState<TheOneCandidate[]>([]);
  const [choice, setChoice] = useState<string>("neo");
  const [chosen, setChosen] = useState<TheOneCandidate | null>(null);

  useEffect(() => { listTheOneCandidates().then(setPool); }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><Typography variant="h5">Цикл перезагрузки (UC-301..304)</Typography></Grid>

      <Grid item md={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">UC-301: Инициация аудита</Typography>
            <Typography variant="body2" color="text.secondary">Статус: {audit?.status ?? "IDLE"}</Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Button variant="contained" onClick={() => startAudit().then(setAudit)}>Запустить аудит</Button>
              <Button onClick={() => completeAudit().then(setAudit)}>Завершить аудит</Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">UC-302: Выбор «Избранного»</Typography>
            <RadioGroup value={choice} onChange={e => setChoice(e.target.value)}>
              {pool.map(p => (
                <FormControlLabel
                  key={p.id}
                  value={p.id}
                  control={<Radio />}
                  label={`${p.name} — шанс ${Math.round(p.probabilityOfSuccess*100)}%`} />
              ))}
            </RadioGroup>
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={() => chooseTheOne(choice).then(setChosen)}>Выбрать</Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">UC-303: Подготовка ресурсов</Typography>
            <Typography variant="body2" color="text.secondary">
              Для демо считаем, что распоряжения Хранителю/Смотрителю/Сентинелям автоматически созданы после выбора.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">UC-304: Финальное интервью</Typography>
            <Typography>Избранный: {chosen?.name ?? "—"}</Typography>
            <Typography variant="body2" color="text.secondary">
              Здесь фиксируется выбор Избранного. В демо — просто отметка, что интервью состоялось.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
