import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, List, message } from "antd";
import ReactMarkdown from 'react-markdown';

import { MusicPlayer } from "@/components/Benefits/MusicComponents/MusicPlayer";
import { SongCard } from "@/components/Benefits/MusicComponents/SongCard";
import { usePassStore } from "@/state/PassState";
import { Benefit } from "@/shared/types/types";
import { earnPointsFromRelation } from "@/utils/points";
import styles from "./style.module.scss";

const data = [1, 2, 3, 4, 5];
interface MusicBenefitPropType {
  benefit: Benefit;
  template?: string;
}

export const MusicBenefit = (props: MusicBenefitPropType) => {
  const { t } = useTranslation()
  const { benefit, template } = props;
  const passData = usePassStore((state) => state.passData)
  const [songs, setSongs] = React.useState(benefit.BenefitResource);
  const [currentSong, setCurrentSong] = React.useState(-1);
  const [autoPlay, setAutoPlay] = React.useState(false);
  const player = useRef();
  const currentSrc = React.useMemo(() => {
    return songs[currentSong]?.resourceUrl;
  }, [currentSong, songs]);

  const handlePlayClick = (index: number) => {
    setCurrentSong(index);
    setAutoPlay(true);
  };

  const handleNext = () => {
    const nextSong =
      songs.length > 1
        ? currentSong < songs.length - 1
          ? currentSong + 1
          : 0
        : 0;
    setCurrentSong(nextSong);
    setAutoPlay(true);
  };

  const onPlay = () => {
    earnPointsFromRelation(passData, benefit, t)
  }

  const handlePrev = () => {
    const nextSong =
      songs.length > 1
        ? currentSong > 0
          ? currentSong - 1
          : songs.length - 1
        : 0;
    setCurrentSong(nextSong);
    setAutoPlay(true);
  };
  return (
    <>
      {songs.length > 0 && (
        <div className={styles.container}>
          <div className={styles.playerContainer}>
            <div className={styles.musicContainer}>
              <MusicPlayer
                song={songs[currentSong < 0 ? 0 : currentSong]}
                showSkipControls={songs.length > 1 ? true : false}
                onClickNext={handleNext}
                onClickPrev={handlePrev}
                albumImage={benefit.previewResourceUrl}
                autoPlay={autoPlay}
                onPlay={onPlay}
                template={template}
              />
            </div>
          </div>
          <div className={styles.songListContainer}>
            <List
              bordered={false}
              className={styles.list}
              itemLayout="horizontal"
              dataSource={songs}
              size="small"
              renderItem={(song, id) => (
                <List.Item className={styles.item}>
                  <SongCard
                    song={song}
                    id={id}
                    onClickPlay={() => handlePlayClick(id)}
                    albumImage={benefit.previewResourceUrl}
                    template={template}
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      )}
      {/* {!songs && (<div>No songs found</div>)} */}
    </>
  );
};
