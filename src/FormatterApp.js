import React, { useState, useEffect } from "react";
import Bullet from "./Bullet";
import { optimize, renderBulletText } from "./utils";

export default function FormatterApp() {
  const [inputText, setInputText] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [optimStatus, setOptimStatus] = useState(null);

  const MAX_LENGTH = 191;
  const HALF_SPACE = "\\u2002";
  const QUARTER_SPACE = "\\u2005";

  const getTextWidth = (text) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "12pt Times New Roman";
    return context.measureText(text).width;
  };

  const formatAndOptimizeText = (text) => {
    const initialRender = renderBulletText(text, getTextWidth, MAX_LENGTH);
    const optimizationResult = optimize(text, (txt) =>
      renderBulletText(txt, getTextWidth, MAX_LENGTH)
    );

    setOptimStatus(optimizationResult.status);
    return optimizationResult.rendering.textLines.join("\\n");
  };

  useEffect(() => {
    if (inputText.trim() !== "") {
      const result = formatAndOptimizeText(inputText);
      setFormattedText(result);
    } else {
      setFormattedText("");
      setOptimStatus(null);
    }
  }, [inputText]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg space-y-4">
      <h1 className="text-2xl font-semibold text-center">DAF Form 1206 Formatter with Live Optimization</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl mb-2">Enter Text</h2>
          <textarea
            className="w-full p-3 border rounded-xl min-h-[300px]"
            placeholder="Enter accomplishment text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        <div>
          <h2 className="text-xl mb-2">Formatted & Optimized Text (Live)</h2>
          <textarea
            className="w-full p-3 border rounded-xl min-h-[300px] bg-gray-100"
            value={formattedText}
            readOnly
          />
          {optimStatus !== null && (
            <div className="mt-2 text-center">
              <span
                className={
                  optimStatus === 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {optimStatus === 0
                  ? "Optimization Successful"
                  : "Optimization Failed"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
