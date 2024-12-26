import { collection, getDocs, where, query, getFirestore, updateDoc, doc } from "firebase/firestore";
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
