"use client"
import { signIn } from "next-auth/react"
import React from 'react'

export const SingInGoogle = () => {
  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn("google", {
      callbackUrl: "/patient",
      redirect: true,
    })
  }

  return (
    <form onSubmit={handleGoogleSignIn}>
      <button type="submit" className="w-full border border-gray-300 p-2 rounded hover:bg-gray-50">
        Signin with Google
      </button>
    </form>
  )
}
