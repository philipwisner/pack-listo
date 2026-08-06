import Link from "next/link";
import { styled } from "@/styled-system/jsx/factory";
import { token } from "@/styled-system/tokens";
import { css } from "@/styled-system/css/css";
import { MapPin } from "lucide-react";
import { SecondaryHeading } from "@/styles/text.styles";
import { List, ListItem } from "@/generated/prisma/browser";

export interface ListCardProps extends List {
  itemCount?: number;
  date?: string;
  items?: ListItem[];
  href?: string;
}

const listCardBaseStyles = {
  border: "1px solid",
  marginBottom: "{spacing.4}",
  borderColor: {
    base: "gray.300",
    _dark: "gray.600",
  },
  background: {
    base: "white",
    _dark: "gray.900",
  },
  display: "flex",
  paddingInline: "{spacing.8}",
  paddingBlock: "{spacing.6}",
  borderRadius: "{radii.sm}",
};

export const ListCardStyled = styled(Link, {
  base: listCardBaseStyles,
});

export const ListCardSkeletonStyled = styled("div", {
  base: listCardBaseStyles,
});

export const ItemCountContainer = styled("p", {
  base: {
    color: {
      base: "gray.500",
      _dark: "gray.300",
    },
    fontSize: "{fontSizes.base}",
  },
});

export const ItemCount = styled("span", {
  base: {
    color: {
      base: "gray.700",
      _dark: "gray.200",
    },
    fontWeight: "{fontWeights.bold}",
  },
});

export const ProgressBarLabel = styled("p", {
  base: {
    flex: "1 0 auto",
    marginRight: "{spacing.3}",
    fontWeight: "{fontWeights.medium}",
    color: "{colors.text.muted}",
  },
});

export const ProgressBar = styled("div", {
  base: {
    background: {
      base: "gray.200",
      _dark: "gray.700",
    },
    width: "100%",
    maxWidth: "200px",
    minWidth: "150px",
    height: "13px",
    borderRadius: "{radii.xs}",
    display: "flex",
    overflow: "hidden",
  },
});

export function ListCard({ list }: { list: ListCardProps; loading?: boolean }) {
  const { id, name, destination, date, items } = list;
  const itemCount = items?.length ?? 0;
  const packedCount = items?.filter((item) => item.isPacked).length ?? 0;
  const packedPercent = Math.round((packedCount / itemCount) * 100);
  console.log("ListCard list:", list);
  return (
    <ListCardStyled href={`/lists/${id}`}>
      <div style={{ flex: "1 1 auto" }}>
        <SecondaryHeading>{name}</SecondaryHeading>
        <p
          style={{
            display: "flex",
            alignItems: "center",
            color: token("colors.gray.400"),
            gap: token("spacing.1"),
            fontSize: token("fontSizes.base"),
            marginTop: token("spacing.2"),
          }}
        >
          <MapPin color={token("colors.gray.400")} size={18} />
          {destination ? destination : "None"}
        </p>
        {date && <div>{date}</div>}
      </div>
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <ItemCountContainer>
          <ItemCount>{packedCount}</ItemCount> / {itemCount} items
        </ItemCountContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <ProgressBarLabel>
            {packedPercent ? packedPercent : 0}% Packed
          </ProgressBarLabel>
          <ProgressBar>
            <p
              style={{
                width: `${packedPercent}%`,
                zIndex: 1,
                backgroundColor: token("colors.accent"),
              }}
            ></p>
          </ProgressBar>
        </div>
      </div>
    </ListCardStyled>
  );
}

export function ListCardSkeleton() {
  return (
    <ListCardSkeletonStyled>
      <div style={{ flex: "1 1 auto" }}>
        <SecondaryHeading
          className={css({
            flex: "1 1 auto",
          })}
        ></SecondaryHeading>
        <p style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <MapPin />
        </p>
        <div>x</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <ItemCountContainer>
          <ItemCount>0</ItemCount> / 0 items
        </ItemCountContainer>
        <div style={{ display: "flex" }}>
          <ProgressBar />
          <p>Packed</p>
        </div>
      </div>
    </ListCardSkeletonStyled>
  );
}
