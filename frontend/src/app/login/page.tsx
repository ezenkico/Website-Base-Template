import LoginForm from "./LoginForm";
import { getStrapiEndpoint } from "@/lib/strapi";

export default function LoginPage() {
  const endpoint = getStrapiEndpoint();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your credentials to continue
        </p>

        <LoginForm endpoint={endpoint} />
      </div>
    </main>
  );
}