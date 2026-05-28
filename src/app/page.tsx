//This is bypassed but can be used as a public facing home page if we want to add marketing content or something in the future. For now it just redirects to the dashboard if the user is logged in, otherwise to the login page.
export default async function Home() {
  return null;
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
