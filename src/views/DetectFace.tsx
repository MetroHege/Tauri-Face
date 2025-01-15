import React, { useEffect, useRef } from "react";

import Camera from "@/components/Camera";
import { useFaceDetection } from "@/hooks/FaceHooks";

const DetectFace: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
  const { detection, getDescriptors } = useFaceDetection();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    // Detect face from video frames
    const detectFace = async () => {
      // Get face descriptors
      getDescriptors(videoRef);
      // Schedule the next detection
      timer = setTimeout(detectFace, 100);
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

          detectFace(); // Start detecting faces
        }
      } catch (error) {
        console.error("Error initializing video feed:", error);
      }
    };

    startDetection(); // Start detection

    // Cleanup on unmount
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Face Detection</h1>
      <div style={{ position: "relative" }}>
        <Camera ref={videoRef} width={1280} aspect={16 / 9} />
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
