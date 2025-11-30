import { useState, useEffect, useMemo } from 'react'
import { Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'

import { Todo } from '@/types/todo'

interface AISuggestionsProps {
  todos: Todo[]
  onApplySuggestion: (suggestion: string, modifiedTodos: Todo[]) => void
}

export function AISuggestions({ todos, onApplySuggestion }: AISuggestionsProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [suggestions, setSuggestions] = useState<string[]>([])
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
    
    // 模拟 AI 建议生成（实际应用中应该调用真实的 AI API）
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const suggestions: string[] = []
    
    if (activeTodos.length > 5) {
      suggestions.push('您有较多待办事项，建议按优先级分组处理')
    }
    
    if (activeTodos.some(t => t.text.toLowerCase().includes('会议'))) {
      suggestions.push('检测到会议相关任务，建议提前准备议程')
    }
    
    if (activeTodos.length === 0) {
      suggestions.push('恭喜！所有任务已完成，可以休息一下了')
    } else {
      suggestions.push('建议将相似任务合并处理，提高效率')
      suggestions.push('可以尝试番茄工作法，专注完成高优先级任务')
    }
    
    setSuggestions(suggestions)
    setIsLoading(false)
  }

  const applySuggestionToTodos = (suggestion: string, currentTodos: Todo[]): Todo[] => {
    const modifiedTodos = [...currentTodos]
    
    // 根据不同的建议类型应用不同的修改
    if (suggestion.includes('按优先级分组')) {
      // 将前3个待办事项设置为高优先级
      modifiedTodos.slice(0, 3).forEach((todo, index) => {
        if (!todo.completed && index < 3) {
          modifiedTodos[index] = { ...todo, priority: 'high' as const }
        }
      })
    } else if (suggestion.includes('会议')) {
      // 将包含"会议"的待办事项设置为高优先级
      modifiedTodos.forEach((todo, index) => {
        if (!todo.completed && todo.text.toLowerCase().includes('会议')) {
          modifiedTodos[index] = { ...todo, priority: 'high' as const }
        }
      })
    } else if (suggestion.includes('合并处理')) {
      // 将相似的任务合并（这里简化处理，将前两个相似任务合并）
      if (modifiedTodos.length >= 2) {
        const first = modifiedTodos[0]
        const second = modifiedTodos[1]
        if (!first.completed && !second.completed) {
          modifiedTodos[0] = {
            ...first,
            text: `${first.text} + ${second.text}`,
            priority: 'high' as const
          }
          modifiedTodos.splice(1, 1) // 删除第二个
        }
      }
    } else if (suggestion.includes('番茄工作法')) {
      // 将高优先级任务标记为需要专注
      modifiedTodos.forEach((todo, index) => {
        if (!todo.completed && todo.priority === 'high') {
          modifiedTodos[index] = {
            ...todo,
            text: `🍅 ${todo.text}`
          }
        }
      })
    }
    
    return modifiedTodos
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
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-lg p-4 border-[#bd93f9]/20 hover:border-[#bd93f9]/40 transition-colors"
                  >
                    <p className="text-[#f8f8f2] text-sm mb-3">{suggestion}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-[#8be9fd] hover:text-[#bd93f9] hover:bg-[#bd93f9]/10"
                      onClick={() => {
                        const modifiedTodos = applySuggestionToTodos(suggestion, todos)
                        onApplySuggestion(suggestion, modifiedTodos)
                      }}
                    >
                      应用建议
                    </Button>
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
