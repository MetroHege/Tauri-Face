import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

// Type definition for the Camera component
type CameraProps = {
  width: number;
  aspect: number;
};

const Camera = forwardRef<HTMLVideoElement, CameraProps>((props, ref) => {
  const { width, aspect } = props;
  const height = width / aspect;
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element

  // Share videoRef with the parent component
  useImperativeHandle(ref, () => videoRef.current!);

  // Setup the video input
  useEffect(() => {
    const setupVideoInput = async () => {
      try {
        if (!videoRef.current) return;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: width,
            height: height,
          },
          audio: false,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      } catch (error) {
        console.error("Error setting up video input:", error);
      }
    };
    setupVideoInput();
  }, []);

  return <video ref={videoRef} width={width} height={height} />;
});

export default Camera;
