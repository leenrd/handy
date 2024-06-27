export const drawHand = (predictions: any[], ctx: CanvasRenderingContext2D) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;

      for (let j = 0; j < landmarks.length; j++) {
        const [x, y] = [landmarks[j][0], landmarks[j][1]];
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 3 * Math.PI);
        ctx.fillStyle = "aqua";
        ctx.fill();
      }
    });
  }
};
