import React from 'react';
import styles from './StatCard.module.css';

export type StatCardProps = {
    title: string;
    total: number;
    items: { label: string; value: number | string }[];
    onAdd?: () => void;
    onEdit?: (index: number) => void;
    onDelete?: (index: number) => void;
    onIncrement?: (index: number) => void;
    onDecrement?: (index: number) => void;
    addLabel?: string;
    showControls?: boolean;
    showValue?: boolean;
};

const StatCard = ({
                      title,
                      total,
                      items,
                      onAdd,
                      onEdit,
                      onDelete,
                      onIncrement,
                      onDecrement,
                      addLabel,
                      showControls = true,
                      showValue = true,
                  }: StatCardProps) => {
    return (
        <div className={styles.statCard}>
            <h3 className={styles.statTitle}>{title}</h3>

            <div className={styles.statTotal}>
                <span>Всего</span>
                <span className={styles.statTotalValue}>{total}</span>
            </div>

            <div className={styles.statItems}>
                {items.length === 0 && (
                    <p className={styles.statEmpty}>Нет записей</p>
                )}

                {items.map((item, index) => (
                    <div key={index} className={styles.statItem}>
                        <span className={styles.statLabel}>{item.label}</span>

                        {showValue && (
                            <span className={styles.statValue}>{item.value}</span>
                        )}

                        {(onIncrement || onDecrement) && (
                            <div className={styles.statActions}>
                                {onDecrement && (
                                    <button
                                        className={styles.statButton}
                                        onClick={() => onDecrement(index)}
                                    >
                                        –
                                    </button>
                                )}
                                {onIncrement && (
                                    <button
                                        className={styles.statButton}
                                        onClick={() => onIncrement(index)}
                                    >
                                        ✚
                                    </button>
                                )}
                            </div>
                        )}

                        {showControls && (
                            <div className={styles.statControls}>
                                {onEdit && (
                                    <button
                                        className={styles.statButton}
                                        onClick={() => onEdit(index)}
                                    >
                                        🖉
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        className={styles.statButton}
                                        onClick={() => onDelete(index)}
                                    >
                                        ✖
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {onAdd && addLabel && (
                <button className={styles.addButton} onClick={onAdd}>
                    {addLabel}
                </button>
            )}
        </div>
    );
};

export default StatCard;
