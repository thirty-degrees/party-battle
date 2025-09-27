import { Button, ButtonIcon } from '@/components/ui/button'
import { LogOutIcon } from '@/components/ui/icon'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { useRouter } from 'expo-router'

export default function LeaveLobbyButton() {
  const leaveLobbyRoom = useLobbyStore((state) => state.leaveLobbyRoom)
  const router = useRouter()

  const handleLeaveParty = async () => {
    await leaveLobbyRoom()
    router.push('/')
  }

  return (
    <Button size="md" action="negative" className="p-2" onPress={handleLeaveParty}>
      <ButtonIcon as={LogOutIcon} />
    </Button>
  )
}
