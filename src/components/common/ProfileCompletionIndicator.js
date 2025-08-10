// src/components/common/ProfileCompletionIndicator.js
import React from "react";

const ProfileCompletionIndicator = ({
  profileCompletion,
  size = 40,
  strokeWidth = 3,
  showPercentage = false,
  children,
}) => {
  const { profile_done, seller_profile_done } = profileCompletion;

  const completionPercentage = Math.max(profile_done, seller_profile_done);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  const getColor = (percentage) => {
    if (percentage >= 80) return "#10B981"; // Green
    if (percentage >= 60) return "#F59E0B"; // Yellow
    if (percentage >= 40) return "#F97316"; // Orange
    return "#EF4444"; // Red
  };

  const progressColor = getColor(completionPercentage);

  return (
    // --- THIS IS THE FIX ---
    // The main container now has its size set explicitly. This ensures the
    // SVG circle and the content inside are perfectly centered.
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="absolute inset-0 transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
      </svg>

      <div className="relative z-10">{children}</div>

      {showPercentage && completionPercentage > 0 && (
        <div
          className="absolute -bottom-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm"
          style={{ fontSize: "8px" }}
        >
          <span className="font-bold" style={{ color: progressColor }}>
            {completionPercentage}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionIndicator;
