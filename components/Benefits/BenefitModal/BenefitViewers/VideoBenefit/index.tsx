import { List } from "antd";
import React, { useRef, useEffect } from "react";
import ReactPlayer from "react-player/file";
import test from "../../../../../public/test.png";

import styles from "./style.module.scss";
import { VideoCard } from "@/components/Benefits/VideoComponents/VideoCard";
import { usePassStore } from "@/state/PassState";
import { Benefit } from "@/shared/types/types";
import { useTranslation } from "react-i18next";
import { earnPointsFromRelation } from "@/utils/points";
const playlist = [
  {
    name: "TEST1",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    sources: [
      {
        src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      },
    ],
    duration: 45,
    thumbnail: [
      {
        srcset: "test/example/oceans.jpg",
        type: "image/jpeg",
        media: "(min-width: 400px;)",
      },
      {
        src: "test/example/oceans-low.jpg",
      },
    ],
  },
  {
    name: "TEST2",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    sources: [
      {
        src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      },
    ],
    duration: 45,
    thumbnail: [
      {
        src: test.src,
      },
    ],
  },
  {
    name: "TEST3",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    sources: [
      {
        src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      },
    ],
  },
  {
    name: "TEST4",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    sources: [
      {
        src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
      },
    ],
  },
  {
    name: "TEST5",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    sources: [
      {
        src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      },
    ],
  },
];

interface VideoBenefitPropType {
  benefit: Benefit;
}

export const VideoBenefit = (props: VideoBenefitPropType) => {
  const { t } = useTranslation()
  const { benefit } = props;
  const passData = usePassStore((state) => state.passData)
  const [videos, setVideos] = React.useState(benefit.BenefitResource);
  const [currentVideo, setCurrentVideo] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState<number | undefined>(undefined);
  const playerRef = useRef<ReactPlayer>(null);

  const currentSrc = React.useMemo(() => {
    return videos[currentVideo].resourceUrl;
  }, [currentVideo, videos]);

  const handlePlayClick = React.useCallback(
    (index: number) => {
      setCurrentVideo(index);
      setPlaying(true);
    },
    [currentVideo, playing]
  );

  const onPlayStart = () => {
    earnPointsFromRelation(passData, benefit, t)
  }

  useEffect(() => {
    if (playing) {
      playerRef.current?.getInternalPlayer()?.play();
      if (playerRef.current?.getInternalPlayer().mozRequestFullScreen) {
        playerRef.current?.getInternalPlayer().mozRequestFullScreen();
      } else if (playerRef.current?.getInternalPlayer().webkitRequestFullScreen) {
        playerRef.current?.getInternalPlayer()?.webkitRequestFullScreen();
      }

    }
  }, [currentVideo, playing, playerRef]);

  return (
    <div className={styles.container}>
      <div className={styles.videoPlayerContainer}>
        <div className={styles.videoPlayerWrapper}>
          <ReactPlayer
            ref={playerRef}
            className={styles.videoPlayer}
            url={currentSrc}
            controls={true}
            playing={playing}
            onStart={onPlayStart}
          ></ReactPlayer>
        </div>
      </div>
      <div className={styles.listContainer}>
        <List className={styles.list}>
          {videos &&
            videos.map((video, indx) => {
              return (
                <VideoCard
                  key={`videoCard-${indx}`}
                  video={video}
                  onPlayClick={() => handlePlayClick(indx)}
                  playing={playing}
                  playerRef={playerRef}
                />
              );
            })}
        </List>
      </div>
    </div>
  );
};
