import { Button, ButtonIcon } from '@/components/ui/button'
import { LogOutIcon } from '@/components/ui/icon'
import { useLeaveParty } from './useLeaveParty'

export default function LeaveLobbyButton() {
  const { leaveParty } = useLeaveParty()

  return (
    <Button size="md" action="negative" className="p-2" onPress={leaveParty}>
      <ButtonIcon as={LogOutIcon} />
    </Button>
  )
}
