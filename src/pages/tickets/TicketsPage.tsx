import { useEffect, useMemo, useState } from "react";
import {
  listTickets, monitorClassifyAndAssign, mechanicFix, agentComplete,
  escalateToArchitect, architectDecision, monitorClose, agentRequestReinforcement
} from "@api/client";
import {
  Box, Button, Card, CardActions, CardContent, Grid, MenuItem, Select, Stack, Typography, TextField
} from "@mui/material";
import SeverityChip from "@components/SeverityChip";
import StatusChip from "@components/StatusChip";
import { Role, Severity, Ticket } from "../../types";

export default function TicketsPage() {
  const [items, setItems] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [severity, setSeverity] = useState<Severity>(1);
  const [assignTo, setAssignTo] = useState<Role>("MECHANIC");
  const [note, setNote] = useState("");

  const reload = () => { void listTickets().then(setItems); };
  useEffect(() => { reload(); }, []);

  useEffect(() => { if (selected) { setSeverity(selected.severity); setAssignTo((selected.assigneeRole ?? "MECHANIC") as Role); } }, [selected]);

  return (
    <Grid container spacing={2}>
      <Grid size={12}><Typography variant="h5">Тикеты (UC-102..107, 104, 205)</Typography></Grid>

      <Grid size={{ md: 5, xs: 12 }}>
        <Stack spacing={1}>
          {items.map(t => (
            <Card key={t.id} onClick={() => setSelected(t)} sx={{ cursor: "pointer", border: selected?.id === t.id ? "2px solid #00e5ff" : undefined }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">{t.title}</Typography>
                  <StatusChip status={t.status} />
                </Stack>
                <Typography variant="body2" color="text.secondary">{t.description}</Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <SeverityChip s={t.severity} />
                  <Typography variant="caption">Исполнитель: {t.assigneeRole ?? "—"}</Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Grid>

      <Grid size={{ md: 7, xs: 12 }}>
        {selected ? (
          <Card>
            <CardContent>
              <Typography variant="h6">{selected.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selected.description}</Typography>

              {/* UC-102: классификация и назначение (Смотритель) */}
              <Typography variant="subtitle2">Классификация (UC-102)</Typography>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Select size="small" value={severity} onChange={e => setSeverity(Number(e.target.value) as Severity)}>
                  <MenuItem value={1}>Уровень 1</MenuItem>
                  <MenuItem value={2}>Уровень 2</MenuItem>
                  <MenuItem value={3}>Уровень 3</MenuItem>
                </Select>
                <Select size="small" value={assignTo} onChange={e => setAssignTo(e.target.value as Role)}>
                  <MenuItem value="MECHANIC">Назначить Механику</MenuItem>
                  <MenuItem value="AGENT_SMITH">Назначить Агенту Смиту</MenuItem>
                </Select>
                <Button variant="outlined" onClick={() =>
                  monitorClassifyAndAssign(selected.id, severity, assignTo).then(reload)
                }>Применить</Button>
              </Stack>

              <TextField fullWidth label="Комментарий / Патч / Отчёт" size="small" value={note} onChange={e => setNote(e.target.value)} />

              <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                {/* UC-106: эскалация Архитектору */}
                <Button onClick={() => escalateToArchitect(selected.id, note).then(reload)}>Эскалировать Архитектору (UC-106)</Button>
                {/* UC-107: решение Архитектора */}
                <Button onClick={() => architectDecision(selected.id, "IGNORE", note).then(reload)}>Решение Архитектора: Игнор</Button>
                <Button onClick={() => architectDecision(selected.id, "ALLOCATE_RESOURCES", note).then(reload)}>Решение Архитектора: Ресурсы</Button>
                <Button onClick={() => architectDecision(selected.id, "DELETE_SECTOR", note).then(reload)}>Решение Архитектора: Удалить сектор</Button>

                {/* UC-103: фикс Механика */}
                <Button variant="contained" onClick={() => mechanicFix(selected.id, note).then(reload)}>Механик: Исправить (UC-103)</Button>

                {/* UC-104: Агент Смит завершает силовое действие */}
                <Button variant="contained" color="secondary" onClick={() => agentComplete(selected.id, note).then(reload)}>Агент Смит: Выполнено (UC-104)</Button>

                {/* UC-205: запрос подкрепления */}
                <Button color="warning" onClick={() => agentRequestReinforcement(selected.id).then(reload)}>Запросить подкрепление (UC-205)</Button>

                {/* Закрытие тикета Смотрителем */}
                <Button color="success" onClick={() => monitorClose(selected.id).then(reload)}>Закрыть тикет</Button>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ opacity: 0.7 }}>Выберите тикет слева</Box>
        )}
      </Grid>
    </Grid>
  );
}
