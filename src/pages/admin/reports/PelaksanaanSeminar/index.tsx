import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TextField, Typography } from "@mui/material";

// MY COMPONENTS
import StudentList from "@/pages/admin/reports/PelaksanaanSeminar/components/StudentsList";

// MY UTILS
import AlertErrorForDashboard from "@/utils/AlertErrorForDashboard";
import AlertSuccessForDashboard from "@/utils/AlertSuccessForDashboard";

const AdminPelaksanaanSeminar = () => {
  const [studentsData, setStudentsData] = useState<any[]>([]); // State to hold student data
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // Store the student to delete
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete dialog

  const [openViewDialog, setOpenViewDialog] = useState(false); // State for view dialog
  const [studentDetails, setStudentDetails] = useState<any>(null); // Store the selected student details

  // States for alert
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [openUploadModal, setOpenUploadModal] = useState(false); // Added state for second dialog
  const [years, setYears] = useState("");
  const { data }: any = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleClickOpenViewDialog = (student: any) => {
    setStudentDetails(student); // Store the selected student details
    setOpenViewDialog(true); // Open the view dialog
  };

  const handleClickCloseViewDialog = () => {
    setOpenViewDialog(false); // Close the view dialog
  };

  const handleCloseUploadModal = () => {
    setOpenUploadModal(false); // Close the upload modal
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = studentsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(studentsData.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchStudentsList = async () => {
      try {
        const response = await fetch("/api/ApiGetUsers");
        const data = await response.json();
        if (response.ok && data.status) {
          setStudentsData(data.dataStudents);
        }
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      }
    };

    fetchStudentsList();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setYears(event.target.value as string);
  };
  const [activeTab, setActiveTab] = useState("announcements");
  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  // DELETE
  const handleClickOpenDeleteDialog = (student: any) => {
    setSelectedStudent(student);
    setOpenDeleteDialog(true);
  };
  const handleClickCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const handleDeleteStudents = async () => {
    if (!selectedStudent) return;

    try {
      const response = await fetch("/api/ApiDeleteStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: selectedStudent.id }),
      });

      const data = await response.json();

      if (data.status) {
        setStudentsData(studentsData.filter((student) => student.id !== selectedStudent.id));
        setOpenDeleteDialog(false);
        setAlertMessage("Data berhasil dihapus.");
        setIsSuccess(true);
      } else {
        setAlertMessage("Gagal menghapus data. Coba lagi.");
        setIsSuccess(false);
      }
      setTimeout(() => {
        setAlertMessage("");
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting student:", error);
      setAlertMessage("Terjadi kesalahan, coba lagi nanti.");
      setIsSuccess(false);

      setTimeout(() => {
        setAlertMessage("");
        setIsSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Daftar Pelaksanaan Seminar</h1>
        <h1 className="text-3xl font-semibold text-black">{data && data?.user?.fullname}</h1>
        <div className="flex items-center space-x-4">
          {/* Role Filter Dropdown */}
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
        </div>
      </div>

      {/* Alert rendering */}
      {alertMessage &&
        isSuccess !== null &&
        (isSuccess ? ( // luruskan
          <AlertSuccessForDashboard message={alertMessage} />
        ) : (
          <AlertErrorForDashboard message={alertMessage} />
        ))}

      <StudentList
        studentsData={studentsData} // luruskan
        currentItems={currentItems}
        currentPage={currentPage}
        totalPages={totalPages}
        handleClickOpenDeleteDialog={handleClickOpenDeleteDialog}
        handleClickOpenViewDialog={handleClickOpenViewDialog}
        paginate={paginate}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleClickCloseDeleteDialog}>
        <DialogTitle>{"Apakah Anda Ingin Menghapus Data?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Data ini mungkin bersifat sensitif. Anda yakin akan menghapus data ini?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCloseDeleteDialog} color="primary">
            Tidak
          </Button>
          <Button onClick={handleDeleteStudents} color="secondary">
            Ya
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openViewDialog} onClose={handleClickCloseViewDialog}>
        <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <motion.div
            className="relative bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-3/4 lg:w-2/3 space-y-6"
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
          >
            <Typography variant="h4" className="font-bold text-center text-gray-800 mb-6">
              Kelola Seminar
            </Typography>
            <Box className="flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <Box className="w-full md:w-1/4 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4 rounded-lg space-y-4">
                <Typography variant="h6" className="text-center">
                  Menu
                </Typography>
                <Button onClick={() => handleTabChange("announcements")} fullWidth variant="outlined" className={`${activeTab === "announcements" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                  Pengumuman
                </Button>
                <Button onClick={() => handleTabChange("schedules")} fullWidth variant="outlined" className={`${activeTab === "schedules" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                  Jadwal
                </Button>
                <Button onClick={() => handleTabChange("evaluations")} fullWidth variant="outlined" className={`${activeTab === "evaluations" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                  Nilai
                </Button>
              </Box>
              {/* Content Area */}
              <Box className="w-full md:w-3/4 bg-gray-100 p-6 rounded-lg shadow-md space-y-6">
                {/* Pengumuman Section */}
                {activeTab === "announcements" && (
                  <motion.div className="p-4 bg-white shadow-md rounded-lg space-y-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <Typography variant="h5" className="font-semibold">
                      Manage Pengumuman
                    </Typography>
                    <TextField label="Judul Pengumuman" fullWidth variant="outlined" />
                    <TextField label="Deskripsi Pengumuman" fullWidth variant="outlined" multiline rows={4} />
                    <Button variant="contained" color="primary">
                      Simpan Pengumuman
                    </Button>
                  </motion.div>
                )}
                {/* Jadwal Section */}
                {activeTab === "schedules" && (
                  <motion.div className="p-4 bg-white shadow-md rounded-lg space-y-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <Typography variant="h5" className="font-semibold">
                      Manage Jadwal
                    </Typography>
                    <TextField fullWidth variant="outlined" type="date" />
                    <TextField fullWidth variant="outlined" type="time" />
                    <Button variant="contained" color="primary">
                      Simpan Jadwal
                    </Button>
                  </motion.div>
                )}
                {/* Nilai Section */}
                {activeTab === "evaluations" && (
                  <motion.div className="p-4 bg-white shadow-md rounded-lg space-y-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <Typography variant="h5" className="font-semibold">
                      Manage Nilai
                    </Typography>
                    <TextField label="Nama Peserta" fullWidth variant="outlined" />
                    <TextField label="Nilai" fullWidth variant="outlined" />
                    <TextField label="Komentar" fullWidth variant="outlined" multiline rows={4} />
                    <Button variant="contained" color="primary">
                      Simpan Nilai
                    </Button>
                  </motion.div>
                )}
              </Box>
            </Box>
            <div className="flex justify-between mt-6">
              <Button color="secondary" variant="outlined" onClick={handleClickCloseViewDialog}>
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
