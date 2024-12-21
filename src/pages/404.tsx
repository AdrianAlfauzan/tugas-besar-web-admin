import Image from "next/image";

const Custom404 = () => {
  const handlerLogin = () => {
    window.location.href = "/";
  };
  return (
    <div className=" text-slate-300 overflow-hidden flex flex-col items-center justify-center min-h-screen bg-gray-900 absolute inset-0 ">
      <Image src="/images/404.png" alt="NOT FOUND PAGE" className="w-[50%]" width={600} height={600} />
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Halaman tidak ditemukan</h1>
        <button onClick={handlerLogin} className="mt-4 px-6 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded">
          KEMBALI
        </button>
      </div>
    </div>
  );
};

export default Custom404;
