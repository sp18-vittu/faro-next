import { useEffect } from 'react';
import { Modal as AntdModal } from 'antd';

const Modal = ({ children, isOpen, ...rest }: any) => {
  useEffect(() => {
    if (isOpen) {
      document.getElementsByTagName("html")[0].style.overflowY = "hidden";
    } else {
      document.getElementsByTagName("html")[0].style.overflowY = '';
    }
  }, [isOpen]);

  return (
    <AntdModal open={isOpen} destroyOnClose footer={[]} {...rest}>
      {children}
    </AntdModal>
  )
}

export default Modal;