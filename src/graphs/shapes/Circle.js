import React from 'react'
import { SyncAnim } from '../animation.js'
import PropTypes from 'prop-types'

class Circle extends React.Component {
  render() {
    const {
      xScale,
      yScale,
      cx,
      cy,
      syncAnim,
      opacity,
      ...rest
    } = this.props

    if(syncAnim) {
      return <SyncAnim sync={syncAnim} opacity={opacity}>
        <circle
          cx={xScale(cx)}
          cy={yScale(cy)}
          {...rest}
        />
      </SyncAnim>
    } else {
      return <circle
        cx={xScale(cx)}
        cy={yScale(cy)}
        opacity={opacity}
        {...rest}
      />
    }

  }
}

Circle.propTypes = {
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  cx: PropTypes.number,
  cy: PropTypes.number,
  syncAnim: PropTypes.func,
  opacity: PropTypes.number
}

export default Circle
