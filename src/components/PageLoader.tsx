import { KvartalikaLogo } from "./icons/Logo";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4">
            <KvartalikaLogo width="64" height="64" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Кварталика</h2>
          <p className="text-gray-600">Загружаем для вас лучшие предложения</p>
        </div>

        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
