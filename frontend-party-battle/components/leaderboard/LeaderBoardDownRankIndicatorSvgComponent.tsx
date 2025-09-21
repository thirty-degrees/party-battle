import Svg, { Path, SvgProps } from 'react-native-svg'

const LeaderBoardDownRankIndicatorSvgComponent = (props: SvgProps) => (
  <Svg viewBox="0 0 100 75" fill="none" {...props}>
    <Path
      fill="#E66565"
      d="M52.598 70.5c-1.155 2-4.041 2-5.196 0l-38.105-66c-1.155-2 .288-4.5 2.598-4.5h76.21c2.31 0 3.753 2.5 2.598 4.5l-38.105 66Z"
    />
  </Svg>
)

export default LeaderBoardDownRankIndicatorSvgComponent
