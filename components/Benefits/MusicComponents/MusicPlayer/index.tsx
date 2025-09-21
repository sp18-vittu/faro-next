import Image from "next/image";
import React, { useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/src/styles.scss";

import test from "../../../../public/test.png";
import { BenefitResource } from "@/shared/types/types";
import Url from "epubjs/types/utils/url";

import styles from "./style.module.scss";
import { JapaneseTemplateName } from "@/constant";

interface MusicPlayerProps {
  song: BenefitResource;
  onClickNext?: () => void;
  onClickPrev?: () => void;
  onPlay?: () => void;
  showSkipControls?: boolean;
  autoPlay?: boolean;
  albumImage?: any;
  template?: string;
}
export const MusicPlayer = (props: MusicPlayerProps) => {
  const {
    autoPlay = false,
    song,
    onClickNext,
    onClickPrev,
    onPlay,
    showSkipControls = false,
    albumImage,
    template,
  } = props;
  return (
    <div className={styles.container}>
      {/* <div className={styles.nextSong}><p className={styles.p}>Next - <b className={styles.b}>Song</b></p></div> */}
      {/* <Image className={styles.songImage} src={albumImage} alt="music image" width={100} height={100} />
            <div className={styles.songTitle}>
                <h1 className={styles.h1}>{song.name}</h1>
                <h2 className={styles.h2}> {song.author}</h2>
            </div> */}
      <div className={styles["song-image"]}>
        <Image
          className={styles.songImage}
          src={albumImage}
          alt="music image"
          width={150}
          height={150}
        />
      </div>
      <div className={styles.songTitle}>
        <h1 className={styles.h1}>{song.name}</h1>
        {song.author && <h2 className={styles.h2}> {song.author}</h2>}
      </div>
      <AudioPlayer
        src={song.resourceUrl}
        className={`${styles.audioPlayer} ${
          template !== JapaneseTemplateName ? styles.commercial : ""
        }`}
        showSkipControls={showSkipControls}
        showJumpControls={false}
        showDownloadProgress={false}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrev}
        autoPlay={autoPlay}
        onPlay={onPlay}
      />
    </div>
  );
};
