import { styled } from "@/styled-system/jsx/factory";
import { ComponentProps } from "@/styled-system/types/jsx";
import { token } from "@/styled-system/tokens";
import { css } from "@/styled-system/css/css";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { SecondaryHeading } from "@/styles/text.styles";

export interface ListCardProps extends ComponentProps<typeof ListCardStyled> {
  id: string;
  name: string;
  destination?: string;
  date?: string;
  itemCount: number;
  status: string;
  items: any[];
}
export const ListCardStyled = styled(Link, {
  base: {
    border: "1px solid",
    borderColor: {
      base: "gray.300",
      _dark: "gray.600",
    },
    background: {
      base: "white",
      _dark: "gray.800",
    },
    display: "flex",
    padding: token("spacing.4"),
    borderRadius: token("radii.sm"),
  },
});

const ItemCountContainer = styled("p", {
  base: {
    color: {
      base: "gray.500",
      _dark: "gray.300",
    },
    fontSize: token("fontSizes.sm"),
  },
});
const ItemCount = styled("span", {
  base: {
    color: {
      base: "gray.700",
      _dark: "gray.200",
    },
    fontWeight: "bold",
  },
});

export function ListCard({ list }: { list: ListCardProps }) {
  const { id, name, destination, date, items } = list;
  const itemCount = items.length;
  const packedCount = items.filter((item) => item.isPacked).length;
  console.log("ListCard list:", list);
  return (
    <ListCardStyled href={`/lists/${id}`}>
      <div style={{ flex: "1 1 auto" }}>
        <SecondaryHeading
          className={css({
            flex: "1 1 auto",
          })}
        >
          {name}
        </SecondaryHeading>
        {destination && (
          <p style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MapPin />
            {destination}
          </p>
        )}
        {date && <div>{date}</div>}
      </div>
      <div style={{ textAlign: "right" }}>
        <ItemCountContainer>
          <ItemCount>{packedCount}</ItemCount> / {itemCount} items
        </ItemCountContainer>
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "100%",
              height: "13px",
              backgroundColor: "lightgray",
              borderRadius: token("radii.xs"),
            }}
          ></div>
          <p>
            {itemCount > 0 ? Math.round((packedCount / itemCount) * 100) : 0}%
            Packed
          </p>
        </div>
      </div>
    </ListCardStyled>
  );
}
