import { useState, useEffect, useMemo } from 'react'
import { Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Todo } from '@/types/todo'
import { generateSmartSuggestions, AISuggestion } from '@/lib/aiAnalyzer'

interface AISuggestionsProps {
  todos: Todo[]
  onApplySuggestion: (suggestion: string, modifiedTodos: Todo[]) => void
}

export function AISuggestions({ todos, onApplySuggestion }: AISuggestionsProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const activeTodos = useMemo(() => todos.filter(t => !t.completed), [todos])
  const activeTodosCount = activeTodos.length
  const todosCount = todos.length

  useEffect(() => {
    generateSuggestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todosCount, activeTodosCount])

  const generateSuggestions = async () => {
    setIsLoading(true)
    
    // 模拟 AI 分析延迟（实际应用中可以调用真实的 AI API）
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 使用智能分析生成建议
    const smartSuggestions = generateSmartSuggestions(todos)
    
    setSuggestions(smartSuggestions)
    setIsLoading(false)
  }

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-80 z-20 p-4"
        >
          <div className="glass glass-strong rounded-2xl h-[calc(100vh-2rem)] p-6 depth-shadow overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#bd93f9]" />
                <h2 className="text-xl font-semibold text-[#f8f8f2]">AI 智能建议</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="text-[#6272a4] hover:text-[#f8f8f2] hover:bg-[#bd93f9]/10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#bd93f9]" />
                  <span className="ml-2 text-sm text-[#6272a4]">正在分析任务...</span>
                </div>
              ) : suggestions.length === 0 ? (
                <div className="text-center py-8 text-[#6272a4] text-sm">
                  暂无建议
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass rounded-lg p-4 transition-colors ${
                      suggestion.priority === 'high'
                        ? 'border-[#ff5555]/30 hover:border-[#ff5555]/50'
                        : suggestion.priority === 'medium'
                        ? 'border-[#ffb86c]/30 hover:border-[#ffb86c]/50'
                        : 'border-[#bd93f9]/20 hover:border-[#bd93f9]/40'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-3">
                      {suggestion.priority === 'high' && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#ff5555]/20 text-[#ff5555]">
                          高优先级
                        </span>
                      )}
                      {suggestion.type === 'encourage' && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#50fa7b]/20 text-[#50fa7b]">
                          鼓励
                        </span>
                      )}
                    </div>
                    <p className="text-[#f8f8f2] text-sm mb-3">{suggestion.text}</p>
                    {suggestion.action && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-[#8be9fd] hover:text-[#bd93f9] hover:bg-[#bd93f9]/10"
                        onClick={() => {
                          const modifiedTodos = suggestion.action!()
                          onApplySuggestion(suggestion.text, modifiedTodos)
                        }}
                      >
                        应用建议
                      </Button>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {!isExpanded && (
        <motion.button
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={() => setIsExpanded(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-20 glass glass-strong rounded-l-2xl p-3 depth-shadow hover:depth-shadow-hover transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-[#bd93f9]" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
