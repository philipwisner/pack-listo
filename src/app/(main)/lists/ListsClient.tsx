"use client";

import { useState } from "react";
import { ListCard } from "@/components/ListCard/ListCard";
import { Modal } from "@/components/Modal/Modal";
import { NewListForm } from "@/components/forms/NewListForm";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { PageContainer } from "@/styles/layout.styles";
import { MutedText } from "@/styles/input.styles";
import { BottomCard } from "@/components/BottomCard/BottomCard";
import { createListAction } from "@/features/list/list.actions";

interface ListsClientProps {
  initialLists: any[];
}

export default function ListsClient({ initialLists }: ListsClientProps) {
  const router = useRouter();
  const [showBottomCard, setShowBottomCard] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      placeholder: "Your list name",
      required: true,
    },
    {
      id: "destination",
      label: "Destination",
      type: "text",
      placeholder: "Where are you going?",
      required: false,
    },
    {
      id: "dates",
      label: "Dates",
      type: "text",
      placeholder: "When?",
      required: false,
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
    console.log("createListAction result:", result);

    if (result?.data?.success) {
      handleSuccess();
      router.refresh();
      if (result.data.list) {
        router.push(`/lists/${result.data.list.id}`);
      }
    } else {
      setError("Failed to create manifest. Please check all requirements.");
      setLoading(false);
    }
  }

  return (
    <>
      {/* <Modal
        isOpen={showBottomCard}
        onClose={() => setShowBottomCard(false)}
        title="AUTHORIZE NEW MANIFEST"
        gate="L-40"
      >
        <NewListForm
          onSuccess={handleSuccess}
          onCancel={() => setShowBottomCard(false)}
        />
      </Modal> */}
      <PageContainer>
        {showBottomCard && (
          <BottomCard
            heading="Create List"
            onClose={() => setShowBottomCard(false)}
            inputs={createListInputs}
            button={{ text: "Create List", type: "submit" }}
            onSave={handleSubmit}
          />
        )}
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
