import { useState, useEffect } from 'react';
import { useContentManagerAuth } from '../store/unified-auth.store';
import type { UnifiedFormData, ContentType } from '../types/unified';

interface ContentManagerProps {
  contentType: ContentType;
  contentId: number;
  onSave: (data: UnifiedFormData) => void;
  onCancel: () => void;
  initialData?: any;
}

const ContentManager = ({ contentType, contentId, onSave, onCancel, initialData }: ContentManagerProps) => {
  const { user, isAuthenticated } = useContentManagerAuth();
  const [formData, setFormData] = useState<UnifiedFormData>(initialData || {} as UnifiedFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'CM' && user?.role !== 'CONTENT_MANAGER')) {
      return;
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (field: keyof UnifiedFormData, value: string | number | boolean) => {
    setFormData((prev: UnifiedFormData) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: (prev[field] as string[])?.map((item: string, i: number) => 
        i === index ? value : item
      ) || []
    }));
  };

  const handleAddArrayItem = (field: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: [...((prev[field] as string[]) || []), '']
    }));
  };

  const handleRemoveArrayItem = (field: string, index: number) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: (prev[field] as string[])?.filter((_: string, i: number) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For testing, use mock API
      const { mockApi } = await import('../services/mockApi');
      
      if (contentType === 'apartment') {
        await mockApi.updateApartment(contentId, formData);
      } else {
        await mockApi.updateComplex(contentId, formData);
      }
      
      onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || (user?.role !== 'CM' && user?.role !== 'CONTENT_MANAGER')) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Edit {contentType === 'apartment' ? 'Apartment' : 'Complex'} Content
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
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
                              <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
                              <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full border rounded px-3 py-2 h-24"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            {formData.images?.map((image: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleArrayChange('images', index, e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Image URL"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('images', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem('images')}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add Image
            </button>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            {formData.features?.map((feature: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange('features', index, e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Feature"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('features', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem('features')}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add Feature
            </button>
          </div>

          {/* Apartment-specific fields */}
          {contentType === 'apartment' && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Rooms
                  </label>
                                     <input
                     type="number"
                     value={formData.numberOfRooms || ''}
                     onChange={(e) => handleInputChange('numberOfRooms', parseInt(e.target.value))}
                     className="w-full border rounded px-3 py-2"
                   />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Bathrooms
                  </label>
                                     <input
                     type="number"
                     value={formData.numberOfBathrooms || ''}
                     onChange={(e) => handleInputChange('numberOfBathrooms', parseInt(e.target.value))}
                     className="w-full border rounded px-3 py-2"
                   />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor
                  </label>
                                     <input
                     type="number"
                     value={formData.floor || ''}
                     onChange={(e) => handleInputChange('floor', parseInt(e.target.value))}
                     className="w-full border rounded px-3 py-2"
                   />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                                     <input
                     type="number"
                     value={formData.price || ''}
                     onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                     className="w-full border rounded px-3 py-2"
                   />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (sq.m)
                  </label>
                                     <input
                     type="number"
                     step="0.1"
                     value={formData.area || ''}
                     onChange={(e) => handleInputChange('area', parseFloat(e.target.value))}
                     className="w-full border rounded px-3 py-2"
                   />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hasDecoration || false}
                    onChange={(e) => handleInputChange('hasDecoration', e.target.checked)}
                    className="mr-2"
                  />
                  Has Decoration
                </label>
              </div>
            </>
          )}

          {/* Complex-specific fields */}
          {contentType === 'complex' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                                     <input
                     type="number"
                     value={formData.yearBuilt || ''}
                     onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value))}
                     className="w-full border rounded px-3 py-2"
                   />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Floors
                  </label>
                                     <input
                     type="number"
                     value={formData.numberOfFloors || ''}
                     onChange={(e) => handleInputChange('numberOfFloors', parseInt(e.target.value))}
                     className="w-full border rounded px-3 py-2"
                   />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.storesNearby || false}
                    onChange={(e) => handleInputChange('storesNearby', e.target.checked)}
                    className="mr-2"
                  />
                  Stores Nearby
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.schoolsNearby || false}
                    onChange={(e) => handleInputChange('schoolsNearby', e.target.checked)}
                    className="mr-2"
                  />
                  Schools Nearby
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hospitalsNearby || false}
                    onChange={(e) => handleInputChange('hospitalsNearby', e.target.checked)}
                    className="mr-2"
                  />
                  Hospitals Nearby
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hasYards || false}
                    onChange={(e) => handleInputChange('hasYards', e.target.checked)}
                    className="mr-2"
                  />
                  Has Yards
                </label>
              </div>
            </>
          )}

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
                             <input
                 type="number"
                 step="any"
                 value={formData.latitude || ''}
                 onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                 className="w-full border rounded px-3 py-2"
               />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
                             <input
                 type="number"
                 step="any"
                 value={formData.longitude || ''}
                 onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                 className="w-full border rounded px-3 py-2"
               />
            </div>
          </div>

          {/* About */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About
            </label>
            <textarea
              value={formData.about || ''}
              onChange={(e) => handleInputChange('about', e.target.value)}
              className="w-full border rounded px-3 py-2 h-24"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentManager;