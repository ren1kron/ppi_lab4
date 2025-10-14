import { TextField, TextFieldProps } from "@mui/material";

export default function Field(props: TextFieldProps) {
  return <TextField fullWidth size="small" margin="dense" {...props} />;
}
