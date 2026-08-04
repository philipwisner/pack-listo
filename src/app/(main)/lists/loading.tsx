import { PageHeader } from "@/components/PageHeader";
import { PageContainer } from "@/styles/layout.styles";

export default function Loading() {
  return (
    <PageContainer>
      <PageHeader
        text="My Lists"
        button={{
          text: "Create List",
        }}
      />
      <div>
        {[0, 1, 2].map((list) => (
          <div key={list}>Loading Skeleton</div>
        ))}
      </div>
    </PageContainer>
  );
}
