import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { Todo } from '@/types/todo'

interface AIConfirmationProps {
  originalTodos: Todo[]
  modifiedTodos: Todo[]
  onConfirm: () => void
  onCancel: () => void
}

export function AIConfirmation({ originalTodos, modifiedTodos, onConfirm, onCancel }: AIConfirmationProps) {
  const [timeLeft, setTimeLeft] = useState(60) // 60秒倒计时

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        if (newTime <= 0) {
          setTimeout(() => onConfirm(), 0)
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onConfirm])

  // 找出被修改的待办事项
  const changes = modifiedTodos.map((modified) => {
    const original = originalTodos.find((t) => t.id === modified.id)
    if (!original) return null
    
    const changes: string[] = []
    if (original.text !== modified.text) {
      changes.push(`文本: "${original.text}" → "${modified.text}"`)
    }
    if (original.priority !== modified.priority) {
      changes.push(`优先级: ${original.priority} → ${modified.priority}`)
    }
    if (original.completed !== modified.completed) {
      changes.push(modified.completed ? '已完成' : '未完成')
    }
    
    return changes.length > 0 ? { todo: modified, changes } : null
  }).filter(Boolean) as Array<{ todo: Todo; changes: string[] }>

  // 找出新增的待办事项
  const newTodos = modifiedTodos.filter(
    (modified) => !originalTodos.find((t) => t.id === modified.id)
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4"
      >
        <div className="glass glass-strong rounded-2xl p-6 depth-shadow border-[#bd93f9]/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#f8f8f2] mb-1">
                AI 已自动修改待办事项
              </h3>
              <div className="flex items-center gap-2 text-sm text-[#6272a4]">
                <Clock className="w-4 h-4" />
                <span>{timeLeft} 秒后自动确认</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {changes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-[#bd93f9] mb-2">修改的待办事项：</h4>
                {changes.map(({ todo, changes }) => (
                  <div
                    key={todo.id}
                    className="glass rounded-lg p-3 mb-2 border-[#bd93f9]/20"
                  >
                    <p className="text-sm text-[#f8f8f2] font-medium mb-1">
                      {todo.text}
                    </p>
                    <ul className="text-xs text-[#8be9fd] space-y-1">
                      {changes.map((change, idx) => (
                        <li key={idx}>• {change}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {newTodos.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-[#50fa7b] mb-2">新增的待办事项：</h4>
                {newTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="glass rounded-lg p-3 mb-2 border-[#50fa7b]/20"
                  >
                    <p className="text-sm text-[#f8f8f2]">{todo.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-[#ff5555]/30 text-[#ff5555] hover:bg-[#ff5555]/10 hover:border-[#ff5555]"
            >
              <X className="w-4 h-4 mr-2" />
              撤销
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-[#50fa7b] text-[#282a36] hover:bg-[#50fa7b]/90"
            >
              <Check className="w-4 h-4 mr-2" />
              确认 ({timeLeft}s)
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

