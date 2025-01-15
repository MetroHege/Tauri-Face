import React, { useEffect, useRef, useState } from "react";

import * as faceapi from "face-api.js";

const DetectFace: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
  const [detection, setDetection] = useState<faceapi.FaceDetection | null>(
    null
  ); // Detected face

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    // Load the face detection models
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        console.log("Models loaded");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    // Detect face from video frames
    const detectFace = async () => {
      if (videoRef.current) {
        const result = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );

        setDetection(result || null); // Update detection state
      }

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

    loadModels().then(startDetection); // Load models and start detection

    // Cleanup on unmount
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div
      style={{ textAlign: "center", marginTop: "20px", position: "relative" }}
    >
      <h1>Face Detection</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "80%",
          border: "1px solid black",
        }}
      />
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
  );
};

export default DetectFace;
