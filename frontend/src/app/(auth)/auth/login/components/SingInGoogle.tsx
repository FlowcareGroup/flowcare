import { signIn } from "../../../../../../auth"
import React from 'react'

export const SingInGoogle = () => {
  return (
    <form
          action={async () => {
            "use server"
            await signIn("google")
        }}
        >
          <button type="submit">Signin with Google</button>
        </form>
  )
}
