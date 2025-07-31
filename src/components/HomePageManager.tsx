import {useEffect} from 'react';
import ContactForm from './forms/ContactForm';
import SocialMediaForm from './forms/SocialMediaForm';
import {useAuthStore} from "../store/auth.store.ts";
import {useUIStore} from "../store/ui.store.ts";

interface HomePageManagerProps {
  onSave: () => void;
  onCancel: () => void;
}

const HomePageManager = ({
                           onSave,
                           onCancel,
                         }: HomePageManagerProps) => {
  const {role, isAuthenticated} = useAuthStore();

  const pageInfo = useUIStore(state => state.pageInfo);
  const updatePageInfo = useUIStore(state => state.updatePageInfo);

  const socialMediaList = useUIStore(state => state.socialMediaList);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'CM') {
      return;
    }

    const loadInitialData = async () => {
      if (!initialContactData) {
        try {
          const {mockApi} = await import('../services/mockApi');
          const contactInfo = await mockApi.getContactInfo();
          setContactData(contactInfo);
        } catch (error) {
          console.error('Failed to load contact info:', error);
        }
      }

      if (!initialSocialMediaData) {
        try {
          const {mockApi} = await import('../services/mockApi');
          const socialMediaData = await mockApi.getSocialMedia();
          setSocialMedia(socialMediaData);
        } catch (error) {
          console.error('Failed to load social media:', error);
        }
      }
    };

    loadInitialData();
  }, [isAuthenticated, user, initialContactData, initialSocialMediaData]);

  const handleContactChange = (field: keyof ContactInfo, value: any) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (index: number, field: keyof SocialMedia, value: string) => {
    setSocialMedia(prev => prev.map((item, i) =>
      i === index ? {...item, [field]: value} : item
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
      const {mockApi} = await import('../services/mockApi');

      // Update contact info
      await mockApi.updateContactInfo(contactData);

      // Update social media - in a real app, you'd batch these operations
      // For now, we'll simulate updating each social media item
      for (const socialMediaItem of socialMedia) {
        if (socialMediaItem.id > 0) {
          // Update existing
          await mockApi.updateSocialMedia(socialMediaItem.id, socialMediaItem);
        } else {
          // Add new
          await mockApi.addSocialMedia({
            image: socialMediaItem.image,
            link: socialMediaItem.link
          });
        }
      }

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

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <ContactForm
              contactData={contactData}
              onContactChange={handleContactChange}
            />
          </div>

          {/* Social Media */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <SocialMediaForm
              socialMedia={socialMedia}
              onSocialMediaChange={handleSocialMediaChange}
              onAddSocialMedia={addSocialMedia}
              onRemoveSocialMedia={removeSocialMedia}
            />
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