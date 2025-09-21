import React, { useEffect, useRef, useState } from "react";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { ReactReader } from "react-reader";

import styles from "./style.module.scss";

export const PDFViewer = ({ url }: { url: string }) => {
  const [location, setLocation] = useState<string | null>(null);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const renditionRef: any = useRef(null)

  const locationChanged = React.useCallback(
    (epubcifi: string) => {
      setLocation(epubcifi);
    },
    [setLocation]
  );

  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.resize();
      renditionRef.current.themes.fontSize('20px !important');
    }
  }, [fullScreen, renditionRef])

  return (
    <div
      className={`${styles.modalContent}${
        fullScreen ? ` ${styles["full-screen"]}` : ""
      }`}
    >
      <div className={styles["full-screen-icon"]}>
        {fullScreen ? (
          <FullscreenExitOutlined
            style={{ color: "rgb(156 156 156)", fontSize: 20 }}
            onClick={() => setFullScreen(false)}
          />
        ) : (
          <FullscreenOutlined
            style={{ color: "rgb(156 156 156)", fontSize: 20 }}
            onClick={() => setFullScreen(true)}
          />
        )}
      </div>
      <ReactReader
        location={location || undefined}
        locationChanged={locationChanged}
        url={url}
        getRendition={(rendition) => {
          renditionRef.current = rendition
          rendition.themes.register("custom", {
            p: {
              "font-family": '"Inter", sans-serif !important',
              "font-weight": "400 !important",
              "font-size": "14px !important",
              "line-height": "22px",
              "margin-bottom": "20px !important",
            },
          });
          rendition.themes.select("custom");
        }}
      />
    </div>
  );
};
