
export default function PatientLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen flex bg-gray-50'>
      <div className='flex-1 flex flex-col'>
        <main className='p-6'>{children}</main>
      </div>
    </div>
  )
}
