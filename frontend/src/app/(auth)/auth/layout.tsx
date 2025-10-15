import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <main className="flex min-h-screen flex-col items-center justify-center bg-[url('/fc7257a5bffaea6a2bc3afa30989fadd7e413f85.jpg')] bg-cover bg-center bg-linear-300 ">
      <div className="flex items-center bg-white border border-gray-300 shadow-lg rounded-lg  p-4 flex-col w-md ">
        <Image src="/iconFlowCare.svg" alt="FlowCare Logo" width={250} height={250}  />
        <p className="text-xl font-normal text-center py-0 px-12 text-gray-800">Te damos la bienvenida a tu 
espacio de salud online</p>
        {children}
      </div>
    </main>
  );
}