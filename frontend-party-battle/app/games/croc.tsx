import Loading from '@/components/Loading'
import CrocGameContent from '@/src/games/CrocGameContent'
import {
  CrocGameProvider,
  useCrocGameContext,
} from '@/src/games/CrocGameProvider'
import { useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'

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

  useEffect(() => {
    if (roomId && !isLoading && !room) {
      joinCrocGame(roomId)
    }
  }, [roomId, joinCrocGame, isLoading, room])

  if (isLoading || !room) {
    return <Loading />
  }

  return <CrocGameContent room={room} />
}
