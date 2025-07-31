import {type FormEvent} from 'react';
import {useUIStore} from "../store/ui.store.ts";

const BookingModal = () => {
  const setBidForm = useUIStore(state => state.setBidForm);
  const bidForm = useUIStore(state => state.bidForm);
  const closeModal = useUIStore(state => state.closeModal);
  const resetBidForm = useUIStore(state => state.resetBidForm);
  const submitBid = useUIStore(state => state.submitBid);
  const loading = useUIStore(state => state.loading);
  const notifications = useUIStore(state => state.notifications);

  const handleClose = () => {
    closeModal('bid');
    resetBidForm();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitBid();
  };

  const handleInputChange = (field: string, value: string) => {
    setBidForm({[field]: value});
  };

  if (notifications.length > 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
          {notifications[0].type === 'success'
            ?
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            :
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{notifications[0].title}</h3>
          <p className="text-gray-600">
            {notifications[0].message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Записаться на осмотр
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <input
              type="text"
              value={bidForm.surname}
              onChange={(e) => handleInputChange('surname', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Фамилия"
            />
          </div>

          <div>
            <input
              type="text"
              required
              value={bidForm.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Имя*"
            />
          </div>

          <div>
            <input
              type="text"
              value={bidForm.patronymic}
              onChange={(e) => handleInputChange('patronymic', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Отчество"
            />
          </div>

          <div>
            <input
              type="tel"
              required
              value={bidForm.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Номер телефона*"
            />
          </div>

          <div>
            <input
              type="email"
              value={bidForm.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Электронная почта"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading.bid || !bidForm.name || !bidForm.phone}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading.bid ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Нажимая "Отправить заявку", вы соглашаетесь с{' '}
          <a
            href="/privacy"
            className="text-blue-600 hover:underline"
          >
            политикой конфиденциальности
          </a>
        </p>
      </div>
    </div>
  );
};

export default BookingModal;