import React, { useEffect, useRef } from "react";

import Camera from "@/components/Camera";
import { useFaceDetection } from "@/hooks/FaceHooks";
import { useNavigate } from "react-router";
import { useDbContext } from "@/hooks/ContextHooks";

const DetectFace: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
  const { detection, getDescriptors, matchFace } = useFaceDetection();
  const navigate = useNavigate();
  const { faces } = useDbContext();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    // Detect face from video frames
    const detectFace = async (faces: Float32Array[]) => {
      try {
        const descriptorsResult = await getDescriptors(videoRef);
        // matchFace
        if (descriptorsResult) {
          const match = await matchFace(
            descriptorsResult.result.descriptor,
            faces
          );
          console.log("mätsi", match);
          if (match && match.distance > 0.3) {
            navigate("/detected", {
              state: descriptorsResult.labeledDescriptor.toJSON(),
            });
          }
        }
      } catch (error) {
        console.error("Error detecting face:", error);
      }

      // Schedule the next detection
      timer = setTimeout(detectFace, 100, faces);
    };

    // Initialize the video feed and start detection
    const startDetection = async () => {
      try {
        if (videoRef.current) {
          // Wait for the video element to be ready
          await new Promise<void>((resolve) => {
            if (videoRef.current!.readyState >= 2) {
              resolve();
            } else {
              videoRef.current!.oncanplay = () => resolve();
            }
          });

          if (faces) {
            detectFace(faces); // Start detecting faces
          }
        }
      } catch (error) {
        console.error("Error initializing video feed:", error);
      }
    };

    startDetection();

    // Cleanup on unmount
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  // console.log('Detection object', detection);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Face Detection</h1>
      <div style={{ position: "relative" }}>
        <Camera ref={videoRef} width={800} aspect={16 / 9} />
        {detection && (
          <div
            style={{
              position: "absolute",
              top: detection.box.y,
              left: detection.box.x,
              width: detection.box.width,
              height: detection.box.height,
              border: "2px solid red",
              pointerEvents: "none",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default DetectFace;
