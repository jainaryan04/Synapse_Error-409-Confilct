import React, { useState, useEffect } from "react";

const LiveFeed = () => {
  const [videoSrc, setVideoSrc] = useState("http://127.0.0.1:8000/video_feed");

  useEffect(() => {
    const interval = setInterval(() => {
      setVideoSrc(`http://127.0.0.1:8000/video_feed?t=${new Date().getTime()}`);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Live YOLO Camera Feed</h2>
      <img
        src={videoSrc}
        alt="YOLO Live Feed"
        width="640"
        height="480"
        style={{ border: "2px solid black" }}
      />
    </div>
  );
};

export default LiveFeed;
