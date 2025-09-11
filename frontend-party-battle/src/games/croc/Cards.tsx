import { TouchableOpacity, View } from 'react-native'
import CardSvgComponent from './cardSvgComponent'

type CardsProps = {
  cardCount: number
  pressedCardIndex: number[]
  onCardPress: (cardIndex: number) => void
  disabled?: boolean
}

export default function Cards({ cardCount, pressedCardIndex, onCardPress, disabled = false }: CardsProps) {
  return (
    <View className="w-full items-center" style={{ opacity: disabled ? 0.5 : 1 }}>
      <View className="flex-row justify-between mb-2 gap-1">
        {Array.from({ length: Math.min(6, cardCount) }, (_, index) => {
          const isPressed = pressedCardIndex.includes(index)
          return (
            <TouchableOpacity
              key={index}
              onPress={isPressed || disabled ? undefined : () => onCardPress(index)}
              disabled={isPressed || disabled}
              style={{
                opacity: isPressed ? 0 : 1,
                width: '15%',
                aspectRatio: 0.7,
              }}
            >
              <CardSvgComponent />
            </TouchableOpacity>
          )
        })}
      </View>
      {cardCount > 6 && (
        <View className="flex-row justify-between gap-1">
          {Array.from({ length: Math.min(6, cardCount - 6) }, (_, index) => {
            const cardIndex = index + 6
            const isPressed = pressedCardIndex.includes(cardIndex)
            return (
              <TouchableOpacity
                key={cardIndex}
                onPress={isPressed || disabled ? undefined : () => onCardPress(cardIndex)}
                disabled={isPressed || disabled}
                style={{
                  opacity: isPressed ? 0 : 1,
                  width: '15%',
                  aspectRatio: 0.7,
                }}
              >
                <CardSvgComponent />
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  )
}
