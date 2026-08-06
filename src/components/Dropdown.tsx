import { Fragment, useState } from "react";
import { Menu } from "@ark-ui/react/menu";
import { menu } from "@/styled-system/recipes";
import { ChevronDown } from "lucide-react";
import { token } from "@/styled-system/tokens";

export type DropdownItemConfig = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  href?: string;
};

export type DropdownGroupConfig = {
  id: string;
  label: string;
  items: DropdownItemConfig[];
};

export type DropdownProps = {
  triggerLabel?: React.ReactNode;
  customTrigger?: React.ReactElement;
  items?: DropdownItemConfig[];
  groups?: DropdownGroupConfig[];
  onSelect?: (id: string) => void;
  showArrow?: boolean;
};

export const Dropdown = ({
  triggerLabel,
  customTrigger,
  items = [],
  groups = [],
  showArrow = true,
  onSelect,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Invoke the Panda recipe to generate the slot class names
  const classes = menu();

  const renderItem = (item: DropdownItemConfig) => {
    const itemContent = (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: "2" }}>
          {item.icon && <span>{item.icon}</span>}
          <span>{item.label}</span>
        </div>
        {item.shortcut && (
          <span
            style={{
              fontSize: "xs",
              color: "gray.400",
              letterSpacing: "widest",
            }}
          >
            {item.shortcut}
          </span>
        )}
      </>
    );

    // If href is provided, render natively as a link using `asChild`
    if (item.href) {
      return (
        <Menu.Item
          key={item.id}
          value={item.id}
          disabled={item.disabled}
          className={classes.item}
          asChild
        >
          <a
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : "_self"}
          >
            {itemContent}
          </a>
        </Menu.Item>
      );
    }

    // Otherwise render as a standard menu button
    return (
      <Menu.Item
        key={item.id}
        value={item.id}
        disabled={item.disabled}
        className={classes.item}
      >
        {itemContent}
      </Menu.Item>
    );
  };

  return (
    <Menu.Root
      onSelect={(details) => onSelect?.(details.value)}
      open={isOpen}
      onOpenChange={(details) => setIsOpen(details.open)}
    >
      {customTrigger ? (
        <Menu.Trigger asChild>{customTrigger}</Menu.Trigger>
      ) : (
        <Menu.Trigger className={classes.trigger}>
          {triggerLabel}
          {showArrow && (
            <ChevronDown
              aria-hidden
              size={16}
              style={{
                color: token("colors.input.placeholder.default"),
                flexShrink: 0,
                transition: "transform 0.2s ease",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          )}
        </Menu.Trigger>
      )}
      <Menu.Positioner className={classes.positioner}>
        <Menu.Content className={classes.content}>
          {items.map(renderItem)}
          {groups.map((group, index) => (
            <Fragment key={group.id}>
              {(items.length > 0 || index > 0) && (
                <Menu.Separator className={classes.separator} />
              )}
              <Menu.ItemGroup id={group.id} className={classes.itemGroup}>
                <Menu.ItemGroupLabel className={classes.itemGroupLabel}>
                  {group.label}
                </Menu.ItemGroupLabel>

                {group.items.map(renderItem)}
              </Menu.ItemGroup>
            </Fragment>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};
