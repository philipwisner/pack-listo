"use client";
import { useMemo, useState } from "react";
import { Select, createListCollection } from "@ark-ui/react/select";
import { ChevronDown, Check } from "lucide-react";
import { styled } from "@/styled-system/jsx";
import { token } from "@/styled-system/tokens";

// ─── Styled Parts ────────────────────────────────────────────────────────────

const Trigger = styled("button", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "left",
    width: "100%",
    px: "4",
    py: "3",
    borderRadius: "md",
    border: "1px solid",
    borderColor: "input.border.default",
    background: "input.background.default",
    color: "input.text",
    fontSize: "base",
    cursor: "pointer",
    transition: "all 0.2s ease",
    _hover: {
      borderColor: "input.border.hover",
    },
    _focus: {
      outline: "1.5px solid",
      outlineColor: "input.focusRing.default",
      outlineOffset: "2px",
      borderColor: "input.border.focus",
    },
    _open: {
      borderColor: "input.border.focus",
    },
  },
  variants: {
    hasError: {
      true: {
        borderColor: "input.border.error",
        bg: "input.background.error",
        _focus: {
          borderColor: "input.border.focusError",
          outlineColor: "input.focusRing.error",
        },
        _hover: { borderColor: "input.border.hoverError" },
      },
    },
  },
});

const Content = styled("div", {
  base: {
    background: "input.background.default",
    border: "1px solid",
    borderColor: "input.border.default",
    borderRadius: "md",
    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
    overflow: "hidden",
    zIndex: 1100,
    minWidth: "var(--reference-width)",
    _open: {
      animation: "fadeIn 0.15s ease",
    },
    _closed: {
      animation: "fadeOut 0.1s ease",
    },
  },
});

const ItemStyled = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: "4",
    py: "2.5",
    fontSize: "base",
    color: "input.text",
    cursor: "pointer",
    transition: "background 0.15s ease",
    _highlighted: {
      background: "input.border.default",
    },
    _checked: {
      fontWeight: "semibold",
    },
  },
});

const PlaceholderText = styled("span", {
  base: {
    color: "input.placeholder.default",
    opacity: 1,
  },
});

const ValueText = styled("span", {
  base: {
    color: "input.text",
  },
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CustomSelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  name: string;
  /** Accessible label */
  label?: string;
  placeholder?: string;
  options: CustomSelectOption[];
  defaultValue?: string;
  required?: boolean;
  hasError?: boolean;
  /** Close the dropdown after an item is selected. Defaults to true. */
  closeOnSelect?: boolean;
  /** Allow selecting multiple items. Defaults to false. */
  multiple?: boolean;
  /** Called whenever the selection changes */
  onValueChange?: (value: string | string[] | null) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CustomSelect({
  name,
  placeholder = "Select an option",
  options,
  defaultValue,
  required,
  hasError,
  closeOnSelect = true,
  multiple = false,
  onValueChange,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CustomSelectOption[]>(
    () => {
      if (!defaultValue) return [];
      const match = options.find((o) => o.value === defaultValue);
      return match ? [match] : [];
    },
  );

  const collection = useMemo(
    () =>
      createListCollection({
        items: options,
        itemToValue: (o) => o.value,
        itemToString: (o) => o.label,
      }),
    [options],
  );

  const defaultValueArray = defaultValue ? [defaultValue] : [];

  return (
    <Select.Root
      collection={collection}
      name={name}
      required={required}
      defaultValue={defaultValueArray}
      multiple={multiple}
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      onValueChange={(details) => {
        const items = details.items as CustomSelectOption[];
        setSelectedItems(items);

        if (multiple) {
          onValueChange?.(details.value.length > 0 ? details.value : null);
        } else {
          onValueChange?.(details.value[0] ?? null);
        }
        if (closeOnSelect) {
          setOpen(false);
        }
      }}
    >
      <Select.Control>
        <Select.Trigger asChild>
          <Trigger type="button" hasError={hasError}>
            {selectedItems.length === 0 ? (
              <PlaceholderText>{placeholder}</PlaceholderText>
            ) : (
              <ValueText>
                {selectedItems.map((i) => i.label).join(", ")}
              </ValueText>
            )}
            <ChevronDown
              size={16}
              style={{
                color: token("colors.input.placeholder.default"),
                flexShrink: 0,
                transition: "transform 0.2s ease",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </Trigger>
        </Select.Trigger>
      </Select.Control>
      {open && (
        <Select.Positioner>
          <Select.Content asChild>
            <Content>
              {options.map((option) => (
                <Select.Item key={option.value} item={option} asChild>
                  <ItemStyled>
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check
                        size={14}
                        style={{ color: token("colors.input.border.focus") }}
                      />
                    </Select.ItemIndicator>
                  </ItemStyled>
                </Select.Item>
              ))}
            </Content>
          </Select.Content>
        </Select.Positioner>
      )}
      <Select.HiddenSelect />
    </Select.Root>
  );
}
