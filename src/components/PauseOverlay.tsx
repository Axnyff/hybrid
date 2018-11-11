import React from "react";

const style = {
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.2)",
  position: "absolute" as "absolute",
  top: 0,
  left: 0,
  zIndex: 5,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "30px",
  color: "white"
};

export default () => (
  <div style={style}>
    <span>Press space to toggle pause</span>
  </div>
);
