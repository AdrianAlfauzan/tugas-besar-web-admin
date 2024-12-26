import { collection, getDocs, where, query, getFirestore } from "firebase/firestore";
import app from "@/lib/firebase/init";
// import bcrypt from "bcrypt";

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
