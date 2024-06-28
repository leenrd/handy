import { FC, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handPose from "@tensorflow-models/handpose";
import * as fingerPose from "fingerpose";
import Webcam from "react-webcam";
import { drawHand } from "../lib/utils";

import victory from "/victory.png";
import thumbs_up from "/thumbs_up.png";

interface CanvasProps {}

const Canvas: FC<CanvasProps> = () => {
  const webcamRef = useRef<Webcam>(null) as React.MutableRefObject<Webcam>;
  const canvasRef = useRef<HTMLCanvasElement>(
    null
  ) as React.MutableRefObject<HTMLCanvasElement>;

  const [gesture, setGesture] = useState(null);
  const [emoji, setEmoji] = useState<string | null>(null);
  const images = { thumbs_up: thumbs_up, victory: victory };

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

      if (hand.length > 0) {
        const GE = new fingerPose.GestureEstimator([
          fingerPose.Gestures.VictoryGesture,
          fingerPose.Gestures.ThumbsUpGesture,
        ]);

        const gesture = await GE.estimate(hand[0].landmarks, 8);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          setEmoji(gesture.gestures[maxConfidence].name);
          console.log(emoji);
        }
      }

      const ctx = canvasRef?.current?.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  runHandPose();

  return (
    <section>
      <Webcam
        ref={webcamRef}
        className="absolute mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-9 w-full h-full bg-cover bg-center"
      />
      <canvas
        ref={canvasRef}
        className="absolute mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        width="640"
        height="480"
      />
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
    </section>
  );
};

export default Canvas;
