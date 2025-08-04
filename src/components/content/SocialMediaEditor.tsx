import {useEffect, useState} from 'react';
import {type SocialMedia, useUIStore} from "../../store/ui.store.ts";
import SocialMediaForm from "../forms/SocialMediaForm.tsx";

interface SocialMediaEditorProps {
  onSaved?: () => void;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
}

const SocialMediaEditor = ({
                             onSaved,
                             onAdd,
                             onRemove
                           }: SocialMediaEditorProps) => {
  const socialMediaList = useUIStore(state => state.socialMediaList);
  const loadSocialMediaList = useUIStore(state => state.loadSocialMediaList);
  const updateSocialMediaList = useUIStore(state => state.updateSocialMediaList);
  const addSocialMediaList = useUIStore(state => state.addSocialMediaList);
  const deleteSocialMediaList = useUIStore(state => state.deleteSocialMediaList);
  const loading = useUIStore(state => state.loading.upload);

  const [draftedSocialMediaList, setDraftedSocialMediaList] = useState<SocialMedia[]>(socialMediaList);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraftedSocialMediaList(socialMediaList);
  }, [socialMediaList]);

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
    setError(null);
    try {
      await addSocialMediaList({image: '', link: ''});
      await loadSocialMediaList();
      onAdd?.();
    } catch (e) {
      console.error(e);
      setError('Не удалось добавить социальную сеть');
    }
  };

  const removeSocialMedia = async (index: number) => {
    setError(null);
    try {
      await deleteSocialMediaList(index);
      await loadSocialMediaList();
      onRemove?.(index);
    } catch (e) {
      console.error(e);
      setError('Не удалось удалить социальную сеть');
    }
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      await updateSocialMediaList(draftedSocialMediaList);
      onSaved?.();
    } catch (e) {
      console.error(e);
      setError('Не удалось сохранить список');
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        className="space-y-4"
      >
        <SocialMediaForm
          list={draftedSocialMediaList}
          onSocialMediaChange={handleSocialMediaChange}
          onAddSocialMedia={addSocialMedia}
          onRemoveSocialMedia={removeSocialMedia}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex justify-end pt-4 space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Сохранить соц. сети'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialMediaEditor;