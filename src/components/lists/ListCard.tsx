import React from 'react';
import Link from 'next/link';
import styles from './Lists.module.css';

interface ListCardProps {
  id: string;
  name: string;
  destination?: string;
  date?: string;
  itemCount: number;
  status: string;
}

export function ListCard({ id, name, destination, date, itemCount, status }: ListCardProps) {
  return (
    <Link href={`/lists/${id}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.status}>{status}</span>
        <span className={styles.id}>#{id.slice(0, 4).toUpperCase()}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        {destination && <div className={styles.info}><span className={styles.label}>DEST:</span> {destination}</div>}
        {date && <div className={styles.info}><span className={styles.label}>DATE:</span> {date}</div>}
      </div>
      <div className={styles.footer}>
        <div className={styles.counter}>
          <span className={styles.count}>{itemCount}</span>
          <span className={styles.countLabel}>MANIFEST ITEMS</span>
        </div>
        <div className={styles.arrow}>→</div>
      </div>
    </Link>
  );
}
