import "./index.css";
import { Composition } from "remotion";
import { MicroLearningVideo } from "./MicroLearningVideo";
import { theme } from "./styles/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MicroLearningVideo"
        component={MicroLearningVideo}
        durationInFrames={theme.video.fps * theme.video.durationInSeconds}
        fps={theme.video.fps}
        width={theme.video.width}
        height={theme.video.height}
      />
    </>
  );
};
