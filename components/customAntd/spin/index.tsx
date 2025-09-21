import { Spin, SpinProps } from "antd";

interface ISpinnerProps extends SpinProps {
  className?: string;
  style?: React.CSSProperties;
}

const Spinner = ({ className, ...rest }: ISpinnerProps) => {
  return <Spin className={className} {...rest} />;
};

export default Spinner;
