import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const AddAdminDialog = ({ open, onClose, onSubmit, formData, setFormData, selectedRole }: any) => {
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Tambah Admin - {selectedRole} </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off">
          <TextField margin="dense" name="email" label="Email" type="email" fullWidth value={formData.email} onChange={handleChange} />
          <TextField margin="dense" name="fullname" label="Full Name" type="text" fullWidth value={formData.fullname} onChange={handleChange} />
          <TextField margin="dense" name="nidn" label="NIDN" type="text" fullWidth value={formData.nidn} onChange={handleChange} />
          <TextField margin="dense" name="password" label="Password" type="password" fullWidth value={formData.password} onChange={handleChange} />
          <TextField margin="dense" name="dosenPengajar" label="Dosen Pengajar" type="text" fullWidth value={formData.dosenPengajar} onChange={handleChange} />
          <TextField margin="dense" name="jabatanDosen" label="Jabatan Dosen" type="text" fullWidth value={formData.jabatanDosen} onChange={handleChange} />
          {/* Dropdown untuk Role */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Role</InputLabel>
            <Select labelId="role-label" name="role" value={formData.role} onChange={handleChange}>
              <MenuItem value="Super Admin">Super Admin</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAdminDialog;
