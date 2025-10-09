import { signIn } from "../../../../../auth";
import { SingInGoogle } from "./components/SingInGoogle";

export default function Login() {
  return (
    <>
      <SingInGoogle />
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
          });
        }}
      >
        <input
          type='email'
          name='email'
          required
          placeholder='email'
        />
        <input
          type='password'
          name='password'
          required
          placeholder='password'
        />
        <button type='submit'>Login</button>
      </form>
    </>
  );
}
