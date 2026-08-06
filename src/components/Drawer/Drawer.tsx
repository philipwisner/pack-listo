import { Drawer as DrawerUI } from "@ark-ui/react/drawer";
import { XIcon } from "lucide-react";
import styles from "./drawer.module.css";

export type SwipeDrawerProps = {
  triggerLabel?: React.ReactNode;
  customTrigger?: React.ReactElement;
  children: React.ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  closeDrawer?: () => void;
  snapPoints?: number[];
  defaultSnapPoint?: number;
  modal?: boolean;
  showClose?: boolean;
  draggable?: boolean;
};

export const Drawer = ({
  triggerLabel,
  customTrigger,
  children,
  isOpen,
  defaultOpen,
  snapPoints,
  defaultSnapPoint,
  modal = false,
  showClose = false,
  closeDrawer,
  draggable = false,
}: SwipeDrawerProps) => {
  return (
    <DrawerUI.Root
      open={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={closeDrawer}
      snapPoints={snapPoints}
      defaultSnapPoint={defaultSnapPoint}
      modal={modal}
    >
      {customTrigger ? (
        <DrawerUI.Trigger asChild>{customTrigger}</DrawerUI.Trigger>
      ) : triggerLabel ? (
        <DrawerUI.Trigger className={styles.Trigger}>
          {triggerLabel}
        </DrawerUI.Trigger>
      ) : null}
      <DrawerUI.Backdrop className={styles.Backdrop} />
      <DrawerUI.Positioner className={styles.Positioner}>
        <DrawerUI.Content className={styles.Content} draggable={draggable}>
          <DrawerUI.Grabber className={styles.Grabber}>
            <DrawerUI.GrabberIndicator className={styles.GrabberIndicator} />
          </DrawerUI.Grabber>
          {showClose && (
            <DrawerUI.CloseTrigger className={styles.CloseTrigger}>
              <XIcon />
            </DrawerUI.CloseTrigger>
          )}
          <div className={styles.Scrollable}>{children}</div>
        </DrawerUI.Content>
      </DrawerUI.Positioner>
    </DrawerUI.Root>
  );
};
