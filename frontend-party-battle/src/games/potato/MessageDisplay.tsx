import { Text } from '../../../components/ui/text'
import { usePotatoGameStore } from './usePotatoStore'

export default function MessageDisplay() {
  const message = usePotatoGameStore((state) => state.view.message)

  return <Text className="text-4xl font-normal dark:text-white text-black">{message}</Text>
}
