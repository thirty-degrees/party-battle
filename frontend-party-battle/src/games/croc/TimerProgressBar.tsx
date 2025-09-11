import { Progress, ProgressFilledTrack } from '@/components/ui/progress'
import { useEffect, useState } from 'react'

type TimerProgressBarProps = {
  timeWhenTimerIsOver: number
  isActive: boolean
}

export default function TimerProgressBar({ timeWhenTimerIsOver, isActive }: TimerProgressBarProps) {
  const [progress, setProgress] = useState(100)
  const [startTime, setStartTime] = useState<number | null>(null)

  useEffect(() => {
    if (!isActive || timeWhenTimerIsOver === 0) {
      setProgress(100)
      setStartTime(null)
      return
    }

    if (startTime === null) {
      setStartTime(Date.now())
    }

    const updateProgress = () => {
      const currentTime = Date.now()
      const remainingTime = Math.max(timeWhenTimerIsOver - currentTime, 0)

      const totalDuration = timeWhenTimerIsOver - (startTime || currentTime)
      const newProgress = (remainingTime / totalDuration) * 100

      setProgress(Math.max(newProgress, 0))
    }

    updateProgress()

    const interval = setInterval(updateProgress, 16)

    return () => clearInterval(interval)
  }, [timeWhenTimerIsOver, isActive, startTime])

  if (!isActive) {
    return null
  }

  return (
    <Progress value={progress} size="sm" className="w-full max-w-sm">
      <ProgressFilledTrack className="bg-red-500" />
    </Progress>
  )
}
