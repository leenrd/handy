import { FC, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handPose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";

interface CanvasProps {}

const Canvas: FC<CanvasProps> = () => {
  const webcamRef = useRef<Webcam>(null) as React.MutableRefObject<Webcam>;
  const canvasRef = useRef<HTMLCanvasElement>(
    null
  ) as React.MutableRefObject<HTMLCanvasElement>;

  const runHandPose = async () => {
    await tf.setBackend("webgl"); // Ensure the backend is set
    await tf.ready();

    const net = await handPose.load();
    console.log("Hand pose model loaded.");

    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net: handPose.HandPose) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);

      // if (hand.length > 0) {
      //   const ctx = canvasRef?.current?.getContext("2d");
      //   drawHand(hand, ctx);
      // }
    }
  };

  const drawHand = (predictions: any[], ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < predictions.length; i++) {
      const landmarks = predictions[i].landmarks;

      for (let j = 0; j < landmarks.length; j++) {
        const [x, y, z] = landmarks[j];
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 3 * Math.PI);

        ctx.fillStyle = "red";
        ctx.fill();
      }
    }
  };

  runHandPose();

  return (
    <section>
      <Webcam
        ref={webcamRef}
        className="absolute mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-9 w-[640px] h-[480px]"
      />
      <canvas
        ref={canvasRef}
        className="absolute mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        width="640"
        height="480"
      />
    </section>
  );
};

export default Canvas;
