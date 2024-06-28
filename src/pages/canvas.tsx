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

  const [model, setModel] = useState<boolean>(false);
  const [gesture, setGesture] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string | null>(null);
  const images = { thumbs_up: thumbs_up, victory: victory };

  const runHandPose = async () => {
    await tf.setBackend("webgl"); // Ensure the backend is set
    await tf.ready();

    const net = await handPose.load();
    console.log("Hand pose model loaded.");
    setModel(true);

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

        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          console.log(gesture.gestures);
          const confidence = gesture.gestures.map(
            (prediction) => prediction.score
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          console.log(gesture.gestures[maxConfidence].name);
          setEmoji(gesture.gestures[maxConfidence].name);
          setGesture(gesture.gestures[maxConfidence].name);
        }
      }

      const ctx = canvasRef?.current?.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  runHandPose();

  return (
    <section>
      <aside className="bg-white rounded-tr-md rounded-br-md h-screen px-8 w-[20em]">
        <h1 className="text-2xl font-bold text-center pb-5 pt-10 tracking-tighter">
          Parameters
        </h1>
        <div className="flex flex-col gap-10 mt-9">
          <p className="font-bold">
            Hand Recognition Model: {model ? "Active" : "Sleep"}
          </p>
          <p className="font-bold">
            Gesture: {gesture !== null ? gesture : "No gesture detected"}
          </p>
        </div>
      </aside>
      <div>
        <Webcam
          ref={webcamRef}
          className="absolute mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[840px] h-[680px] rounded-2xl"
        />
        <canvas
          ref={canvasRef}
          className="absolute mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          width="640"
          height="480"
        />
        {emoji !== null ? (
          <img
            src={images[emoji]}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 400,
              bottom: 500,
              right: 0,
              textAlign: "center",
              height: 100,
            }}
          />
        ) : (
          ""
        )}
      </div>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
    </section>
  );
};

export default Canvas;
