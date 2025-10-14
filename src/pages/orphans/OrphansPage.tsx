import { useEffect, useState } from "react";
import { listOrphans, decideOrphan, createPersonalSimulation, listSimulations } from "@api/client";
import { OrphanProgram, Simulation } from "../../types";
import { Card, CardContent, CardActions, Button, Grid, Typography, Stack, TextField } from "@mui/material";

export default function OrphansPage() {
  const [items, setItems] = useState<OrphanProgram[]>([]);
  const [sims, setSims] = useState<Simulation[]>([]);
  const [title, setTitle] = useState("Пансион для бота");
  const [res, setRes] = useState(10);

  const reload = () => Promise.all([listOrphans().then(setItems), listSimulations().then(setSims)]);
  useEffect(() => { reload(); }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={12}><Typography variant="h5">Сироты и Симуляции (UC-401..404, 403)</Typography></Grid>

      {items.map(o => (
        <Grid size={{ md: 4, sm: 6, xs: 12 }} key={o.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{o.name}</Typography>
              <Typography variant="caption">Статус: {o.status}</Typography>
              {o.simulationId && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Симуляция: {sims.find(s => s.id === o.simulationId)?.title}
                </Typography>
              )}
              <Stack direction="row" spacing={1} mt={1}>
                <Button onClick={() => decideOrphan(o.id, "Save").then(reload)}>Сохранить (UC-402)</Button>
                <Button color="warning" onClick={() => decideOrphan(o.id, "Delete").then(reload)}>Удалить (UC-402)</Button>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                <TextField size="small" label="Название симуляции" value={title} onChange={e => setTitle(e.target.value)} />
                <TextField size="small" label="Ресурсы" type="number" value={res} onChange={e => setRes(Number(e.target.value))} sx={{ width: 120 }} />
                <Button variant="contained" onClick={() => createPersonalSimulation(o.id, title, res).then(reload)}>Создать (UC-403)</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
