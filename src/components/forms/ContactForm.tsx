import React from 'react';
import type {PageInfo} from "../../store/ui.store.ts";

interface ContactFormProps {
  contactData: PageInfo;
  onContactChange: (field: keyof PageInfo, value: string | boolean) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
                                                   contactData,
                                                   onContactChange
                                                 }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Телефон
          </label>
          <input
            type="tel"
            value={contactData.phone ?? ''}
            onChange={(e) => onContactChange('phone', e.target.value ?? '')}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={contactData.email ?? ''}
            onChange={(e) => onContactChange('email', e.target.value ?? '')}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Заголовок сайта
        </label>
        <input
          type="text"
          value={contactData.title ?? ''}
          onChange={(e) => onContactChange('title', e.target.value ?? '')}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Адрес
        </label>
        <input
          type="text"
          value={contactData.address ?? ''}
          onChange={(e) => onContactChange('address', e.target.value ?? '')}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Описание в футере
        </label>
        <textarea
          value={contactData.footerDescription ?? ''}
          onChange={(e) => onContactChange('footerDescription', e.target.value ?? '')}
          className="w-full border rounded px-3 py-2 h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Основное описание
        </label>
        <textarea
          value={contactData.description ?? ''}
          onChange={(e) => onContactChange('description', e.target.value ?? '')}
          className="w-full border rounded px-3 py-2 h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Политика конфиденциальности
        </label>
        <textarea
          value={contactData.privacy ?? ''}
          onChange={(e) => onContactChange('privacy', e.target.value ?? '')}
          className="w-full border rounded px-3 py-2 h-24"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          checked={!!contactData.published}
          onChange={(e) => onContactChange('published', e.target.checked)}
          className="mr-2"
        />
        <label
          htmlFor="published"
          className="text-sm font-medium text-gray-700"
        >
          Опубликовано
        </label>
      </div>
    </div>
  );
};

export default ContactForm;