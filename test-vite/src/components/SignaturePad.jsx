// SignaturePad.js
import React, { useRef, useEffect, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "./ui/button";

export default function SignatureWrite({ onEnd }) {
  const sigCanvas = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 200 });

  // Adjust canvas size dynamically based on container width
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = Math.floor(width * 0.4); // adjust ratio for signature area
        setCanvasSize({ width, height });
      }
    };

    updateSize(); // run once on mount
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const clear = () => sigCanvas.current.clear();

  const save = () => {
    if (sigCanvas.current.isEmpty()) return alert("Please provide a signature first!");

    const dataUrl = sigCanvas.current.getCanvas().toDataURL("image/png");
    window.opener.postMessage({ type: "signature", signature: dataUrl }, "*");
    window.close();
  };

  return (
    <div ref={containerRef} className="w-full h-full l mx-auto">
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        minWidth={2}
        canvasProps={{
          width: canvasSize.width,
          height: canvasSize.height,
          className: "border-2 ring-2 w-full h-full"
        }}
      />
      <div className="flex gap-2 mt-2">
        <Button onClick={clear}>Clear</Button>
        <Button onClick={save}>Save</Button>
      </div>
    </div>
  );
}
