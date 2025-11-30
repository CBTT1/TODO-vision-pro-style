import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Scene3D } from './components/Scene3D'
import { TodoList } from './components/TodoList'
import { AISuggestions } from './components/AISuggestions'
import { AIConfirmation } from './components/AIConfirmation'
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
  const [newTodoText, setNewTodoText] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [pendingChanges, setPendingChanges] = useState<{
    originalTodos: Todo[]
    modifiedTodos: Todo[]
  } | null>(null)

  useEffect(() => {
    localStorage.setItem('vision-pro-todos', JSON.stringify(todos))
  }, [todos])

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
      setIsAddDialogOpen(false)
    }
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

  const applyAISuggestion = (suggestion: string, modifiedTodos: Todo[]) => {
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
      
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-6xl font-bold text-[#f8f8f2] mb-4 tracking-tight">
            Vision Pro TODO
          </h1>
          <p className="text-[#6272a4] text-lg">
            空间计算待办事项管理
          </p>
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
            <h2 className="text-2xl font-semibold text-[#f8f8f2] mb-4">
              进行中 ({activeTodos.length})
            </h2>
            <TodoList
              todos={activeTodos}
              onReorder={reorderTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </div>
        )}

        {completedTodos.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-[#6272a4] mb-4">
              已完成 ({completedTodos.length})
            </h2>
            <TodoList
              todos={completedTodos}
              onReorder={reorderTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </div>
        )}

        {todos.length === 0 && (
          <div className="glass glass-strong rounded-2xl p-12 text-center depth-shadow">
            <p className="text-[#6272a4] text-lg">还没有待办事项，开始添加吧！</p>
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="glass glass-strong border-[#bd93f9]/30 text-[#f8f8f2] bg-[#282a36]">
          <DialogHeader>
            <DialogTitle className="text-[#f8f8f2]">添加新待办</DialogTitle>
            <DialogDescription className="text-[#6272a4]">
              创建一个新的待办事项
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              placeholder="输入待办事项..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              className="bg-[#44475a] border-[#bd93f9]/30 text-[#f8f8f2] placeholder:text-[#6272a4] focus:border-[#bd93f9]"
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
                      ? 'bg-[#bd93f9] text-[#282a36] hover:bg-[#bd93f9]/90' 
                      : 'border-[#bd93f9]/30 text-[#6272a4] hover:border-[#bd93f9] hover:text-[#f8f8f2]'
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
              className="border-[#bd93f9]/30 text-[#6272a4] hover:border-[#bd93f9] hover:text-[#f8f8f2]"
            >
              取消
            </Button>
            <Button
              onClick={addTodo}
              className="bg-[#bd93f9] text-[#282a36] hover:bg-[#bd93f9]/90"
            >
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App

