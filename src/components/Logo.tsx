interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const Logo = ({ className = "", onClick }: LogoProps) => {
  return (
    <div
      className={`flex items-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 512 512"
        fill="none"
        className="mb-1.5"
      >
        <rect width="512" height="512" rx="64" fill="transparent" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M181.585 127.476L141.877 156.563V479.933H181.585V127.476Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M439.713 126.758L343.831 56.7437V80.4251L423.497 138.598L407.282 150.44L343.831 104.107V127.789L391.065 162.281L374.85 174.121L343.831 151.471V175.152L358.634 185.962L231.626 278.706L231.625 164.264L197.805 139.567L343.747 33L456 114.865L439.713 126.758Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M231.626 355.78V479.933H401.647L231.626 355.78Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M424.909 186.993L456 209.696V233.378L408.693 198.834L424.909 186.993Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M392.478 210.675L456 257.059V280.742L376.262 222.516L392.478 210.675Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M360.046 234.356L456 304.423V328.103L343.831 246.197L360.046 234.356Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M246.537 317.242L343.831 246.198V269.88L456 351.786V375.468L343.831 293.561V317.242L456 399.149V422.832L343.831 340.925V364.607L456 446.514V470.195L246.537 317.242Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M441.129 175.121L456 164.228V186.014L441.129 175.121Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M130.469 164.921L96.2134 190.014V479.933H130.469V164.921Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M90.2552 194.379L56 219.472V479.933H90.2557L90.2552 194.379Z"
          fill="currentColor"
        />
        <rect x="84" y="184" width="7" height="296" fill="transparent" />
        <rect x="125" y="165" width="7" height="322" fill="transparent" />
      </svg>
      <span className="pl-4 text-xl font-bold">Кварталика</span>
    </div>
  );
};

export default Logo;
