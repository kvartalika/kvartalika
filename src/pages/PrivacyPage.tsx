import { Link } from 'react-router-dom'
import { useUIStore } from '../store/ui.store.ts'

const PrivacyPage = () => {
  const pageInfo = useUIStore(state => state.pageInfo)

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-700"
            >
              Главная
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">Политика конфиденциальности</span>
          </nav>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-xl font-semibold text-gray-600">{pageInfo.privacy}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPage