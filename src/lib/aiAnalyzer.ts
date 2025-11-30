import { Todo } from '@/types/todo'

// 任务类型分类
const TASK_CATEGORIES = {
  work: ['会议', '项目', '报告', '演示', '代码', '开发', '设计', '文档', '邮件', '客户', '团队'],
  study: ['学习', '阅读', '课程', '作业', '考试', '复习', '笔记', '练习'],
  life: ['购物', '买菜', '做饭', '洗衣', '打扫', '整理', '维修', '缴费'],
  health: ['运动', '健身', '跑步', '瑜伽', '体检', '医生', '吃药'],
  social: ['聚会', '约会', '拜访', '电话', '聊天', '聚餐'],
  finance: ['账单', '支付', '转账', '投资', '理财', '报销'],
  travel: ['旅行', '出差', '订票', '酒店', '行程'],
  urgent: ['紧急', '重要', '尽快', '立即', '马上', '今天必须']
}

// 识别任务类型
function categorizeTask(text: string): string[] {
  const categories: string[] = []
  const lowerText = text.toLowerCase()
  
  Object.entries(TASK_CATEGORIES).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      categories.push(category)
    }
  })
  
  return categories.length > 0 ? categories : ['other']
}

// 计算任务相似度（简单的文本相似度）
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/)
  const words2 = text2.toLowerCase().split(/\s+/)
  const allWords = new Set([...words1, ...words2])
  const commonWords = words1.filter(w => words2.includes(w))
  return commonWords.length / allWords.size
}

// 分析任务模式
export interface TaskAnalysis {
  categories: Map<string, number>
  similarTasks: Array<{ task1: Todo; task2: Todo; similarity: number }>
  highPriorityCount: number
  mediumPriorityCount: number
  lowPriorityCount: number
  averageTaskLength: number
  urgentKeywords: number
  completionRate: number
  recentCompletedTasks: Todo[]
  frequentPatterns: string[]
}

export function analyzeTasks(todos: Todo[]): TaskAnalysis {
  const activeTodos = todos.filter(t => !t.completed)
  const completedTodos = todos.filter(t => t.completed)
  
  // 分类统计
  const categories = new Map<string, number>()
  activeTodos.forEach(todo => {
    const cats = categorizeTask(todo.text)
    cats.forEach(cat => {
      categories.set(cat, (categories.get(cat) || 0) + 1)
    })
  })
  
  // 查找相似任务
  const similarTasks: Array<{ task1: Todo; task2: Todo; similarity: number }> = []
  for (let i = 0; i < activeTodos.length; i++) {
    for (let j = i + 1; j < activeTodos.length; j++) {
      const similarity = calculateSimilarity(activeTodos[i].text, activeTodos[j].text)
      if (similarity > 0.3) {
        similarTasks.push({
          task1: activeTodos[i],
          task2: activeTodos[j],
          similarity
        })
      }
    }
  }
  
  // 优先级统计
  const highPriorityCount = activeTodos.filter(t => t.priority === 'high').length
  const mediumPriorityCount = activeTodos.filter(t => t.priority === 'medium').length
  const lowPriorityCount = activeTodos.filter(t => t.priority === 'low').length
  
  // 平均任务长度
  const averageTaskLength = activeTodos.length > 0
    ? activeTodos.reduce((sum, t) => sum + t.text.length, 0) / activeTodos.length
    : 0
  
  // 紧急关键词检测
  const urgentKeywords = activeTodos.filter(t => 
    TASK_CATEGORIES.urgent.some(keyword => t.text.toLowerCase().includes(keyword))
  ).length
  
  // 完成率
  const completionRate = todos.length > 0 ? completedTodos.length / todos.length : 0
  
  // 最近完成的任务（最近7天）
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentCompletedTasks = completedTodos
    .filter(t => t.createdAt > sevenDaysAgo)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)
  
  // 识别频繁模式（从已完成任务中）
  const completedTexts = completedTodos.map(t => t.text.toLowerCase())
  const frequentPatterns: string[] = []
  const wordFrequency = new Map<string, number>()
  
  completedTexts.forEach(text => {
    const words = text.split(/\s+/).filter(w => w.length > 1)
    words.forEach(word => {
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1)
    })
  })
  
  // 找出出现频率高的词（至少出现3次）
  wordFrequency.forEach((count, word) => {
    if (count >= 3 && word.length > 2) {
      frequentPatterns.push(word)
    }
  })
  
  return {
    categories,
    similarTasks,
    highPriorityCount,
    mediumPriorityCount,
    lowPriorityCount,
    averageTaskLength,
    urgentKeywords,
    completionRate,
    recentCompletedTasks,
    frequentPatterns: frequentPatterns.slice(0, 10)
  }
}

// 生成智能建议
export interface AISuggestion {
  text: string
  type: 'priority' | 'merge' | 'categorize' | 'decompose' | 'schedule' | 'pattern' | 'encourage'
  action?: () => Todo[]
  priority: 'high' | 'medium' | 'low'
}

export function generateSmartSuggestions(todos: Todo[]): AISuggestion[] {
  const analysis = analyzeTasks(todos)
  const activeTodos = todos.filter(t => !t.completed)
  const suggestions: AISuggestion[] = []
  
  // 如果没有待办事项
  if (activeTodos.length === 0) {
    suggestions.push({
      text: '🎉 恭喜！所有任务已完成。根据历史记录，您最近完成了 ' + 
            (analysis.recentCompletedTasks.length > 0 
              ? `${analysis.recentCompletedTasks.length} 个任务` 
              : '一些任务') + 
            '，继续保持！',
      type: 'encourage',
      priority: 'low',
      action: () => {
        // 为已完成的任务添加成就标记
        return todos.map(todo => {
          if (todo.completed && !todo.text.includes('🎉') && !todo.text.includes('✨')) {
            return { ...todo, text: `🎉 ${todo.text}` }
          }
          return todo
        })
      }
    })
    return suggestions
  }
  
  // 1. 相似任务合并建议
  if (analysis.similarTasks.length > 0) {
    const topSimilar = analysis.similarTasks
      .sort((a, b) => b.similarity - a.similarity)[0]
    
    if (topSimilar.similarity > 0.5) {
      suggestions.push({
        text: `发现相似任务："${topSimilar.task1.text}" 和 "${topSimilar.task2.text}"，相似度 ${Math.round(topSimilar.similarity * 100)}%，建议合并处理以提高效率`,
        type: 'merge',
        priority: 'high',
        action: () => {
          const modified = [...todos]
          const idx1 = modified.findIndex(t => t.id === topSimilar.task1.id)
          const idx2 = modified.findIndex(t => t.id === topSimilar.task2.id)
          if (idx1 !== -1 && idx2 !== -1) {
            modified[idx1] = {
              ...modified[idx1],
              text: `${modified[idx1].text} + ${modified[idx2].text}`,
              priority: 'high'
            }
            modified.splice(idx2, 1)
          }
          return modified
        }
      })
    }
  }
  
  // 2. 紧急任务优先级建议
  if (analysis.urgentKeywords > 0) {
    const urgentTasks = activeTodos.filter(t => 
      TASK_CATEGORIES.urgent.some(keyword => t.text.toLowerCase().includes(keyword)) &&
      t.priority !== 'high'
    )
    
    if (urgentTasks.length > 0) {
      suggestions.push({
        text: `检测到 ${urgentTasks.length} 个包含紧急关键词的任务，建议将它们设置为高优先级`,
        type: 'priority',
        priority: 'high',
        action: () => {
          return todos.map(todo => {
            if (urgentTasks.some(ut => ut.id === todo.id)) {
              return { ...todo, priority: 'high' as const }
            }
            return todo
          })
        }
      })
    }
  }
  
  // 3. 任务分类建议
  const topCategory = Array.from(analysis.categories.entries())
    .sort((a, b) => b[1] - a[1])[0]
  
  if (topCategory && topCategory[1] >= 3) {
    const categoryTasks = activeTodos.filter(t => 
      categorizeTask(t.text).includes(topCategory[0])
    )
    
    suggestions.push({
      text: `您有 ${topCategory[1]} 个${getCategoryName(topCategory[0])}相关任务，建议将它们分组处理`,
      type: 'categorize',
      priority: 'medium',
      action: () => {
        return todos.map(todo => {
          if (categoryTasks.some(ct => ct.id === todo.id) && todo.priority === 'low') {
            return { ...todo, priority: 'medium' as const }
          }
          return todo
        })
      }
    })
  }
  
  // 4. 优先级分布建议
  if (analysis.highPriorityCount === 0 && activeTodos.length > 3) {
    suggestions.push({
      text: `您有 ${activeTodos.length} 个待办事项，但没有高优先级任务。建议将最重要的 2-3 个任务设置为高优先级`,
      type: 'priority',
      priority: 'medium',
      action: () => {
        const modified = [...todos]
        activeTodos.slice(0, 2).forEach((todo) => {
          const todoIdx = modified.findIndex(t => t.id === todo.id)
          if (todoIdx !== -1) {
            modified[todoIdx] = { ...modified[todoIdx], priority: 'high' as const }
          }
        })
        return modified
      }
    })
  }
  
  // 5. 基于历史模式的建议
  if (analysis.frequentPatterns.length > 0) {
    const patternTasks = activeTodos.filter(t => 
      analysis.frequentPatterns.some(pattern => 
        t.text.toLowerCase().includes(pattern)
      )
    )
    
    if (patternTasks.length > 0) {
      suggestions.push({
        text: `根据历史记录，您经常处理包含"${analysis.frequentPatterns[0]}"的任务。建议优先完成这类任务`,
        type: 'pattern',
        priority: 'medium',
        action: () => {
          return todos.map(todo => {
            if (patternTasks.some(pt => pt.id === todo.id) && todo.priority !== 'high') {
              return { ...todo, priority: 'high' as const }
            }
            return todo
          })
        }
      })
    }
  }
  
  // 6. 任务过多建议 - 为高优先级任务添加番茄标记
  if (activeTodos.length > 8) {
    const highPriorityTasks = activeTodos.filter(t => t.priority === 'high')
    if (highPriorityTasks.length > 0) {
      suggestions.push({
        text: `您当前有 ${activeTodos.length} 个待办事项，建议使用番茄工作法，为高优先级任务添加专注标记`,
        type: 'schedule',
        priority: 'medium',
        action: () => {
          return todos.map(todo => {
            if (highPriorityTasks.some(hpt => hpt.id === todo.id) && !todo.text.startsWith('🍅')) {
              return { ...todo, text: `🍅 ${todo.text}` }
            }
            return todo
          })
        }
      })
    } else {
      // 如果没有高优先级任务，建议设置前3个为高优先级并添加标记
      suggestions.push({
        text: `您当前有 ${activeTodos.length} 个待办事项，建议将前3个任务设置为高优先级并使用番茄工作法`,
        type: 'schedule',
        priority: 'medium',
        action: () => {
          const modified = [...todos]
          activeTodos.slice(0, 3).forEach((todo) => {
            const todoIdx = modified.findIndex(t => t.id === todo.id)
            if (todoIdx !== -1) {
              modified[todoIdx] = {
                ...modified[todoIdx],
                priority: 'high' as const,
                text: modified[todoIdx].text.startsWith('🍅') 
                  ? modified[todoIdx].text 
                  : `🍅 ${modified[todoIdx].text}`
              }
            }
          })
          return modified
        }
      })
    }
  }
  
  // 7. 长任务分解建议 - 将长任务拆分为多个子任务
  const longTasks = activeTodos.filter(t => t.text.length > 30)
  if (longTasks.length > 0) {
    suggestions.push({
      text: `检测到 ${longTasks.length} 个较长的任务描述，建议将它们分解为更小的子任务`,
      type: 'decompose',
      priority: 'low',
      action: () => {
        const modified: Todo[] = []
        todos.forEach(todo => {
          if (longTasks.some(lt => lt.id === todo.id)) {
            // 将长任务按句号、逗号或"和"、"与"等分割
            const parts = todo.text.split(/[，,。、和与及]/).filter(p => p.trim().length > 0)
            if (parts.length > 1) {
              // 创建多个子任务
              parts.forEach((part, idx) => {
                modified.push({
                  ...todo,
                  id: `${todo.id}-${idx}`,
                  text: part.trim(),
                  priority: idx === 0 ? todo.priority : 'medium' as const
                })
              })
            } else {
              // 如果无法分割，保持原样但添加分解提示
              modified.push({
                ...todo,
                text: `📋 ${todo.text} (建议分解)`
              })
            }
          } else {
            modified.push(todo)
          }
        })
        return modified
      }
    })
  }
  
  // 8. 完成率鼓励 - 为已完成任务添加成就标记
  const completedTodos = todos.filter(t => t.completed)
  if (analysis.completionRate > 0.7 && completedTodos.length > 5) {
    suggestions.push({
      text: `您的任务完成率是 ${Math.round(analysis.completionRate * 100)}%，表现优秀！建议为最近完成的任务添加成就标记`,
      type: 'encourage',
      priority: 'low',
      action: () => {
        return todos.map(todo => {
          // 为最近完成的任务添加成就标记（如果还没有）
          if (todo.completed && !todo.text.includes('✨') && !todo.text.includes('🎉')) {
            const isRecent = Date.now() - todo.createdAt < 7 * 24 * 60 * 60 * 1000
            if (isRecent) {
              return { ...todo, text: `✨ ${todo.text}` }
            }
          }
          return todo
        })
      }
    })
  }
  
  // 按优先级排序
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    work: '工作',
    study: '学习',
    life: '生活',
    health: '健康',
    social: '社交',
    finance: '财务',
    travel: '旅行',
    urgent: '紧急'
  }
  return names[category] || category
}

