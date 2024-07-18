import React from "react";

interface SaleIconProps {
  color: string;
}

const SaleIcon: React.FC<SaleIconProps> = ({ color }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_14_13)">
        <path
          d="M1 11H4V21H1V11ZM6 1H9V21H6V1ZM11 9H14V21H11V9ZM16 5H19V21H16V5Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_14_13">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SaleIcon;
