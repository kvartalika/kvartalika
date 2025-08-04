import {type FormEvent, useState, useEffect} from 'react';
import {type PageInfo, useUIStore} from "../../store/ui.store.ts";
import ContactForm from "../forms/ContactForm.tsx";

interface PageInfoEditorProps {
  onSaved?: () => void;
}

const PageInfoEditor = ({onSaved}: PageInfoEditorProps) => {
  const pageInfo = useUIStore(state => state.pageInfo);
  const updatePageInfo = useUIStore(state => state.updatePageInfo);
  const loading = useUIStore(state => state.loading.upload);

  const [draftedPageInfo, setDraftedPageInfo] = useState<PageInfo>(pageInfo);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraftedPageInfo(pageInfo);
  }, [pageInfo]);

  const handleContactChange = (field: keyof PageInfo, value: string | boolean) => {
    setDraftedPageInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await updatePageInfo(draftedPageInfo);
      onSaved?.();
    } catch (err) {
      console.error(err);
      setError('Не удалось сохранить информацию');
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <ContactForm
          contactData={draftedPageInfo}
          onContactChange={handleContactChange}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Сохранить контактную информацию'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageInfoEditor;