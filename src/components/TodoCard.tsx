import { motion } from 'framer-motion'
import { Check, Sparkles, Trash2, GripVertical } from 'lucide-react'
import { Todo } from '@/types/todo'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface TodoCardProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  isDragging?: boolean
}

export function TodoCard({ todo, onToggle, onDelete, isDragging }: TodoCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ 
        opacity: isDragging ? 0.8 : 1, 
        y: 0, 
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 1000 : 1
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative glass glass-strong rounded-2xl p-6 depth-shadow",
        "hover:depth-shadow-hover transition-all duration-300",
        "cursor-grab active:cursor-grabbing",
        todo.completed && "opacity-60"
      )}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => onToggle(todo.id)}
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all",
              todo.completed
                ? "bg-[#50fa7b] border-[#50fa7b]"
                : "border-[#bd93f9]/50 hover:border-[#bd93f9]"
            )}
          >
            {todo.completed && (
              <Check className="w-4 h-4 text-[#282a36] m-auto" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-[#f8f8f2] text-lg font-medium",
                todo.completed && "line-through text-[#6272a4]"
              )}
            >
              {todo.text}
            </p>
            
            {todo.aiSuggestion && (
              <div className="mt-2 flex items-start gap-2 text-sm text-[#8be9fd]">
                <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="italic">{todo.aiSuggestion}</p>
              </div>
            )}
            
            <div className="mt-3 flex items-center gap-2">
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  todo.priority === 'high' && "bg-[#ff5555]/20 text-[#ff5555]",
                  todo.priority === 'medium' && "bg-[#ffb86c]/20 text-[#ffb86c]",
                  todo.priority === 'low' && "bg-[#8be9fd]/20 text-[#8be9fd]"
                )}
              >
                {todo.priority === 'high' ? '高优先级' : 
                 todo.priority === 'medium' ? '中优先级' : '低优先级'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-[#6272a4] group-hover:text-[#bd93f9] transition-colors" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(todo.id)}
            className="text-[#6272a4] hover:text-[#ff5555] hover:bg-[#ff5555]/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

