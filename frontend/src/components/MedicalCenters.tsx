// import Image from 'next/image'

// type Center = {
//   id: string
//   name: string
//   address: string
//   logo?: string
// }

// async function fetchCenters(): Promise<Center[]> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/centers`, {
//     cache: 'no-store'
//   })
//   if (!res.ok) {
//     throw new Error('Error fetching centers')
//   }
//   return res.json()
// }

// export default async function MedicalCenters() {
//   const centers = await fetchCenters()

//   return (
//     <section className='my-12 px-6'>
//       <h2 className='text-3xl font-bold text-center mb-8'>
//         Centros Sanitarios
//       </h2>
//       <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
//         {centers.length === 0 && (
//           <p className='col-span-full text-center text-gray-500'>
//             No hay centros disponibles.
//           </p>
//         )}
//         {centers.map((center) => (
//           <div
//             key={center.id}
//             className='border rounded-lg p-4 shadow hover:shadow-lg transition'
//           >
//             {center.logo && (
//               <Image
//                 src={center.logo}
//                 alt={center.name}
//                 width={150}
//                 height={100}
//                 className='mx-auto mb-2 object-contain'
//               />
//             )}
//             <h3 className='text-xl font-semibold text-center'>{center.name}</h3>
//             <p className='text-gray-600 text-center'>{center.address}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   )
// }
