import { useState, useEffect, useCallback, type FC } from 'react'

interface TextSliderProps {
  items: string[];
  labels?: string[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onIndexChange?: (index: number) => void;
}

const TextSlider: FC<TextSliderProps> = ({
                                           items,
                                           labels = [],
                                           className = '',
                                           autoPlay = false,
                                           autoPlayInterval = 6000,
                                           onIndexChange,
                                         }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = useCallback(() => {
    setCurrentIndex((p) => {
      const n = (p + 1) % items.length
      onIndexChange?.(n)
      return n
    })
  }, [items.length, onIndexChange])

  const prev = useCallback(() => {
    setCurrentIndex((p) => {
      const n = (p - 1 + items.length) % items.length
      onIndexChange?.(n)
      return n
    })
  }, [items.length, onIndexChange])

  const goTo = useCallback(
    (i: number) => {
      const idx = Math.max(0, Math.min(items.length - 1, i))
      setCurrentIndex(idx)
      onIndexChange?.(idx)
    },
    [items.length, onIndexChange]
  )

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return
    const id = setInterval(next, autoPlayInterval)
    return () => clearInterval(id)
  }, [autoPlay, autoPlayInterval, next, items.length])

  useEffect(() => {
    if (currentIndex >= items.length && items.length > 0) {
      setCurrentIndex(0)
    }
  }, [items, currentIndex])

  if (!items || items.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-xl p-4 h-full ${className}`}>
        <div className="text-gray-500">Нет данных истории</div>
      </div>
    )
  }

  return (
    <div
      className={`relative bg-gray-50 rounded-xl p-4 flex flex-col justify-between ${className}`}
    >
      <div className="mb-3">
        <div className="flex items-end gap-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-none">
            {labels[currentIndex] ?? currentIndex + 1}
          </div>
          <div className="flex-1 border-b border-primary-600 opacity-80" />
        </div>
      </div>

      <div className="min-w-0 min-h-0 overflow-y-auto">
        <div className="h-full bg-white rounded-md p-4 shadow-sm border border-transparent hover:border-gray-100">
          <div
            className="max-h-[200px] sm:max-h-[260px] lg:max-h-[300px] overflow-y-auto pr-3 pb-2
                        text-gray-700 leading-relaxed whitespace-pre-line text-sm lg:text-base
                        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
                        hover:scrollbar-thumb-gray-400 transition"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="tracking-wide break-words">
              {items[currentIndex]}
            </div>
          </div>
        </div>
      </div>

      {/* Навигация: без горизонтального скролла */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            aria-label="Предыдущая фаза"
            className="flex items-center justify-center w-12 h-12 rounded-lg shadow bg-white border border-gray-100 hover:bg-gray-50 transition text-primary-700 text-2xl"
            type="button"
          >
            ‹
          </button>

          <button
            onClick={next}
            aria-label="Следующая фаза"
            className="flex items-center justify-center w-12 h-12 rounded-lg shadow bg-white border border-gray-100 hover:bg-gray-50 transition text-primary-700 text-2xl"
            type="button"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end max-w-[60%]">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Перейти к фазе ${i + 1}`}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-transform focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                i === currentIndex
                  ? 'bg-primary-600 text-white scale-110 shadow'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              type="button"
            >
              <span className="text-sm font-medium">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TextSlider