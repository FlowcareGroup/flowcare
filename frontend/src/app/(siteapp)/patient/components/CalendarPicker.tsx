"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { isBefore, startOfDay } from "date-fns";

interface CalendarPickerProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  availableDates?: string[]; // formato "YYYY-MM-DD"
}

export default function CalendarPicker({
  selectedDate,
  onSelectDate,
  availableDates = [],
}: CalendarPickerProps) {
  const today = startOfDay(new Date())

  // Convertir las fechas disponibles a Date
  const availableDateObjects = availableDates.map((d) => new Date(d))

  return (
    <div className='p-2 bg-white rounded-lg shadow border w-fit'>
      <DayPicker
        mode='single'
        selected={selectedDate ? new Date(selectedDate) : undefined}
        onSelect={(date) => {
          if (date) {
            const localDate = date.toLocaleDateString('en-CA')
            onSelectDate(localDate)
          }
        }}
        fromDate={today}
        modifiers={{
          available: availableDateObjects,
          disabled: [
            (day) =>
              isBefore(startOfDay(day), today) ||
              !availableDates.includes(day.toLocaleDateString('en-CA'))
          ]
        }}
        modifiersStyles={{
          available: { backgroundColor: '#d1fae5', color: '#065f46' },
          selected: { backgroundColor: '#10b981', color: 'white' },
          disabled: { opacity: 0.3 }
        }}
      />
    </div>
  );
}

// export default function CalendarPicker({
//   selectedDate,
//   onSelectDate,
//   availableDates = [],
// }: CalendarPickerProps) {
//   // Convertir las fechas disponibles en objetos Date
//   const availableDateObjects = availableDates.map((d) => new Date(d));
//   const today = startOfDay(new Date());

//   return (
//     <div className='p-2 bg-white rounded-lg shadow border w-fit'>
//       <DayPicker
//         mode='single'
//         selected={selectedDate ? new Date(selectedDate) : undefined}
//         onSelect={(date) => {
//           if (date) {
//             const iso = date.toISOString().split("T")[0];
//             onSelectDate(iso);
//           }
//         }}
//         fromDate={today}
//         modifiers={{
//           available: availableDateObjects,
//           disabled: [
//             (day) => isBefore(startOfDay(day), today),
//             (day) => !availableDates.includes(day.toISOString().split("T")[0]),
//           ],
//         }}
//         modifiersStyles={{
//           available: {
//             backgroundColor: "#d1fae5",
//             color: "#065f46",
//           },
//           selected: {
//             backgroundColor: "#10b981",
//             color: "white",
//           },
//           disabled: {
//             opacity: 0.3,
//           },
//         }}
//         styles={{
//           caption: { color: "#065f46", fontWeight: "bold" },
//           day: { borderRadius: "50%" },
//           head_cell: { fontSize: "0.8rem" },
//           cell: { padding: "0.4rem" },
//         }}
//       />
//     </div>
//   );
// }
