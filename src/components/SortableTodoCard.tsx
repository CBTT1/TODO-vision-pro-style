import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TodoCard } from './TodoCard'
import { Todo } from '@/types/todo'

interface SortableTodoCardProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function SortableTodoCard({ todo, onToggle, onDelete }: SortableTodoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TodoCard
        todo={todo}
        onToggle={onToggle}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  )
}

