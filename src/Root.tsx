import "./index.css";
import { Composition } from "remotion";
import { MicroLearningVideo } from "./MicroLearningVideo";
import { ConceptExplainerVideo } from "./compositions/ConceptExplainerVideo";
import { theme } from "./styles/theme";

// Default duration cho Studio preview (fallback OOP ~3 phút)
const DEFAULT_CONCEPT_DURATION_SECONDS = 171;

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

      {/* Template: Concept Explainer (Dynamic) */}
      <Composition
        id="ConceptExplainerVideo"
        component={ConceptExplainerVideo}
        durationInFrames={theme.video.fps * DEFAULT_CONCEPT_DURATION_SECONDS}
        fps={theme.video.fps}
        width={theme.video.width}
        height={theme.video.height}
        // calculateMetadata override duration từ inputProps khi render
        calculateMetadata={async ({ props }) => {
          // Nếu có durations từ pipeline → dùng totalDurationFrames
          const durations = (props as any)?.durations;
          if (durations?._meta?.totalDurationFrames) {
            return {
              durationInFrames: durations._meta.totalDurationFrames,
              props,
            };
          }
          // Nếu có lessonData → tính tổng từ sections
          const lessonData = (props as any)?.lessonData;
          if (lessonData) {
            const sectionKeys = Object.keys(lessonData);
            const totalFrames = sectionKeys.reduce((sum, key) => {
              return sum + (lessonData[key]?.duration || 0);
            }, 0);
            const transitionOverlap = Math.max(0, sectionKeys.length - 1) * 15;
            if (totalFrames > 0) {
              return {
                durationInFrames: totalFrames - transitionOverlap,
                props,
              };
            }
          }
          // Fallback
          return {
            durationInFrames: theme.video.fps * DEFAULT_CONCEPT_DURATION_SECONDS,
            props,
          };
        }}
      />
    </>
  );
};
