import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";
import { TextField, Typography, Container } from "@mui/material";

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdminPelaksanaanSeminar = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false); // Added state for second dialog
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<any | null>(null);
  const [years, setYears] = useState("");

  const mahasiswaData = [
    { id: 1, nim: "1234545", name: "Adrian Kurniawan", jabatanDosen: "Informatika" },
    { id: 2, nim: "097823", name: "Adrian Musa Alfauzan", jabatanDosen: "Informatika" },
    { id: 3, nim: "2250081020", name: "Adrian Alfauzan", jabatanDosen: "Informatika" },
    { id: 4, nim: "2250081020", name: "Adrian Alfauzan", jabatanDosen: "Informatika" },
  ];

  const handleClickOpenDialog = (mahasiswa: any) => {
    setSelectedMahasiswa(mahasiswa);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenUploadModal = (mahasiswa: any) => {
    setSelectedMahasiswa(mahasiswa);
    setOpenUploadModal(true); // Open the second dialog for upload
  };

  const handleCloseUploadModal = () => {
    setOpenUploadModal(false); // Close the upload modal
  };

  const handleDeleteMahasiswa = () => {
    console.log("Deleting Mahasiswa:", selectedMahasiswa);
    setOpenDialog(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setYears(event.target.value as string);
  };

  const [activeTab, setActiveTab] = useState("announcements");
  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4">
      <Grid container spacing={1} className="bg-slate-800 rounded-md mb-4">
        <Grid size={4} className="rounded max-w-full text-center flex items-center justify-center">
          Daftar Pelaksanaan Seminar
        </Grid>
        <Grid size={4} className="rounded max-w-full flex items-center">
          <Toolbar>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} />
            </Search>
          </Toolbar>
          <Box sx={{ minWidth: 180 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="select-year">Year</InputLabel>
              <Select labelId="select-year" id="select-year" value={years} label="Year" onChange={handleChange}>
                <MenuItem value={2020}>2020</MenuItem>
                <MenuItem value={2021}>2021</MenuItem>
                <MenuItem value={2022}>2022</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={1} className="bg-slate-800 rounded-md">
        <Grid size={12} className="p-2 max-w-full text-center flex items-center justify-center border-b-2 border-white">
          <Grid size={3} className="rounded max-w-full text-center flex items-center justify-center">
            Nim Mahasiswa
          </Grid>
          <Grid size={3} className="border-l-2 border-white max-w-full text-center flex items-center justify-center">
            Nama Mahasiswa
          </Grid>
          <Grid size={3} className="border-l-2 border-white max-w-full text-center flex items-center justify-center">
            Jurusan Mahasiswa
          </Grid>
          <Grid size={3} className="border-l-2 border-white max-w-full text-center flex items-center justify-center">
            Action
          </Grid>
        </Grid>
        {mahasiswaData.map((mahasiswa) => (
          <Grid key={mahasiswa.id} size={12} className="p-2 max-w-full text-center flex items-center justify-center">
            <Grid size={3} className="max-w-full text-center flex items-center justify-center">
              {mahasiswa.nim}
            </Grid>
            <Grid size={3} className="border-l-2 border-white max-w-full text-center flex items-center justify-center">
              {mahasiswa.name}
            </Grid>
            <Grid size={3} className="border-l-2 border-white max-w-full text-center flex items-center justify-center">
              {mahasiswa.jabatanDosen}
            </Grid>
            <Grid size={3} className="border-l-2 border-white max-w-full text-center flex items-center justify-center">
              <IconButton className="p-0" aria-label="delete" onClick={() => handleClickOpenDialog(mahasiswa)}>
                <DeleteIcon />
              </IconButton>
              <IconButton className="p-0" aria-label="view" onClick={() => handleOpenUploadModal(mahasiswa)}>
                <VisibilityIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} TransitionComponent={Transition} keepMounted onClose={handleCloseDialog}>
        <DialogTitle>{"Apakah Anda Ingin Menghapus Data?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Disagree</Button>
          <Button onClick={handleDeleteMahasiswa}>Agree</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Modal Dialog */}
      <Dialog open={openUploadModal} onClose={handleCloseUploadModal}>
        <motion.div
          className="text-black modal-overlay fixed top-0  left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div className="modal-content  bg-slate-300 p-8 rounded-lg w-9/12" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.3 }}>
            <Container className="border p-10 rounded-md" maxWidth="lg">
              {/* Sidebar */}
              <Box className="flex">
                <Box className="w-1/4 bg-gray-800 text-white p-4 rounded-lg">
                  <Typography variant="h6" className="mb-4">
                    Seminar
                  </Typography>
                  <Button onClick={() => handleTabChange("announcements")} fullWidth variant="outlined" className="mb-2">
                    Pengumuman
                  </Button>
                  <Button onClick={() => handleTabChange("schedules")} fullWidth variant="outlined" className="mb-2">
                    Jadwal
                  </Button>
                  <Button onClick={() => handleTabChange("evaluations")} fullWidth variant="outlined">
                    Nilai
                  </Button>
                </Box>
                {/* Content Area */}
                <Box className="w-3/4 p-6">
                  {/* Pengumuman Section */}
                  {activeTab === "announcements" && (
                    <motion.div className="p-4 bg-slate-500 shadow-md rounded-lg" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <Typography variant="h5" className="font-semibold mb-4">
                        Manage Pengumuman
                      </Typography>
                      <TextField label="Judul Pengumuman" fullWidth variant="outlined" className="mb-4" /> <TextField label="Deskripsi Pengumuman" fullWidth variant="outlined" multiline rows={4} className="mb-4" />
                      <Button variant="contained" color="primary" className="mb-4">
                        Simpan Pengumuman
                      </Button>
                    </motion.div>
                  )}
                  {/* Jadwal Section */}
                  {activeTab === "schedules" && (
                    <motion.div className="p-4 bg-slate-500 shadow-md rounded-lg" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <Typography variant="h5" className="font-semibold mb-4">
                        Manage Jadwal
                      </Typography>
                      <TextField fullWidth variant="outlined" className="mb-4" type="date" /> <TextField fullWidth variant="outlined" className="mb-4" type="time" />
                      <Button variant="contained" color="primary" className="mb-4">
                        Simpan Jadwal
                      </Button>
                    </motion.div>
                  )}
                  {/* Nilai Section */}
                  {activeTab === "evaluations" && (
                    <motion.div className="p-4 bg-slate-500 shadow-md rounded-lg" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <Typography variant="h5" className="font-semibold mb-4">
                        Manage Nilai
                      </Typography>
                      <TextField label="Nama Peserta" fullWidth variant="outlined" className="mb-4" /> <TextField label="Nilai" fullWidth variant="outlined" className="mb-4" />
                      <TextField label="Komentar" fullWidth variant="outlined" multiline rows={4} className="mb-4" />
                      <Button variant="contained" color="primary" className="mb-4">
                        Simpan Nilai
                      </Button>
                    </motion.div>
                  )}
                </Box>
              </Box>
            </Container>
            <div className="flex justify-between mt-6">
              <Button color="secondary" variant="contained" onClick={handleCloseUploadModal}>
                Batal
              </Button>
              <Button color="primary" variant="contained">
                Submit
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </Dialog>
    </div>
  );
};

export default AdminPelaksanaanSeminar;
