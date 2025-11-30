import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Scene3D } from './components/Scene3D'
import { TodoList } from './components/TodoList'
import { AISuggestions } from './components/AISuggestions'
import { AIConfirmation } from './components/AIConfirmation'
import { CalendarTimeline } from './components/CalendarTimeline'
import { ThemeToggle } from './components/ThemeToggle'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './components/ui/dialog'
import { Todo } from './types/todo'

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('vision-pro-todos')
    return saved ? JSON.parse(saved) : []
  })
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [newTodoText, setNewTodoText] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode')
    return saved ? saved === 'dark' : true
  })
  const [pendingChanges, setPendingChanges] = useState<{
    originalTodos: Todo[]
    modifiedTodos: Todo[]
  } | null>(null)

  useEffect(() => {
    localStorage.setItem('vision-pro-todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light')
    if (isDarkMode) {
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
    }
  }, [isDarkMode])

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
        createdAt: Date.now(),
        priority,
      }
      setTodos([...todos, newTodo])
      setNewTodoText('')
      setPriority('medium')
      setIsAddDialogOpen(false)
    }
  }

  const editTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setNewTodoText(todo.text)
    setPriority(todo.priority)
    setIsEditDialogOpen(true)
  }

  const saveEdit = () => {
    if (editingTodo && newTodoText.trim()) {
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id 
          ? { ...todo, text: newTodoText.trim(), priority }
          : todo
      ))
      setEditingTodo(null)
      setNewTodoText('')
      setPriority('medium')
      setIsEditDialogOpen(false)
    }
  }

  const cancelEdit = () => {
    setEditingTodo(null)
    setNewTodoText('')
    setPriority('medium')
    setIsEditDialogOpen(false)
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const reorderTodos = (newTodos: Todo[]) => {
    setTodos(newTodos)
  }

  const applyAISuggestion = (_suggestion: string, modifiedTodos: Todo[]) => {
    // 保存原始待办事项和修改后的待办事项
    setPendingChanges({
      originalTodos: [...todos],
      modifiedTodos: modifiedTodos.map(t => ({
        ...t,
        id: t.id || Date.now().toString(),
        createdAt: t.createdAt || Date.now(),
        completed: t.completed || false,
        priority: t.priority || 'medium'
      }))
    })
  }

  const confirmAISuggestion = () => {
    if (pendingChanges) {
      setTodos(pendingChanges.modifiedTodos)
      setPendingChanges(null)
    }
  }

  const cancelAISuggestion = () => {
    setPendingChanges(null)
  }

  const activeTodos = todos.filter(t => !t.completed)
  const completedTodos = todos.filter(t => t.completed)

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Scene3D />
      
      <div className="relative z-10 flex gap-8 px-4 py-12 max-w-7xl mx-auto">
        {/* 左侧日历时间表 */}
        <div className="w-72 flex-shrink-0">
          <CalendarTimeline 
            todos={todos} 
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>

        {/* 中间主要内容区域 */}
        <div className="flex-1 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-start justify-between"
        >
          <div>
            <h1 className="text-6xl font-bold text-foreground mb-4 tracking-tight">
              Usher TODO
            </h1>
            <p className="text-muted-foreground text-lg">
              鼻涕待办事项管理
            </p>
          </div>
          <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
        </motion.div>

        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="glass glass-strong depth-shadow hover:depth-shadow-hover text-[#f8f8f2] border-[#bd93f9]/30 bg-[#bd93f9]/10 hover:bg-[#bd93f9]/20"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            添加待办
          </Button>
        </div>
        
        <AISuggestions todos={todos} onApplySuggestion={applyAISuggestion} />
        
        {pendingChanges && (
          <AIConfirmation
            originalTodos={pendingChanges.originalTodos}
            modifiedTodos={pendingChanges.modifiedTodos}
            onConfirm={confirmAISuggestion}
            onCancel={cancelAISuggestion}
          />
        )}

        {activeTodos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              进行中 ({activeTodos.length})
            </h2>
            <TodoList
              todos={activeTodos}
              onReorder={reorderTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          </div>
        )}

        {completedTodos.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
              已完成 ({completedTodos.length})
            </h2>
            <TodoList
              todos={completedTodos}
              onReorder={reorderTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          </div>
        )}

        {todos.length === 0 && (
          <div className="glass glass-strong rounded-2xl p-12 text-center depth-shadow">
            <p className="text-muted-foreground text-lg">还没有待办事项，开始添加吧！</p>
          </div>
        )}
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="glass glass-strong border-primary/30 text-foreground bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">添加新待办</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              创建一个新的待办事项
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              placeholder="输入待办事项..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              className="bg-input border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
            
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <Button
                  key={p}
                  variant={priority === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriority(p)}
                  className={
                    priority === p 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'border-primary/30 text-muted-foreground hover:border-primary hover:text-foreground'
                  }
                >
                  {p === 'high' ? '高优先级' : p === 'medium' ? '中优先级' : '低优先级'}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-primary/30 text-muted-foreground hover:border-primary hover:text-foreground"
            >
              取消
            </Button>
            <Button
              onClick={addTodo}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑待办对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass glass-strong border-primary/30 text-foreground bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">编辑待办</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              修改待办事项内容
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              placeholder="输入待办事项..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
              className="bg-input border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
            
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <Button
                  key={p}
                  variant={priority === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriority(p)}
                  className={
                    priority === p 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'border-primary/30 text-muted-foreground hover:border-primary hover:text-foreground'
                  }
                >
                  {p === 'high' ? '高优先级' : p === 'medium' ? '中优先级' : '低优先级'}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelEdit}
              className="border-primary/30 text-muted-foreground hover:border-primary hover:text-foreground"
            >
              取消
            </Button>
            <Button
              onClick={saveEdit}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App

