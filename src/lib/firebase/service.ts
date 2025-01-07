import { collection, getDocs, where, query, getFirestore, updateDoc, doc, addDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import app from "@/lib/firebase/init";

const firestore = getFirestore(app);

// Tipe generik untuk mengambil data
export async function mengambilData<DataType>(namaCollection: string): Promise<DataType[]> {
  const snapshot = await getDocs(collection(firestore, namaCollection));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DataType[];
  return data;
}

export async function signInAdmin(adminData: { email: string }) {
  const q = query(collection(firestore, "admin"), where("email", "==", adminData.email));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (data.length > 0) {
    return data[0];
  } else {
    return null;
  }
}

// Fungsi untuk mengupdate profil admin berdasarkan nidn
export async function updateProfile(nidn: string, updatedData: any) {
  if (!nidn) {
    throw new Error("NIDN is required for updating profile");
  }

  try {
    // Cari dokumen admin berdasarkan nidn
    const q = query(collection(firestore, "admin"), where("nidn", "==", nidn));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, message: "Admin with the specified NIDN not found" };
    }

    // Ambil dokumen pertama yang ditemukan
    const adminDoc = snapshot.docs[0];

    // Update dokumen berdasarkan id
    const adminRef = doc(firestore, "admin", adminDoc.id);
    await updateDoc(adminRef, updatedData);

    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error updating profile: ", error);
    return { success: false, message: "Failed to update profile." };
  }
}

// @/lib/firebase/service.ts
export async function getUserData(nidn: string) {
  const q = query(collection(firestore, "admin"), where("nidn", "==", nidn));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("User not found.");
  }

  const userData = snapshot.docs.map((doc) => ({
    id: doc.id,
    email: doc.data().email,
    fullname: doc.data().fullname,
    nidn: doc.data().nidn,
    password: doc.data().password,
    dosenPengajar: doc.data().dosenPengajar,
    jabatanDosen: doc.data().jabatanDosen,
    role: doc.data().role,
  }))[0]; // Get the first user (assuming NIDN is unique)

  return userData;
}

export async function addAdmin(
  adminData: {
    email: string;
    fullname: string;
    nidn: string;
    password: string;
    dosenPengajar: string;
    jabatanDosen: string;
    role: string;
  },
  currentUserRole: string // Menambahkan parameter untuk role pengguna yang sedang login
) {
  try {
    // Cek apakah sudah ada admin dengan email atau NIDN yang sama
    const qEmail = query(collection(firestore, "admin"), where("email", "==", adminData.email));
    const qNidn = query(collection(firestore, "admin"), where("nidn", "==", adminData.nidn));

    const snapshotEmail = await getDocs(qEmail);
    const snapshotNidn = await getDocs(qNidn);

    if (!snapshotEmail.empty) {
      return { success: false, message: "Email sudah digunakan!" };
    }

    if (!snapshotNidn.empty) {
      return { success: false, message: "NIDN sudah digunakan!" };
    }

    // Debugging: Periksa role pengguna saat ini
    console.log("Current User Role:", currentUserRole);
    console.log("Admin Role yang Dipilih:", adminData.role);

    // Pastikan hanya Super Admin yang bisa menambah admin dengan role Super Admin
    if (adminData.role === "Super Admin" && currentUserRole !== "Super Admin") {
      return { success: false, message: "Hanya Super Admin yang dapat menambahkan admin dengan role Super Admin!" };
    }

    // Jika lolos validasi, tambahkan admin baru
    const newAdminRef = await addDoc(collection(firestore, "admin"), adminData);

    return { success: true, message: "Admin berhasil ditambahkan!", id: newAdminRef.id };
  } catch (error) {
    console.error("Error menambahkan admin: ", error);
    return { success: false, message: "Gagal menambahkan admin." };
  }
}

export const fetchAdmins = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "admin"));
    const admins: any[] = [];
    querySnapshot.forEach((doc) => {
      admins.push({ id: doc.id, ...doc.data() });
    });
    return admins;
  } catch (error) {
    console.error("Error fetching admins: ", error);
    return [];
  }
};

export async function deleteAdmin(adminId: string) {
  try {
    await deleteDoc(doc(firestore, "admin", adminId));
    return { success: true, message: "Admin berhasil dihapus!" };
  } catch (error) {
    console.error("Error deleting admin: ", error);
    return { success: false, message: "Gagal menghapus admin." };
  }
}

export const fetchStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "users"));
    const students: any[] = [];
    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });
    return students;
  } catch (error) {
    console.error("Error fetching students: ", error);
    return [];
  }
};

export async function deleteStudent(studentId: string) {
  try {
    await deleteDoc(doc(firestore, "users", studentId));
    return { success: true, message: "Student berhasil dihapus!" };
  } catch (error) {
    console.error("Error deleting student: ", error);
    return { success: false, message: "Gagal menghapus student." };
  }
}

export const addPelaksanaanSeminar = async (data: {
  nim: string; //
  judulPengumuman: string;
  deskripsiPengumuman: string;
  tanggal: string;
  waktu: string;
  namaPeserta: string;
  komentar: string;
  nilai: number;
}) => {
  try {
    const { nim, namaPeserta, nilai, komentar, ...restData } = data; // Memisahkan nilai, komentar, dan nim dari data lainnya

    // Cek apakah dokumen dengan nim yang sesuai sudah ada
    const docRef = doc(firestore, "pelaksanaanSeminar", nim);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Jika dokumen ada, update dokumen tersebut
      await updateDoc(docRef, {
        ...restData, // Menambahkan data lainnya tanpa perubahan
        namaPeserta, // Menambahkan namaPeserta secara terpisah
        nilai, // Menambahkan nilai secara terpisah
        komentar, // Menambahkan komentar secara terpisah
      });

      return { success: true, id: nim, message: "Pelaksanaan seminar berhasil diperbarui!" };
    } else {
      // Jika dokumen belum ada, buat dokumen baru dengan nim sebagai id
      await setDoc(docRef, {
        ...restData, // Menambahkan data lainnya tanpa perubahan
        namaPeserta, // Menambahkan namaPeserta secara terpisah
        nilai, // Menambahkan nilai secara terpisah
        komentar, // Menambahkan komentar secara terpisah
      });

      return { success: true, id: nim, message: "Pelaksanaan seminar berhasil ditambahkan!" };
    }
  } catch (error) {
    console.error("Error menambahkan atau memperbarui pelaksanaan seminar:", error);
    return { success: false, message: "Gagal menambahkan atau memperbarui pelaksanaan seminar." };
  }
};

export const fetchSeminar = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "pelaksanaanSeminar"));
    const seminar: any[] = [];
    querySnapshot.forEach((doc) => {
      seminar.push({ id: doc.id, ...doc.data() });
    });
    return seminar;
  } catch (error) {
    console.error("Error fetching seminar: ", error);
    return [];
  }
};

export const deleteSeminarByStudentId = async (nim: string): Promise<boolean> => {
  try {
    // Mengakses koleksi seminar
    const seminarCollection = collection(firestore, "pelaksanaanSeminar");

    // Membuat query untuk mencari seminar berdasarkan nim
    const seminarQuery = query(seminarCollection, where("nim", "==", nim));

    // Mendapatkan hasil query
    const querySnapshot = await getDocs(seminarQuery);

    if (querySnapshot.empty) {
      console.log("Seminar data not found for nim:", nim);
      return false; // Jika tidak ada seminar yang ditemukan
    }

    // Menghapus semua seminar yang ditemukan untuk nim
    const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const docRef = doc(firestore, "pelaksanaanSeminar", docSnapshot.id);
      await deleteDoc(docRef); // Menghapus dokumen seminar berdasarkan ID
    });

    await Promise.all(deletePromises);

    console.log("Seminar data successfully deleted for nim:", nim);
    return true;
  } catch (error) {
    console.error("Error deleting seminar data:", error);
    return false;
  }
};
