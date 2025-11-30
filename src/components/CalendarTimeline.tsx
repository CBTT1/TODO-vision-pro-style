import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { Todo } from '@/types/todo'
import { Button } from './ui/button'

interface CalendarTimelineProps {
  todos: Todo[]
  onDateSelect?: (date: Date) => void
  selectedDate?: Date | null
}

export function CalendarTimeline({ todos, onDateSelect, selectedDate }: CalendarTimelineProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isCollapsed, setIsCollapsed] = useState(false)

  // 按日期分组待办事项
  const todosByDate = useMemo(() => {
    const grouped: Record<string, Todo[]> = {}
    todos.forEach(todo => {
      const date = new Date(todo.createdAt)
      const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(todo)
    })
    return grouped
  }, [todos])

  // 获取月份的第一天
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - startDate.getDay()) // 从周日开始

  // 生成日历网格
  const calendarDays = useMemo(() => {
    const days: Date[] = []
    const current = new Date(startDate)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return days
  }, [startDate])

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
    if (onDateSelect) {
      onDateSelect(new Date())
    }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="glass glass-strong rounded-2xl p-6 depth-shadow h-full overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            时间表
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              今天
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* 月份导航 */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPreviousMonth}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-lg font-medium text-foreground">
                  {currentMonth.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNextMonth}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

                    <div className="grid grid-cols-7 gap-1 mb-4">
                {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                  <div key={day} className="text-center text-xs text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
          {calendarDays.map((date, index) => {
            const dateKey = getDateKey(date)
            const dayTodos = todosByDate[dateKey] || []
            const isSelected = selectedDate && getDateKey(selectedDate) === dateKey
            const isTodayDate = isToday(date)

            return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDateSelect && onDateSelect(new Date(date))}
                  className={`
                    aspect-square p-1 rounded-lg text-sm transition-all
                    ${!isCurrentMonth(date) ? 'text-muted-foreground/30' : 'text-foreground'}
                    ${isTodayDate ? 'bg-primary/20 border border-primary' : ''}
                    ${isSelected ? 'bg-primary/30 border border-primary' : ''}
                    ${dayTodos.length > 0 && !isSelected ? 'bg-accent/10 hover:bg-accent/20' : 'hover:bg-primary/10'}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span className={isTodayDate ? 'font-bold' : ''}>{date.getDate()}</span>
                    {dayTodos.length > 0 && (
                      <span className="text-xs text-[#50fa7b] dark:text-[#50fa7b] light:text-[#2d8659] mt-0.5">
                        {dayTodos.length}
                      </span>
                    )}
                  </div>
                </motion.button>
              )
            })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 选中日期的待办事项列表 */}
      {selectedDate && !isCollapsed && (
        <div className="mt-6 border-t border-primary/20 pt-4">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            {selectedDate.toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </h3>
          {todosByDate[getDateKey(selectedDate)] ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {todosByDate[getDateKey(selectedDate)]
                .sort((a, b) => a.createdAt - b.createdAt)
                .map(todo => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass rounded-lg p-3 border-primary/20"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm text-foreground ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {todo.text}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(todo.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          todo.priority === 'high' ? "bg-[#ff5555]/20 text-[#ff5555]" :
                          todo.priority === 'medium' ? "bg-[#ffb86c]/20 text-[#ffb86c]" :
                          "bg-[#8be9fd]/20 text-[#8be9fd]"
                        }`}
                      >
                        {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              这一天没有待办事项
            </p>
          )}
        </div>
      )}
    </div>
  )
}

