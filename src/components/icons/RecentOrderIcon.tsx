import React from "react";

interface SaleIconProps {
  color: string;
}
const RecentOrderIcon: React.FC<SaleIconProps> = ({ color }) => {
  return (
    <svg
      width="39"
      height="37"
      viewBox="0 0 39 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="39" height="37" rx="12" fill={color} fillOpacity="0.12" />
      <g clipPath="url(#clip0_9_149)">
        <path
          d="M19 20H11V26C11 26.5304 11.2107 27.0391 11.5858 27.4142C11.9609 27.7893 12.4696 28 13 28H27C27.5304 28 28.0391 27.7893 28.4142 27.4142C28.7893 27.0391 29 26.5304 29 26V20H21V22H19V20ZM19 19H10V13C10 11.9 10.9 11 12 11H16V10C16 9.46957 16.2107 8.96086 16.5858 8.58579C16.9609 8.21071 17.4696 8 18 8H22C22.5304 8 23.0391 8.21071 23.4142 8.58579C23.7893 8.96086 24 9.46957 24 10V11H28C28.5304 11 29.0391 11.2107 29.4142 11.5858C29.7893 11.9609 30 12.4696 30 13V19H21V17H19V19ZM22 11V10H18V11H22Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_9_149">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(10 8)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default RecentOrderIcon;
