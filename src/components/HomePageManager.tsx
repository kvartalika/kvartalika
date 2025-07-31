import { useState } from 'react';
import {
  useUIStore,
  useIsAuthenticated,
  useAuthRole,
  type HomepageSection
} from '../store';

interface HomePageManagerProps {
  sections: HomepageSection[];
  onSectionsChange: (sections: HomepageSection[]) => void;
}

const HomePageManager = ({ sections, onSectionsChange }: HomePageManagerProps) => {
  const isAuthenticated = useIsAuthenticated();
  const role = useAuthRole();
  const { addNotification } = useUIStore();
  
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);

  if (!isAuthenticated || (role !== 'admin' && role !== 'content_manager')) {
    return null;
  }

  const handleSectionUpdate = (updatedSection: HomepageSection) => {
    const updatedSections = sections.map(section =>
      section.id === updatedSection.id ? updatedSection : section
    );
    onSectionsChange(updatedSections);
    setEditingSection(null);
    
    addNotification({
      type: 'success',
      title: 'Секция обновлена',
      message: 'Настройки главной страницы сохранены',
    });
  };

  const handleToggleVisibility = (sectionId: string) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId ? { ...section, isVisible: !section.isVisible } : section
    );
    onSectionsChange(updatedSections);
  };

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    const draggedSection = sections[dragIndex];
    const newSections = [...sections];
    newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, draggedSection);
    
    // Update order numbers
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    onSectionsChange(reorderedSections);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Настройка главной страницы</h2>
      </div>

      <div className="space-y-4">
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <div
              key={section.id}
              className={`p-4 border rounded-lg ${
                section.isVisible ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => index > 0 && handleReorder(index, index - 1)}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => index < sections.length - 1 && handleReorder(index, index + 1)}
                      disabled={index === sections.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ↓
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setEditingSection(section)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Редактировать
                  </button>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={section.isVisible}
                      onChange={() => handleToggleVisibility(section.id)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Показывать</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Редактировать секцию
            </h3>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSectionUpdate(editingSection);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заголовок
                </label>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection({
                    ...editingSection,
                    title: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={editingSection.description}
                  onChange={(e) => setEditingSection({
                    ...editingSection,
                    description: e.target.value
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цвет фона
                </label>
                <select
                  value={editingSection.backgroundColor}
                  onChange={(e) => setEditingSection({
                    ...editingSection,
                    backgroundColor: e.target.value as 'white' | 'gray'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="white">Белый</option>
                  <option value="gray">Серый</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Текст ссылки
                </label>
                <input
                  type="text"
                  value={editingSection.linkText || ''}
                  onChange={(e) => setEditingSection({
                    ...editingSection,
                    linkText: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL ссылки
                </label>
                <input
                  type="text"
                  value={editingSection.linkUrl || ''}
                  onChange={(e) => setEditingSection({
                    ...editingSection,
                    linkUrl: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p>
          <strong>Подсказка:</strong> Используйте стрелки для изменения порядка секций.
          Снимите флажок "Показывать", чтобы скрыть секцию с главной страницы.
        </p>
      </div>
    </div>
  );
};

export default HomePageManager;