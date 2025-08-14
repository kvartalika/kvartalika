import { KvartalikaLogo } from "./icons/Logo";

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
      <KvartalikaLogo width="32" height="32" />
      <span className="pl-4 text-xl font-bold">Кварталика</span>
    </div>
  );
};

export default Logo;
