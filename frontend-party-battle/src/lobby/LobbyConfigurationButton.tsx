import { Button, ButtonIcon } from '@/components/ui/button'
import { SettingsIcon } from '@/components/ui/icon'
import { LobbyConfigurationModal } from '@/src/lobby/LobbyConfigurationModal'
import { useState } from 'react'

export default function LobbyConfigurationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button size="xl" variant="outline" className="p-2" onPress={() => setIsModalOpen(true)}>
        <ButtonIcon as={SettingsIcon} />
      </Button>

      <LobbyConfigurationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
