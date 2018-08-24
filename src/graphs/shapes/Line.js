import React from 'react'
import { SyncAnim } from '../animation.js'
import PropTypes from 'prop-types'


class Line extends React.Component {
  render() {
    const {
      xScale,
      yScale,
      x1,
      y1,
      x2,
      y2,
      opacity,
      syncAnim,
      ...rest
    } = this.props

    if(syncAnim) {
      return <SyncAnim sync={syncAnim} opacity={opacity}>
        <line
          x1={xScale(x1)}
          y1={yScale(y1)}
          x2={xScale(x2)}
          y2={yScale(y2)}
          {...rest}
        />
      </SyncAnim>
    } else {
      return <line
        x1={xScale(x1)}
        y1={yScale(y1)}
        x2={xScale(x2)}
        y2={yScale(y2)}
        {...rest}
      />
    }
  }
}

Line.propTypes = {
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  x1: PropTypes.number,
  y1: PropTypes.number,
  x2: PropTypes.number,
  y2: PropTypes.number,
  syncAnim: PropTypes.func,
  opacity: PropTypes.number
}

export default Line
