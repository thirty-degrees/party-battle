import { Progress, ProgressFilledTrack } from '@/components/ui/progress'
import { useEffect, useState } from 'react'

type TimerProgressBarProps = {
  timeWhenTimerIsOver: number
  isActive: boolean
}

export default function TimerProgressBar({ timeWhenTimerIsOver, isActive }: TimerProgressBarProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!isActive || timeWhenTimerIsOver === 0) {
      setProgress(100)
      return
    }

    const updateProgress = () => {
      const currentTime = Date.now()
      const remainingTime = Math.max(timeWhenTimerIsOver - currentTime, 0)
      const totalDuration = 5000 // 5 seconds in milliseconds
      const newProgress = (remainingTime / totalDuration) * 100

      setProgress(Math.max(newProgress, 0))
    }

    // Update immediately
    updateProgress()

    // Update every ~16ms for 60fps smooth animation
    const interval = setInterval(updateProgress, 16)

    return () => clearInterval(interval)
  }, [timeWhenTimerIsOver, isActive])

  if (!isActive) {
    return null
  }

  return (
    <Progress value={progress} size="sm" className="w-full max-w-xs">
      <ProgressFilledTrack />
    </Progress>
  )
}
