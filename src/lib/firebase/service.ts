import { collection, getDocs, where, query, addDoc, getFirestore } from "firebase/firestore";
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

export async function signIn(userData: { email: string }) {
  const q = query(collection(firestore, "admin"), where("email", "==", userData.email));
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

// Tipe untuk callback
type signUpCallback = (response: { status: boolean; message: string }) => void;

export async function signUp(userData: { fullname: string; email: string; password: string; role?: string }, callback: signUpCallback) {
  const q = query(collection(firestore, "users"), where("email", "==", userData.email));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (data.length > 0) {
    callback({ status: false, message: "Email sudah terdaftar" });
  } else {
    // userData.password = await bcrypt.hash(userData.password, 10);
    userData.password = userData.password;
    userData.role = "member";
    await addDoc(collection(firestore, "users"), userData)
      .then(() => {
        callback({ status: true, message: "Register berhasil" });
      })
      .catch((error) => {
        callback({ status: false, message: error.message });
      });
  }
}
