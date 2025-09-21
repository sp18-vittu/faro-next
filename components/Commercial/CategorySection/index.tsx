import styles from "./categorySection.module.scss";

const CategorySection = ({
  title,
  extra,
  children,
  wrapperClassName,
  wrapperStyle,
  titleClassName,
  titleStyle,
  id,
}: {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  titleClassName?: string;
  titleStyle?: React.CSSProperties;
  id?: string;
  // title could be used here to give the id but the title is translated into Japanese as well
}) => {
  return (
    <div
      className={`${styles["category-section"]} ${
        wrapperClassName || ""
      } container`}
      style={wrapperStyle || {}}
      id={id ?? ""}
    >
      <div
        className={`${styles["heading-cont"]} ${titleClassName || ""}`}
        style={titleStyle || {}}
      >
        <h3 className={styles["heading"]}>{title}</h3>
        {extra && extra}
      </div>
      {children}
    </div>
  );
};

export default CategorySection;
