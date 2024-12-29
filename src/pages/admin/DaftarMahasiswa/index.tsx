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
import { useSession } from "next-auth/react";
import StudentList from "@/pages/admin/DaftarMahasiswa/components/StudentsList";

// MY UTILS
import AlertErrorForDashboard from "@/utils/AlertErrorForDashboard";
import AlertSuccessForDashboard from "@/utils/AlertSuccessForDashboard";

const AdminDaftarMahasiswaPage = () => {
  const [studentsData, setStudentsData] = useState<any[]>([]); // State to hold student data
  const { data }: any = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [position, setPosition] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete dialog
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // Store the student to delete

  // States for alert
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleChange = (event: SelectChangeEvent) => {
    setPosition(event.target.value as string);
  };

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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = studentsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(studentsData.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Daftar Mahasiswa</h1>
        <h1 className="text-3xl font-semibold text-black">{data && data?.user?.fullname}</h1>
        <div className="flex items-center space-x-4">
          {/* Role Filter Dropdown */}
          <Box sx={{ minWidth: 180 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="select-position" className="font-medium ">
                Jurusan Mahasiswa
              </InputLabel>
              <Select labelId="select-position" id="select-position" value={position} label="Jurusan Mahasiswa" onChange={handleChange}>
                <MenuItem value="Jurusan Mahasiswa">Jurusan Mahasiswa</MenuItem>
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

      {/* Student List Section */}
      <StudentList
        studentsData={studentsData} // luruskan
        currentItems={currentItems}
        currentPage={currentPage}
        totalPages={totalPages}
        handleClickOpenDeleteDialog={handleClickOpenDeleteDialog}
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
    </div>
  );
};

export default AdminDaftarMahasiswaPage;
