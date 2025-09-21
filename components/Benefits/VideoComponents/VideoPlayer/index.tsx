import React, { Component } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import "videojs-playlist";
import "videojs-playlist-ui";
import "videojs-playlist-ui/dist/videojs-playlist-ui.css";

import styles from "./style.module.scss";

const defaultOptions: VideoJsPlayerOptions = {
    controls: true
};

export interface BasePlayerProps {
    options?: VideoJsPlayerOptions;
    onReady?: (player: VideoJsPlayer) => void;
    className?: string;
    videoClassName?: string;
}

export const VideoPlayer = (props: BasePlayerProps) => {
    let videoNode = React.useRef<HTMLVideoElement | string>("");
    const [player, setPlayer] = React.useState<VideoJsPlayer>();
    const { options, onReady = () => { } } = props;

    const videoJsOptions: VideoJsPlayerOptions = React.useMemo(() => ({
        ...defaultOptions,
        ...options
    }), [options]);

    React.useEffect(() => {
        setPlayer(videojs(videoNode.current, videoJsOptions, function onPlayerReady(this: VideoJsPlayer) {
            onReady(this);
        }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options, videoNode]);

    React.useEffect(() => {
        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
            }
        }
    }, [player]);

    return (
        <div className={styles.container}>
            <div className={styles.videoContainer} data-vjs-player>
                <video
                    ref={node => {
                        if (node) {
                            videoNode.current = node;
                        }
                    }}
                    className={`video-js ${styles.player}`}
                />
            </div>
            <ol className={`vjs-playlist ${styles.playlist}`} />

        </div>
    );

}