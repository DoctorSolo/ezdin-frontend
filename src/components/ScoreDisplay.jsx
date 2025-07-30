import React from "react";

const ScoreDisplay = ({
  score,
  size = "default",
  showIcon = true,
  className = "",
  variant = "yellow",
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "text-sm";
      case "large":
        return "text-xl";
      case "xlarge":
        return "text-2xl";
      default:
        return "text-base";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "small":
        return "w-4 h-4";
      case "large":
        return "w-6 h-6";
      case "xlarge":
        return "w-7 h-7";
      default:
        return "w-5 h-5";
    }
  };

  const getColorClasses = () => {
    switch (variant) {
      case "green":
        return {
          icon: "text-green-600",
          text: "text-green-800",
        };
      case "yellow":
      default:
        return {
          icon: "text-yellow-600",
          text: "text-yellow-800",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <svg
          className={`${getIconSize()} ${colors.icon}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      <span className={`font-bold ${colors.text} ${getSizeClasses()}`}>
        {score.toLocaleString()}
      </span>
    </div>
  );
};

export default ScoreDisplay;
