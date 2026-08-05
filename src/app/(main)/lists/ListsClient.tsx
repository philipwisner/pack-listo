"use client";
import { useState } from "react";
import { ListCard } from "@/components/ListCard";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PageContainer, PageOverlay } from "@/styles/layout.styles";
import { MutedText } from "@/styles/text.styles";
import { BottomCard } from "@/components/BottomCard";
import { createListAction } from "@/features/list/list.actions";
import { List } from "@/generated/prisma/browser";

interface ListsClientProps {
  initialLists: List[];
}

export default function ListsClient({ initialLists }: ListsClientProps) {
  const router = useRouter();
  const [showBottomCard, setShowBottomCard] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    setShowBottomCard(false);
    router.refresh();
  };

  const createListInputs = [
    {
      id: "name",
      label: "List Name",
      type: "text",
      placeholder: "e.g. Summer Vacation",
      required: true,
    },
    {
      id: "destination",
      label: "Destination",
      type: "text",
      placeholder: "e.g. Iceland",
      required: false,
    },
    {
      id: "dates",
      label: "Dates",
      type: "text",
      placeholder: "e.g. 2026",
      required: false,
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nameInput = form.querySelector("#name") as HTMLInputElement;

    if (!form.checkValidity()) {
      console.log("Invalid form");
      setFieldErrors({
        name: !nameInput.validity.valid,
      });
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      destination: formData.get("destination") as string,
      tripDate: formData.get("tripDate")
        ? new Date(formData.get("tripDate") as string)
        : undefined,
      lengthOfStay: formData.get("lengthOfStay")
        ? parseInt(formData.get("lengthOfStay") as string)
        : undefined,
      isTemplate: formData.get("isTemplate") === "on",
    };

    const result = await createListAction(data);

    if (result?.data?.success) {
      handleSuccess();
      router.refresh();
      if (result.data.list) {
        router.push(`/lists/${result.data.list.id}`);
      }
    } else {
      setLoading(false);
    }
  }

  return (
    <>
      {showBottomCard && (
        <BottomCard
          heading="Create List"
          onClose={() => setShowBottomCard(false)}
          inputs={createListInputs}
          button={{ text: "Create List", type: "submit" }}
          onSave={handleSubmit}
          isLoading={loading}
          fieldErrors={fieldErrors}
        />
      )}
      <PageContainer>
        {showBottomCard && <PageOverlay />}
        <PageHeader
          text="My Lists"
          button={{
            text: "Create List",
            onClick: () => setShowBottomCard(true),
          }}
        />
        <div>
          {initialLists.length === 0 ? (
            <MutedText>No Lists. Create a List to get started.</MutedText>
          ) : (
            initialLists.map((list) => <ListCard key={list.id} list={list} />)
          )}
        </div>
      </PageContainer>
    </>
  );
}
