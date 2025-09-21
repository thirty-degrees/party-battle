import Svg, { Path, SvgProps } from 'react-native-svg'

const LeaderBoardUpRankIndicatorSvgComponent = (props: SvgProps) => (
  <Svg viewBox="0 0 100 75" fill="none" {...props}>
    <Path
      fill="#7DE665"
      d="M47.402 4.5c1.155-2 4.041-2 5.196 0l38.105 66c1.155 2-.288 4.5-2.598 4.5h-76.21c-2.31 0-3.753-2.5-2.598-4.5l38.105-66Z"
    />
  </Svg>
)

export default LeaderBoardUpRankIndicatorSvgComponent
