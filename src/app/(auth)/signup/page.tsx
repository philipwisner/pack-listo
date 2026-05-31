import { Logo } from "@/components/Logo/Logo";
import { InternalLink } from "@/components/InternalLink/InternalLink";
import { MutedText } from "@/styles/text.styles";
import {
  PageBackground,
  AuthContainerContent,
  AdditionalOptions,
} from "@/features/auth/auth.styles";
import { SignupFormContent } from "./signupClient";

export const metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return (
    <PageBackground>
      <AuthContainerContent>
        <Logo />
        <SignupFormContent />
        <AdditionalOptions>
          <MutedText>
            Already have an account? <InternalLink text="Log In" url="/login" />
          </MutedText>
        </AdditionalOptions>
      </AuthContainerContent>
    </PageBackground>
  );
}
