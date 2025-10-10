import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex items-center justify-between border border-gray-300 shadow-lg rounded-lg min-h-[600px] min-w-[800px] p-8">
        <div className="w-1/2">
          {children}
        </div>
        <div className="flex items-center justify-center w-1/2">
          <Image 
            src="/imagen_login.png" 
            alt="imagen_login" 
            width={400} 
            height={400}
            priority
            className="w-auto h-auto"
            />
        </div>
      </div>
    </main>
  );
}