import React, { useEffect, useRef, useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player/file";

import styles from "./style.module.scss";
interface VideoCardPropsType {
  video: any;
  onPlayClick: () => void;
  playing: boolean;
  playerRef: any;
}

export const VideoCard = (props: VideoCardPropsType) => {
  const { onPlayClick, video } = props;
  const [videoDuration, setVideoDuration] = useState(null);
  const thumbnailRef: any = useRef(null);

  function secondsToMinutes(seconds: number) {
    const totalSeconds = Math.floor(seconds); // round the input value to the nearest second
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
   }

  return (
    <div className={styles.container} onClick={onPlayClick}>
      <div className={styles.info}>
        <video
          src={video.resourceUrl}
          width={70}
          height={50}
          onCanPlay={() => setVideoDuration(thumbnailRef.current?.duration)}
          ref={thumbnailRef}
        />
        <div>
          <h1 className={styles.h1}>{video.name}</h1>
          <div className={styles.h2}>{video.description}</div>
          {videoDuration && (
            <div className={styles.duration}>
              <ClockCircleOutlined style={{ color: "#a7a7a7" }} />
              <div className={styles.h3}>
                {secondsToMinutes(videoDuration)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
