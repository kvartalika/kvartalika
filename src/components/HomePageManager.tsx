import {type FormEvent, useState} from 'react';
import ContactForm from './forms/ContactForm';
import SocialMediaForm from './forms/SocialMediaForm';
import {useAuthStore} from "../store/auth.store.ts";
import {
  type PageInfo,
  type SocialMedia,
  useUIStore
} from "../store/ui.store.ts";

interface HomePageManagerProps {
  onCancel: () => void;
}

const HomePageManager = ({onCancel}: HomePageManagerProps) => {
  const {role, isAuthenticated} = useAuthStore();

  const pageInfo = useUIStore(state => state.pageInfo);
  const updatePageInfo = useUIStore(state => state.updatePageInfo);

  const socialMediaList = useUIStore(state => state.socialMediaList);
  const loadSocialMediaList = useUIStore(state => state.loadSocialMediaList);
  const updateSocialMediaList = useUIStore(state => state.updateSocialMediaList);
  const addSocialMediaList = useUIStore(state => state.addSocialMediaList);

  const [draftedPageInfo, setDraftedPageInfo] = useState<PageInfo>(pageInfo);
  const [draftedSocialMediaList, setDraftedSocialMediaList] = useState<SocialMedia[]>(socialMediaList);

  const notifications = useUIStore(state => state.notifications);
  const loading = useUIStore(state => state.loading);

  const handleContactChange = (field: keyof PageInfo, value: string | boolean) => {
    setDraftedPageInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialMediaChange = (index: number, field: keyof SocialMedia, value: string) => {
    setDraftedSocialMediaList(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value,
      };
      return copy;
    });
  };

  const addSocialMedia = async () => {
    const media: SocialMedia = {
      image: '/',
      link: ''
    }

    await addSocialMediaList(media);
    await loadSocialMediaList();
  };

  const removeSocialMedia = async (index: number) => {
    await removeSocialMedia(index);
    await loadSocialMediaList();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await Promise.all([updateSocialMediaList(draftedSocialMediaList), updatePageInfo(draftedPageInfo)]);

    } catch (err) {
      console.log(err);
    }
  };

  if (!isAuthenticated || role !== 'CONTENT_MANAGER') {
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

        {notifications.length && (
          <div className="mb-4 bg-red-50 border text-black px-4 py-3 rounded">
            {notifications[0].message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="bg-gray-50 p-6 rounded-lg">
            <ContactForm
              contactData={draftedPageInfo}
              onContactChange={handleContactChange}
            />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <SocialMediaForm
              socialMedia={draftedSocialMediaList}
              onSocialMediaChange={handleSocialMediaChange}
              onAddSocialMedia={addSocialMedia}
              onRemoveSocialMedia={removeSocialMedia}
            />
          </div>

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
              disabled={loading.upload}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading.upload ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePageManager;