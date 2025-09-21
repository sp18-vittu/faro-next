import Styles from "./styles/Micons.module.scss";

interface MiconsProps {
  icon: string;
  type?: string;
  className?: string;
  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  isHover?: boolean;
  wrapperClassName?: string;
  [x: string]: any;
}

const Micons: React.FC<MiconsProps> = ({
  icon,
  type = "outlined",
  className,
  style,
  wrapperStyle,
  isHover = true,
  wrapperClassName,
  ...rest
}) => {
  return (
    <div {...rest} style={wrapperStyle || {}} className={wrapperClassName}>
      <span
        className={`m-icons material-icons${
          type && type !== "" && type !== "filled" ? `-${type}` : ""
        } ${Styles.icon}${isHover && ` ${Styles["hover"]}`} ${
          className ? className : ""
        }`}
        style={style || {}}
      >
        {icon}
      </span>
    </div>
  );
};

export default Micons;

