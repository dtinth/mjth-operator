import { SignIn } from "@clerk/remix";

export default function SignInPage() {
  return (
    <div className="p-4">
      <h1>Sign In route</h1>
      <SignIn />
    </div>
  );
}
