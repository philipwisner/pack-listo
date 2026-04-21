import { styled } from "@/styled-system/jsx";

const AuthLayout = styled("div", {
  base: {
    display: "grid",
    minHeight: "100vh",
    // 1fr top, 2fr bottom = Top 3rd
    gridTemplateRows: "1fr 2fr",
    justifyItems: "center",
    alignItems: "end", // Form sits on the 1/3 line
  },
});

const LoginForm = styled("form", {
  base: {
    gridRow: "1",
    width: "full",
    maxWidth: "400px",
    bg: "white",
    p: "8",
    rounded: "lg",
    shadow: "md",
  },
});

const MainLayout = styled("div", {
  base: {
    display: "grid",
    minHeight: "100vh",
    // Sidebar 260px, Content takes remaining
    gridTemplateColumns: "260px 1fr",
    gridTemplateRows: "auto 1fr",
    gridTemplateAreas: `
      "sidebar header"
      "sidebar content"
    `,
  },
});

function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm>
        <h1>Sign In</h1>
        {/* inputs and buttons */}
      </LoginForm>
    </AuthLayout>
  );
}
