import styles from "./Items.module.css";

interface ItemRowProps {
  id: string;
  name: string;
  weight?: number;
  // 1. Update the interface to allow null
  category: { name: string; color?: string | null } | null;
  onEdit?: () => void;
}

export function ItemRow({ id, name, weight, category, onEdit }: ItemRowProps) {
  return (
    <div className={styles.itemRow}>
      <div className={styles.idCol}>#{id.slice(0, 4).toUpperCase()}</div>
      <div className={styles.nameCol}>{name}</div>

      {/* 2. Update rendering logic with conditional checking */}
      <div className={styles.categoryCol}>
        {category ? (
          <span style={{ borderColor: category.color ?? "var(--border)" }}>
            {category.name}
          </span>
        ) : (
          <span style={{ borderColor: "var(--border)", opacity: 0.5 }}>
            Uncategorized
          </span>
        )}
      </div>

      <div className={styles.weightCol}>{weight ? `${weight}KG` : "-"}</div>
      <div className={styles.actionCol}>
        <button className={styles.editBtn} onClick={onEdit}>
          EDIT
        </button>
      </div>
    </div>
  );
}
