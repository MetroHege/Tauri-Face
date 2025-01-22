import { RefObject, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import randomstring from "@/lib/randomstring";

const useFaceDetection = () => {
  const [detection, setDetection] = useState<faceapi.FaceDetection | null>(
    null
  ); // Detected face

  useEffect(() => {
    // Load the face detection models
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("Models loaded");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels(); // Load the models
  }, []);

  const getDescriptors = async (videoRef: RefObject<HTMLVideoElement>) => {
    if (!videoRef.current) {
      return;
    }
    const result = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true)
      .withFaceDescriptor();

    if (!result) {
      console.log("no face detected");
      return;
    }

    const faceName = randomstring(10);
    const labeledDescriptor = new faceapi.LabeledFaceDescriptors(faceName, [
      result.descriptor,
    ]);
    console.log("result", labeledDescriptor);

    setDetection(result.detection);

    return { result, labeledDescriptor };
  };

  const matchFace = async (
    currentDescriptors: Float32Array,
    descriptorsFromDB: Float32Array[]
  ) => {
    if (!currentDescriptors && descriptorsFromDB.length > 0) {
      const faceMatcher = new faceapi.FaceMatcher(
        descriptorsFromDB.map((descriptor) => {
          return faceapi.LabeledFaceDescriptors.fromJSON(descriptor);
        })
      );

      return faceMatcher.matchDescriptor(currentDescriptors);
    }
  };

  return { detection, getDescriptors, matchFace };
};

export { useFaceDetection };
