import React from 'react';
import type {SocialMedia} from "../../store";

interface SocialMediaFormProps {
  socialMedia: SocialMedia[];
  onSocialMediaChange: (index: number, field: keyof SocialMedia, value: string) => void;
  onAddSocialMedia: () => void;
  onRemoveSocialMedia: (index: number) => void;
}

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({
                                                           socialMedia,
                                                           onSocialMediaChange,
                                                           onAddSocialMedia,
                                                           onRemoveSocialMedia
                                                         }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Социальные сети</h3>
        <button
          type="button"
          onClick={onAddSocialMedia}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Добавить
        </button>
      </div>

      {socialMedia.map((item, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 bg-gray-50"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Социальная сеть {index + 1}</h4>
            <button
              type="button"
              onClick={() => onRemoveSocialMedia(index)}
              className="text-red-600 hover:text-red-800"
            >
              ✕ Удалить
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL изображения
              </label>
              <input
                type="text"
                value={item.image ?? ''}
                onChange={(e) => onSocialMediaChange(index, 'image', e.target.value ?? '')}
                className="w-full border rounded px-3 py-2"
                placeholder="https://example.com/icon.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ссылка
              </label>
              <input
                type="text"
                value={item.link ?? ''}
                onChange={(e) => onSocialMediaChange(index, 'link', e.target.value ?? '')}
                className="w-full border rounded px-3 py-2"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialMediaForm;