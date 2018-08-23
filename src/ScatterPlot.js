import React from 'react'
import PropTypes from 'prop-types'

// TODO: consider using D3

class ScatterPlot extends React.Component {
  render() {
    return <svg height='100' width='100'>
      {
        this.props.points.map(({x, y, color, id}) => {
          return <circle
            cx={x}
            cy={y}
            fill={color}
            r={3}
            key={id}
          />

        })
      }
    </svg>
  }
}

ScatterPlot.propTypes = {
  points: PropTypes.array.isRequired,
}

export default ScatterPlot
