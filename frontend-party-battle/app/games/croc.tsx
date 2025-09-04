import Loading from '@/components/Loading'
import CrocGameContent from '@/src/games/CrocGameContent'
import { CrocGameProvider, useCrocGameContext } from '@/src/games/CrocGameProvider'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'

export default function CrocScreen() {
  return (
    <CrocGameProvider>
      <CrocGameView />
    </CrocGameProvider>
  )
}

function CrocGameView() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>()
  const { room, isLoading, joinCrocGame } = useCrocGameContext()
  const hasJoinedRef = useRef(false)

  useEffect(() => {
    if (roomId && !room && !hasJoinedRef.current) {
      console.log('joining croc game')
      hasJoinedRef.current = true
      joinCrocGame(roomId)
    }
  }, [roomId, room, joinCrocGame])

  if (isLoading || !room) {
    return <Loading />
  }

  return <CrocGameContent room={room} />
}
