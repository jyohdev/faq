import { useState, useId } from 'react';
import type { FaqItem } from '../../data/faqData';
import styles from './FAQAccordion.module.scss';

type Props = {
  items: FaqItem[];
  /** SSR/CSR 모두에서 안정적인 id 접두어 */
  idPrefix: string;
};

export default function FAQAccordion({ items, idPrefix }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const uid = useId();

  return (
    <ul className={styles.list}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${idPrefix}-${uid}-panel-${index}`;
        const buttonId = `${idPrefix}-${uid}-button-${index}`;

        return (
          <li key={index} className={`${styles.item} ${isOpen ? styles.open : ''}`}>
            <h3 className={styles.questionHeading}>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={styles.questionButton}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className={styles.qMark} aria-hidden="true">
                  Q
                </span>
                <span className={styles.questionText}>{item.question}</span>
                <span className={styles.chevron} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={styles.answerPanel}
            >
              <div className={styles.answerInner}>
                <span className={styles.aMark} aria-hidden="true">
                  A
                </span>
                <p className={styles.answerText}>{item.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
