import React from 'react';
import styles from './Items.module.css';

interface ItemRowProps {
  id: string;
  name: string;
  weight?: number;
  categories: { name: string; color?: string | null }[];
  onEdit?: () => void;
}

export function ItemRow({ id, name, weight, categories, onEdit }: ItemRowProps) {
  return (
    <div className={styles.itemRow}>
      <div className={styles.idCol}>#{id.slice(0, 4).toUpperCase()}</div>
      <div className={styles.nameCol}>{name}</div>
      <div className={styles.categoryCol}>
        {categories.map((cat, i) => (
          <span key={i} className={styles.categoryTag} style={{ borderColor: cat.color || 'var(--border)' }}>
            {cat.name}
          </span>
        ))}
      </div>
      <div className={styles.weightCol}>{weight ? `${weight}KG` : '-'}</div>
      <div className={styles.actionCol}>
        <button className={styles.editBtn} onClick={onEdit}>EDIT</button>
      </div>
    </div>
  );
}
