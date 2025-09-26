import { useEffect, useState } from 'react'
import { COLOR_NAME_TO_RGB } from 'types-party-battle/consts/config'
import { RGBColorSchema, fromRgbColor } from 'types-party-battle/types/RGBColorSchema'
import { ColorButtons } from './ColorButtons'

export const AnimatedColorButtons = () => {
  const [animatedColors, setAnimatedColors] = useState<RGBColorSchema[]>([])

  useEffect(() => {
    const colorNames = Object.keys(COLOR_NAME_TO_RGB) as (keyof typeof COLOR_NAME_TO_RGB)[]

    const interval = setInterval(() => {
      const shuffledColors = colorNames
        .sort(() => Math.random() - 0.5)
        .map((name) => fromRgbColor(COLOR_NAME_TO_RGB[name]))

      setAnimatedColors(shuffledColors)
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return <ColorButtons colorButtons={animatedColors} onButtonPress={() => {}} />
}
