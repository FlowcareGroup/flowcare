'use client'
import {useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function Patient() {
    const session = useSession();
    return (
        <div>
            <h1>Patient</h1>
            {session.data ? (
                <div>
                    <p>ID: {session?.data?.user?.id}</p>
                    <p>Email: {session?.data?.user?.email}</p>
                    <p>Name: {session?.data?.user?.name}</p>
                    <p>Role: {session?.data?.user?.role}</p>
                </div>
            ) : (
                <p>No user information available</p>
            )}
            <button onClick={() => signOut()} >Logout</button>
        </div>
    );
}