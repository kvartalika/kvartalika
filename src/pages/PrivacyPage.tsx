import { Link } from 'react-router-dom'
import { useUIStore } from '../store/ui.store.ts'

const PrivacyPage = () => {
  const pageInfo = useUIStore(state => state.pageInfo)

  // Разбиваем текст на абзацы по переносам строк
  const paragraphs = pageInfo.privacy
    ? pageInfo.privacy.split(/\n+/).map((p, i) => p.trim()).filter(Boolean)
    : []

  return (
    <div className="min-h-screen pt-20">
      {/* Хлебные крошки */}
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link to="/" className="text-primary-600 hover:text-primary-700">
              Главная
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">Политика конфиденциальности</span>
          </nav>
        </div>
      </section>

      {/* Основной контент */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Политика конфиденциальности
          </h1>

          {paragraphs.length > 0 ? (
            paragraphs.map((text, idx) => (
              <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                {text}
              </p>
            ))
          ) : (
            <p className="text-gray-500 italic">
              Текст политики конфиденциальности в данный момент отсутствует.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default PrivacyPage
