import React from 'react'
import PropTypes from 'prop-types'

class Circle extends React.PureComponent {
  render() {
    const {
      xScale,
      yScale,
      cx,
      cy,
      ...rest
    } = this.props

    return <circle
      cx={xScale(cx)}
      cy={yScale(cy)}
      {...rest}
    />

  }
}

Circle.propTypes = {
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  cx: PropTypes.number,
  cy: PropTypes.number,
  syncAnim: PropTypes.func,
}

export default Circle
