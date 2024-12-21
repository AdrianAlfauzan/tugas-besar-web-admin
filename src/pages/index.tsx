import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

// MY UTILS
import AlertError from "@/utils/AlertError";
import AlertSuccess from "@/utils/AlertSuccess";

const adminPromoTexts = [
  { title: "Kelola Semua dengan Mudah", description: "Sebagai admin, Anda memiliki kontrol penuh untuk mengelola semua aspek platform kami secara efisien." },
  { title: "Pengelolaan Pengguna yang Sederhana", description: "Admin dapat dengan mudah mengelola pengguna, mengatur hak akses, dan memantau aktivitas mereka." },
  { title: "Keamanan Terjamin", description: "Admin bertanggung jawab menjaga keamanan sistem dengan memantau dan mengelola kontrol akses serta kebijakan privasi." },
  { title: "Pemantauan Real-Time", description: "Sebagai admin, Anda dapat memantau aktivitas platform secara real-time untuk memastikan kelancaran operasional." },
  { title: "Pengaturan Konten", description: "Admin memiliki kontrol penuh atas pengaturan dan moderasi konten, memastikan kualitas dan kepatuhan pada kebijakan." },
  { title: "Fleksibilitas dalam Pengelolaan Sistem", description: "Admin dapat menyesuaikan pengaturan sistem sesuai dengan kebutuhan dan kebijakan yang berlaku." },
  { title: "Komunikasi Efektif", description: "Admin dapat mengelola komunikasi internal dengan pengguna, memberikan pemberitahuan, dan mengatur pengumuman." },
  { title: "Pemeliharaan Sistem", description: "Sebagai admin, Anda bertanggung jawab untuk menjaga sistem tetap berjalan dengan baik melalui pemeliharaan rutin dan pembaruan." },
  { title: "Tugas Administratif", description: "Admin mengelola tugas administratif seperti pembuatan akun, pengaturan hak akses, dan pemrosesan permintaan dari pengguna." },
];

const LoginAdmin = () => {
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  const [alertError, setAlertError] = useState<boolean>(false);
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    // Use signIn from next-auth to authenticate
    const res = await signIn("credentials", {
      redirect: false, // No automatic redirection
      email: email,
      password: password,
    });

    if (res?.error) {
      setAlertError(true);
      setAlertSuccess(false);
      setTimeout(() => {
        setAlertError(false);
      }, 3000);
    } else {
      setAlertSuccess(true);
      setAlertError(false);
      setTimeout(() => {
        setAlertSuccess(false);
      }, 3000);
      router.push("/admin/dashboard");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % adminPromoTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="w-full h-screen p-10 flex justify-center items-center" component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3 }}>
      <Box className="w-full h-full flex bg-gray-100 shadow-lg rounded-lg overflow-hidden">
        <Box className="w-1/2 bg-blue-600 flex flex-col justify-center items-center">
          <motion.div key={currentTextIndex} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 1, ease: "easeInOut" }} className="text-center">
            <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }} className="text-4xl font-bold text-white">
              {adminPromoTexts[currentTextIndex].title}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="text-xl mt-2 text-white">
              {adminPromoTexts[currentTextIndex].description}
            </motion.p>
          </motion.div>
          <motion.img src="/images/admin.png" alt="Foto" initial={{ scale: 0.8 }} animate={{ scale: 0.9 }} transition={{ duration: 5, repeatType: "reverse", repeat: Infinity }} className="w-3/4" />
        </Box>
        <Box className="w-1/2 p-8 bg-white flex flex-col justify-center">
          <motion.div className="flex flex-col gap-5" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Typography variant="h4" className="font-semibold flex justify-center mb-4 text-gray-800">
              <motion.video className="border-b border-gray-500" width={400} src="/videos/keyadmin.mp4" initial={{ scale: 3 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} autoPlay loop muted />
            </Typography>
            <Typography variant="h4" className="font-semibold text-center mb-4 text-gray-800">
              Masuk
            </Typography>
            <Typography className="text-center mb-6 text-gray-500">Masukkan email dan kata sandi untuk melanjutkan akses.</Typography>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TextField label="email" name="email" fullWidth variant="outlined" />
              <TextField label="Kata Sandi" name="password" type="password" fullWidth variant="outlined" />
              {alertError && <AlertError message="email atau Kata Sandi Salah" />}
              {alertSuccess && <AlertSuccess message="Login Berhasil Dengan Benar!" />}
              <Button type="submit" variant="contained" color="primary" fullWidth component={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                MASUK
              </Button>
            </form>
            <Box className="text-center mt-4">
              <Typography variant="body2" color="primary">
                Lupa Sandi?
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginAdmin;
