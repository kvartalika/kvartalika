import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  footerDescription: string;
  title: string;
  address: string;
  description: string;
  published: boolean;
}

interface SocialMedia {
  id: number;
  image: string;
  link: string;
}

interface HomePageManagerProps {
  onSave: (contactData: ContactInfo, socialMediaData: SocialMedia[]) => void;
  onCancel: () => void;
  initialContactData?: ContactInfo;
  initialSocialMediaData?: SocialMedia[];
}

const HomePageManager = ({ 
  onSave, 
  onCancel, 
  initialContactData, 
  initialSocialMediaData 
}: HomePageManagerProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const [contactData, setContactData] = useState<ContactInfo>(initialContactData || {
    id: 1,
    phone: '',
    email: '',
    footerDescription: '',
    title: '',
    address: '',
    description: '',
    published: true
  });
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>(initialSocialMediaData || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'CM') {
      return;
    }
  }, [isAuthenticated, user]);

  const handleContactChange = (field: keyof ContactInfo, value: any) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (index: number, field: keyof SocialMedia, value: string) => {
    setSocialMedia(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addSocialMedia = () => {
    setSocialMedia(prev => [...prev, {
      id: Date.now(),
      image: '',
      link: ''
    }]);
  };

  const removeSocialMedia = (index: number) => {
    setSocialMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For testing, use mock API
      const { mockApi } = await import('../services/mockApi');
      
      // Update contact info
      await mockApi.updateContactInfo(contactData);
      
      // Update social media (this would be a separate endpoint in real API)
      // For now, we'll simulate updating social media data
      
      onSave(contactData, socialMedia);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'CM') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Редактировать главную страницу
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Контактная информация
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={contactData.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок сайта
              </label>
              <input
                type="text"
                value={contactData.title}
                onChange={(e) => handleContactChange('title', e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адрес
              </label>
              <input
                type="text"
                value={contactData.address}
                onChange={(e) => handleContactChange('address', e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание в футере
              </label>
              <textarea
                value={contactData.footerDescription}
                onChange={(e) => handleContactChange('footerDescription', e.target.value)}
                className="w-full border rounded px-3 py-2 h-24"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Основное описание
              </label>
              <textarea
                value={contactData.description}
                onChange={(e) => handleContactChange('description', e.target.value)}
                className="w-full border rounded px-3 py-2 h-24"
                required
              />
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={contactData.published}
                  onChange={(e) => handleContactChange('published', e.target.checked)}
                  className="mr-2"
                />
                Опубликовано
              </label>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Социальные сети
              </h3>
              <button
                type="button"
                onClick={addSocialMedia}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Добавить соц. сеть
              </button>
            </div>

            {socialMedia.map((item, index) => (
              <div key={item.id} className="border rounded p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Социальная сеть {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeSocialMedia(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Удалить
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL изображения
                    </label>
                    <input
                      type="url"
                      value={item.image}
                      onChange={(e) => handleSocialMediaChange(index, 'image', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="https://example.com/icon.png"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ссылка
                    </label>
                    <input
                      type="url"
                      value={item.link}
                      onChange={(e) => handleSocialMediaChange(index, 'link', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {socialMedia.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Нет добавленных социальных сетей
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePageManager;