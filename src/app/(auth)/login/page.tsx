import { Logo } from "@/components/Logo/Logo";
import { InternalLink } from "@/components/InternalLink/InternalLink";
import { MutedText } from "@/styles/text.styles";
import {
  PageBackground,
  AuthContainerContent,
  AdditionalOptions,
  AccessibilityHeading,
} from "@/features/auth/auth.styles";
import { LoginFormContent } from "./loginClient";

export const metadata = {
  title: "Log In",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const redirectTo = (resolvedParams?.next as string) || "/dashboard";

  return (
    <PageBackground>
      <AuthContainerContent>
        <AccessibilityHeading>Sign In to PackListo</AccessibilityHeading>
        <Logo />
        <LoginFormContent redirectTo={redirectTo} />
        <AdditionalOptions>
          <MutedText>
            Don't have an account?{" "}
            <InternalLink
              text="Sign Up"
              url="/signup"
              aria-label="Go to Sign Up Page"
            />
          </MutedText>
        </AdditionalOptions>
      </AuthContainerContent>
    </PageBackground>
  );
}
