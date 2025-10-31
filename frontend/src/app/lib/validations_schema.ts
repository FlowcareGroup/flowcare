import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
  // Para producción, considera agregar:
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Debe contener mayúsculas, minúsculas y números")
})

export type LoginSchema = z.infer<typeof loginSchema>

export const signUpSchema = z
  .object({
    name_given: z
      .string()
      .trim()
      .min(1, 'El nombre es obligatorio')
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre es demasiado largo'),
    email: z
      .string()
      .trim()
      .min(1, 'El correo electrónico es obligatorio')
      .email('Ingresa un correo electrónico válido')
      .toLowerCase(),
    password: z
      .string()
      .min(1, 'La contraseña es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Debe contener mayúsculas, minúsculas y números'
      ),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

export type SignUpSchema = z.infer<typeof signUpSchema>

export const clinicSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo'),
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Debe contener mayúsculas, minúsculas y números'
    )
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'La contraseña debe contener al menos un carácter especial'
    ),

  NIF: z
    .string()
    .trim()
    .min(1, 'El NIF es obligatorio')
    .min(8, 'El NIF debe tener al menos 8 caracteres')
    .max(20, 'El NIF es demasiado largo'),
  telf: z
    .string()
    .trim()
    .min(1, 'El telf es obligatorio')
    .min(9, 'El telf debe tener al menos 9 caracteres')
    .max(15, 'El telf es demasiado largo')
})

export type ClinicSchema = z.infer<typeof clinicSchema>

export const clinicEditSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo'),
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido')
    .toLowerCase(),
  password: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val))
    .refine((val) => val === undefined || val.length >= 8, {
      message:
        'La contraseña debe tener al menos 8 caracteres (si se proporciona)'
    })

    .refine(
      (val) => val === undefined || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
      {
        message:
          'La contraseña debe contener al menos una minúscula, una mayúscula y un número (si se proporciona)'
      }
    )
    .refine((val) => val === undefined || /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message:
        'La contraseña debe contener al menos un carácter especial (si se proporciona)'
    }),
  NIF: z
    .string()
    .trim()
    .min(1, 'El NIF es obligatorio')
    .min(8, 'El NIF debe tener al menos 8 caracteres')
    .max(20, 'El NIF es demasiado largo'),
  telf: z
    .string()
    .trim()
    .min(1, 'El telf es obligatorio')
    .min(9, 'El telf debe tener al menos 9 caracteres')
    .max(15, 'El telf es demasiado largo')
})
export type ClinicEditSchema = z.infer<typeof clinicEditSchema>



export const doctorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo'),
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Debe contener mayúsculas, minúsculas y números'
    )
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'La contraseña debe contener al menos un carácter especial'
    ),

  specialty: z
    .string()
    .trim()
    .min(1, 'El specialty es obligatorio')
    .min(8, 'El specialty debe tener al menos 8 caracteres')
    .max(20, 'El specialty es demasiado largo'),
  telf: z
    .string()
    .trim()
    .min(1, 'El telf es obligatorio')
    .min(9, 'El telf debe tener al menos 9 caracteres')
    .max(15, 'El telf es demasiado largo'),
  hours: z
    .string()
    .min(1, 'El horus es obligatorio')
    .max(50, 'El horus es demasiado largo')
})
export type DoctorSchema = z.infer<typeof doctorSchema>

export const doctorEditSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo'),
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido')
    .toLowerCase(),
  password: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val))
    .refine((val) => val === undefined || val.length >= 8, {
      message:
        'La contraseña debe tener al menos 8 caracteres (si se proporciona)'
    })

    .refine(
      (val) => val === undefined || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
      {
        message:
          'La contraseña debe contener al menos una minúscula, una mayúscula y un número (si se proporciona)'
      }
    )
    .refine((val) => val === undefined || /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message:
        'La contraseña debe contener al menos un carácter especial (si se proporciona)'
    }),
  specialty: z
    .string()
    .trim()
    .min(1, 'El specialty es obligatorio')
    .min(8, 'El specialty debe tener al menos 8 caracteres')
    .max(20, 'El specialty es demasiado largo'),
  telf: z
    .string()
    .trim()
    .min(1, 'El telf es obligatorio')
    .min(9, 'El telf debe tener al menos 9 caracteres')
    .max(15, 'El telf es demasiado largo'),

  hours: z
    .string()
    .trim()
    .min(1, 'El horus es obligatorio')
    .max(50, 'El horus es demasiado largo')
    .transform((val) => new Date(val))
})

export type DoctorEditSchema = z.infer<typeof doctorEditSchema>
