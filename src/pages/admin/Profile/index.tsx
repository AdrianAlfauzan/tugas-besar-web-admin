import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useSession } from "next-auth/react";
import { Container, Typography } from "@mui/material";
import Image from "next/image";
const ProfileAdminPage = () => {
  const { data }: any = useSession();
  const [formData, setFormData] = useState({
    email: data?.user?.email || "",
    fullname: data?.user?.fullname || "",
    nidn: data?.user?.nidn || "",
    password: data?.user?.password || "",
    dosenPengajar: data?.user?.dosenPengajar || "",
    jabatanDosen: data?.user?.jabatanDosen || "",
    role: data?.user?.role || "",
  });

  const [position, setPosition] = useState(formData.jabatanDosen);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeDosen = (event: SelectChangeEvent) => {
    setPosition(event.target.value as string);
  };

  const handleSubmit = () => {
    console.log("Submitted data: ", formData);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Profile Admin</h1>
      </div>
      <Box component="form" noValidate autoComplete="off" className="bg-white  rounded-lg shadow-md ">
        <Grid container spacing={2} className=" p-4 rounded-md">
          <Grid size={3} className="bg-white border border-gray-900 p-4 rounded h-full text-center flex flex-col items-center justify-center">
            <Container className=" rounded-full flex items-center justify-center">
              <Image src="/images/profile.png" alt="profile" width={200} height={200} className="rounded-full border-4 border-black" />
            </Container>
            <Container className="mt-4 p-4 text-black font-semibold  rounded-lg">
              <Typography variant="h6" className="text-center">
                {data?.user?.fullname}
              </Typography>
              <Typography className="text-center">angka</Typography>
              <Typography className="text-center">dse | S1</Typography>
            </Container>
          </Grid>
          <Grid size={9} container direction="column" spacing={1} className="bg-white p-2 rounded">
            <Grid size={12} className=" rounded ">
              <Grid container spacing={1} className="rounded my-1">
                <Grid size={6} className=" p-4 rounded ">
                  <TextField margin="dense" name="nidn" label="NIDN" type="text" fullWidth value={formData.nidn} onChange={handleChange} className="mb-4" />
                </Grid>
                <Grid size={6} className=" rounded flex items-center justify-center">
                  <TextField margin="dense" name="fullname" label="Full Name" type="text" fullWidth value={formData.fullname} onChange={handleChange} className="mb-4" />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12} className=" rounded ">
              <Grid container spacing={1} className="rounded my-1">
                <Grid size={6} className=" p-4 rounded ">
                  <TextField margin="dense" name="dosenPengajar" label="Dosen Pengajar" type="text" fullWidth value={formData.dosenPengajar} onChange={handleChange} className="mb-4" />
                </Grid>
                <Grid size={6} className=" rounded flex items-center justify-center">
                  <FormControl fullWidth margin="dense" className="mb-4">
                    <InputLabel id="select-position">Jabatan Dosen</InputLabel>
                    <Select labelId="select-position" value={position} onChange={handleChangeDosen} label="Jabatan Dosen">
                      <MenuItem value="Dosen Pembimbing">Dosen Pembimbing</MenuItem>
                      <MenuItem value="Koordinator TA">Koordinator TA</MenuItem>
                      <MenuItem value="Dosen Penguji">Dosen Penguji</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12} className=" rounded ">
              <Grid container spacing={1} className="rounded my-1">
                <Grid size={6} className=" p-4 rounded ">
                  <TextField margin="dense" name="email" label="Email" type="email" fullWidth value={formData.email} onChange={handleChange} className="mb-4" />
                </Grid>

                <Grid size={6} className=" rounded flex items-center justify-center">
                  <TextField margin="dense" name="password" label="Password" type="text" fullWidth value={formData.password} onChange={handleChange} className="mb-4" />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={12} className=" rounded ">
              <Grid container spacing={1} className="rounded my-1">
                <Grid size={6} className=" p-4 rounded ">
                  <FormControl fullWidth margin="dense" className="mb-4">
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select labelId="role-label" name="role" value={formData.role}>
                      <MenuItem value="Super Admin">Super Admin</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6} className=" rounded flex items-center justify-center"></Grid>
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ProfileAdminPage;
