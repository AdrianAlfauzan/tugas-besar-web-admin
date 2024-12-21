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
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
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
    // vertical padding + font size from searchIcon
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

const DaftarMahasiswaPage = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<any | null>(null);

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

  const [years, setYears] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setYears(event.target.value as string);
  };

  const handleDeleteMahasiswa = () => {
    console.log("Deleting Mahasiswa:", selectedMahasiswa);
    setOpenDialog(false);
  };
  return (
    <div className="p-4 ">
      <Grid container spacing={1} className="bg-slate-800 rounded-md mb-4">
        <Grid size={4} className="  rounded max-w-full  text-center flex items-center justify-center">
          Daftar Mahasiswa
        </Grid>
        <Grid size={4} className="  rounded max-w-full flex items-center">
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
      <Grid container spacing={1} className="bg-slate-800 rounded-md  ">
        <Grid size={12} className="  p-2 max-w-full  text-center flex items-center justify-center border-b-2 border-white">
          <Grid size={4} className="  rounded max-w-full  text-center flex items-center justify-center">
            Nim Mahasiswa
          </Grid>
          <Grid size={4} className=" border-l-2 border-white  max-w-full  text-center flex items-center justify-center">
            Nama Mahasiswa
          </Grid>
          <Grid size={4} className=" border-l-2 border-white  max-w-full  text-center flex items-center justify-center">
            Jurusan Mahasiswa
          </Grid>
          <Grid size={4} className=" border-l-2 border-white  max-w-full  text-center flex items-center justify-center">
            Action
          </Grid>
        </Grid>
        {mahasiswaData.map((mahasiswa) => (
          <Grid key={mahasiswa.id} size={12} className="p-2 max-w-full text-center flex items-center justify-center">
            <Grid size={4} className="max-w-full text-center flex items-center justify-center">
              {mahasiswa.nim}
            </Grid>
            <Grid size={4} className="border-l-2 border-white max-w-full text-center flex items-center justify-center">
              {mahasiswa.name}
            </Grid>
            <Grid size={4} className="border-l-2 border-white max-w-full text-center flex items-center justify-center">
              {mahasiswa.jabatanDosen}
            </Grid>
            <Grid size={4} className="border-l-2 border-white max-w-full text-center flex items-center justify-center">
              <IconButton className="p-0" aria-label="delete" onClick={() => handleClickOpenDialog(mahasiswa)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Dialog open={openDialog} TransitionComponent={Transition} keepMounted onClose={handleCloseDialog} aria-describedby="alert-dialog-slide-description">
          <DialogTitle>{"Apakah Anda Ingin Menghapus Data?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">Data ini mungkin bersifat sensitive, anda yakin akan menghapus data ini?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Disagree</Button>
            <Button onClick={handleDeleteMahasiswa}>Agree</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </div>
  );
};

export default DaftarMahasiswaPage;
