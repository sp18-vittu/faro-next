import React from "react";
import { PlayCircleFilled } from "@ant-design/icons";
import { Avatar } from "antd";

import Image from "next/image";
import PlayIcon from "../../../../public/playicon.svg";
import { BenefitResource } from "@/shared/types/types";
import { JapaneseTemplateName } from "@/constant";

import styles from "./style.module.scss";

interface SongCardProps {
  song: BenefitResource;
  id: number;
  onClickPlay: () => void;
  albumImage?: any;
  template?: string;
}

export const SongCard = (props: SongCardProps) => {
  const { albumImage, song, id, onClickPlay, template } = props;

  return (
    <div className={styles.container}>
      <div className={styles.songNumber}>
        <h1 className={styles.h1}> {id + 1} </h1>
      </div>
      <div className={styles.songAvatar}>
        <Avatar
          shape="square"
          size={49}
          src={albumImage || song.previewResourceUrl}
        />
      </div>
      <div className={styles.songButtonContainer} onClick={onClickPlay}>
        {template !== JapaneseTemplateName ? (
          <PlayCircleFilled className={styles.commercialPlayButton} />
        ) : (
          <Image
            className={styles.playIcon}
            src={PlayIcon}
            alt="Play Icon"
            fill={false}
          />
        )}
      </div>
      <div className={styles.songTitle}>
        <h1 className={styles.h1}>{song.name}</h1>
      </div>
      <div className={styles.songArtist}>{song.author}</div>
    </div>
  );
};
