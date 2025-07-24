import React from 'react';
import styles from './StatCard.module.css';

export type StatCardProps = {
    title: string;
    total: number;
    items: { label: string; value?: number | string }[];
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
                <p>Всего</p>
                <p className={styles.statTotalValue}>{total}</p>
            </div>

            <div className={styles.statItems}>
                {items.length === 0 ? (
                    <p className={styles.statEmpty}>Нет записей</p>
                ) : (
                    items.map((item, index) => (
                        <div key={index} className={styles.statItem}>
                            <p className={styles.statLabel}>{item.label}</p>

                            {showValue && (
                                <p className={styles.statValue}>{item.value}</p>
                            )}

                            {(onIncrement || onDecrement) && (
                                <div className={styles.statActions}>
                                    {onDecrement && (
                                        <button
                                            className={styles.statButton}
                                            aria-label={`Уменьшить значение ${item.label}`}
                                            onClick={() => onDecrement(index)}
                                            type="button"
                                        >
                                            –
                                        </button>
                                    )}
                                    {onIncrement && (
                                        <button
                                            className={styles.statButton}
                                            aria-label={`Увеличить значение ${item.label}`}
                                            onClick={() => onIncrement(index)}
                                            type="button"
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
                                            aria-label={`Редактировать ${item.label}`}
                                            onClick={() => onEdit(index)}
                                            type="button"
                                        >
                                            🖉
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            className={styles.statButton}
                                            aria-label={`Удалить ${item.label}`}
                                            onClick={() => onDelete(index)}
                                            type="button"
                                        >
                                            ✖
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {onAdd && addLabel && (
                <button className={styles.addButton} onClick={onAdd} type="button">
                    {addLabel}
                </button>
            )}
        </div>
    );
};

export default StatCard;
