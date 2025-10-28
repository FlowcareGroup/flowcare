import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[url('/fc7257a5bffaea6a2bc3afa30989fadd7e413f85.jpg')] bg-cover bg-center">
      <div className="flex items-center bg-white border border-gray-300 shadow-lg rounded-lg p-4 md:p-8 flex-col w-full mx-4 max-w-md md:max-w-lg">
        <Image 
          src="/iconFlowCare.svg" 
          alt="FlowCare Logo" 
          width={250} 
          height={250}
          className="w-32 md:w-64 h-auto"
        />
        <p className="text-lg md:text-xl font-normal text-center py-4 px-4 md:px-12 text-gray-800">
          Te damos la bienvenida a tu espacio de salud online
        </p>
        {children}
      </div>
    </div>
  );
}