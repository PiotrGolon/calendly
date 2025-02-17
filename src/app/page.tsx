import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId !== null) redirect("/dashboard");

  return (
    <div className="text-center container my-4 mx-auto">
      <h1 className="text-3xl mb-4">Home Page</h1>
      <div className="flex gap-2 justify-center">
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Sign up</Button>
        </Link>
      </div>
    </div>
  );
}
