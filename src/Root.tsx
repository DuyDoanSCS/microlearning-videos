import "./index.css";
import { Composition } from "remotion";
import { MicroLearningVideo } from "./MicroLearningVideo";
import { ConceptExplainerVideo } from "./compositions/ConceptExplainerVideo";
import { theme } from "./styles/theme";
import conceptDurationsData from "./audioDurations-concept.json";

const conceptDuration = conceptDurationsData?._meta?.totalDurationSeconds ?? 187;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Template: Step-by-Step (Viết Email) */}
      <Composition
        id="MicroLearningVideo"
        component={MicroLearningVideo}
        durationInFrames={theme.video.fps * theme.video.durationInSeconds}
        fps={theme.video.fps}
        width={theme.video.width}
        height={theme.video.height}
      />

      {/* Template: Concept Explainer (OOP) */}
      <Composition
        id="ConceptExplainerVideo"
        component={ConceptExplainerVideo}
        durationInFrames={theme.video.fps * conceptDuration}
        fps={theme.video.fps}
        width={theme.video.width}
        height={theme.video.height}
      />
    </>
  );
};
