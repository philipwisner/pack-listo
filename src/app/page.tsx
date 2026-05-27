import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth/server";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <p>Redirecting...</p>
    </div>
  );
}
