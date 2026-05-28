import type { FaqCategory } from '../../data/faqData';
import styles from './FAQTabs.module.scss';

type Props = {
  categories: FaqCategory[];
  activeId: string;
  onChange: (id: string) => void;
};

export default function FAQTabs({ categories, activeId, onChange }: Props) {
  return (
    <div className={styles.tabsWrap} role="tablist" aria-label="FAQ 카테고리">
      {categories.map((cat) => {
        const isActive = cat.id === activeId;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${cat.id}`}
            id={`tab-${cat.id}`}
            tabIndex={isActive ? 0 : -1}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(cat.id)}
          >
            {cat.title}
          </button>
        );
      })}
    </div>
  );
}
