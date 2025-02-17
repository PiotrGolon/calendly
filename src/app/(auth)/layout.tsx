import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const { userId } = await auth();
  if (userId !== null) redirect("/dashboard");

  return (
    <div className="flex justify-center items-center min-h-screen">
      {children}
    </div>
  );
}
