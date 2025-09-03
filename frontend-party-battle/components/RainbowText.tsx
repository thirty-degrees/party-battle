import { Text } from '@/components/ui/text';

const rainbowColors = [
  '#FF6B6B', // Bright Red
  '#FFA500', // Orange
  '#FFD93D', // Bright Yellow
  '#6BCF7F', // Bright Green
  '#4ECDC4', // Bright Cyan
];

interface RainbowTextProps {
  text: string;
  className?: string;
}

export default function RainbowText({ text, className }: RainbowTextProps) {
  return (
    <>
      {text.split('').map((letter, index) => (
        <Text
          key={index}
          style={{ color: rainbowColors[index % rainbowColors.length] }}
          className={`${className ? ` ${className}` : ''}`}
        >
          {letter}
        </Text>
      ))}
    </>
  );
}
