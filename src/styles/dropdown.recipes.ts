import { defineSlotRecipe } from "@pandacss/dev";
import { menuAnatomy } from "@ark-ui/react/anatomy";

export const menuRecipe = defineSlotRecipe({
  className: "menu",
  // Automatically pulls in 'trigger', 'content', 'item', 'positioner', etc.
  slots: menuAnatomy.keys(),
  base: {
    trigger: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "2",
      paddingX: "4",
      paddingY: "2",
      borderRadius: "md",
      fontSize: "sm",
      fontWeight: "medium",
      cursor: "pointer",
      background: { base: "white", _dark: "gray.800" },
      color: { base: "gray.800", _dark: "white" },
      border: "1px solid",
      borderColor: { base: "gray.300", _dark: "gray.700" },
      transition: "background 0.2s",
      _hover: { background: { base: "gray.50", _dark: "gray.700" } },
    },
    positioner: {
      zIndex: "popover",
    },
    content: {
      background: { base: "white", _dark: "gray.800" },
      borderRadius: "md",
      boxShadow: "lg",
      border: "1px solid",
      borderColor: { base: "gray.200", _dark: "gray.700" },
      minWidth: "220px",
      display: "flex",
      flexDirection: "column",
      padding: "1",
      outline: "none",
      transformOrigin: "var(--transform-origin)",

      // Animations triggered by Ark's built-in state management
      opacity: 0,
      transform: "scale(0.95)",
      transition: "opacity 0.15s ease, transform 0.15s ease",
      _open: {
        opacity: 1,
        transform: "scale(1)",
      },
      _closed: {
        opacity: 0,
        transform: "scale(0.95)",
      },
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingX: "2",
      paddingY: "1.5",
      borderRadius: "sm",
      fontSize: "sm",
      color: { base: "gray.700", _dark: "gray.200" },
      cursor: "pointer",
      outline: "none",
      transition: "background 0.15s, color 0.15s",

      // Ark UI automatically applies data-highlighted on hover/keyboard focus
      _highlighted: {
        background: { base: "gray.100", _dark: "gray.700" },
        color: { base: "gray.900", _dark: "white" },
      },
      _disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
    itemGroup: {},
    itemGroupLabel: {
      fontWeight: "semibold",
      fontSize: "xs",
      paddingX: "2",
      paddingY: "1.5",
      color: { base: "gray.500", _dark: "gray.400" },
    },
    separator: {
      height: "1px",
      borderColor: { base: "gray.200", _dark: "gray.700" },
      marginY: "1",
      marginX: "-1",
    },
  },
});
