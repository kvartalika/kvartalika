import {type FC, type FormEvent} from "react";
import type {UserDto} from "../../services";

const UserForm: FC<{
  formData: UserDto;
  setFormData: (u: UserDto) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  requirePassword?: boolean;
}> = ({
        formData,
        setFormData,
        onSubmit,
        onCancel,
        submitLabel,
        requirePassword = true
      }) => (
  <form
    onSubmit={onSubmit}
    className="space-y-4"
  >
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
        <input
          type="text"
          value={formData.surname}
          onChange={(e) => setFormData({...formData, surname: e.target.value})}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Patronymic</label>
        <input
          type="text"
          value={formData.patronymic || ''}
          onChange={(e) => setFormData({
            ...formData,
            patronymic: e.target.value
          })}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      {submitLabel !== 'Update' && <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      {submitLabel !== 'Update' &&
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({
              ...formData,
              password: e.target.value
            })}
            className="w-full border rounded px-3 py-2"
            required={requirePassword}
          />
        </div>
      }
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telegram ID</label>
        <input
          type="text"
          value={formData.telegramId || ''}
          onChange={(e) => setFormData({
            ...formData,
            telegramId: e.target.value
          })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
    </div>

    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-gray-600 hover:text-gray-800"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </div>
  </form>
);

export default UserForm;