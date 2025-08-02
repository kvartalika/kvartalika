import {Link} from "react-router-dom";
import SocialIcon from "./builtinIcons.tsx";
import Logo from "./Logo.tsx";
import {useUIStore} from "../store";

const Footer = () => {
  const pageInfo = useUIStore(state => state.pageInfo);
  const socialMediaList = useUIStore(state => state.socialMediaList);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="md:col-span-2 flex flex-col justify-center items-center lg:items-start">
            <Logo className="text-white mb-4" />
            <p className="text-gray-300 mb-6 max-w-md">{pageInfo.footerDescription}</p>
            <div className="flex space-x-4">
              {socialMediaList && socialMediaList.length > 0
                && socialMediaList.map(media => (
                  <SocialIcon
                    key={media.id || media.link}
                    media={media}
                  />
                ))}
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-lg font-semibold mb-4">Отдел продаж</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-gray-300">{pageInfo.address}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href={pageInfo.phone}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {pageInfo.phone}
                </a>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={pageInfo.email}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {pageInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Кварталика. Все права защищены.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Политика конфиденциальности
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;