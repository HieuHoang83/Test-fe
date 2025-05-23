import React from "react";

export const ActionButton = ({
  text,
  color,
  onClick,
}: {
  text: string;
  color: string;
  onClick: () => void;
}) => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: color,
    color: "white",
    border: "none",
    borderRadius: 4,
    padding: "4px 10px",
    cursor: "pointer",
    fontWeight: 500,
    transition: "background-color 0.3s, transform 0.2s",
  };

  const hoverStyle: React.CSSProperties = {
    filter: "brightness(90%)",
    transform: "scale(1.03)",
  };

  const [isHover, setIsHover] = React.useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        ...baseStyle,
        ...(isHover ? hoverStyle : {}),
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {text}
    </button>
  );
};
