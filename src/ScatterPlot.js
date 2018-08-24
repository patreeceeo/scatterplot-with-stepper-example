import React from 'react'
import PropTypes from 'prop-types'
import { extent as d3ArrayExtent } from 'd3-array'
import { scaleLinear as d3ScaleLinear } from 'd3-scale'

export const average = (ary) => {
  return ary.reduce((total, n) => total + n, 0) / ary.length
}

export const pluck = (ary, key) => {
  return ary.map((i) => i[key])
}

export const datumToCircle = (mapping) => (datum) => ({
  shape: "circle",
  cx: datum[mapping.x],
  cy: datum[mapping.y],
  key: datum[mapping.guid],
  r: 6,
  fill: mapping.groupColors[datum[mapping.groupBy]]
})

export const makeDataTransform = (mapping) => (data) => {
  return data.map(datumToCircle(mapping))
}

export const makeAverageTransform = (mapping, group) => (data) => {
  const isSelected = (datum) => datum[mapping.groupBy] === group
  const selectedData = data.filter(isSelected)

  const color = mapping.groupColors[group]

  const averageCircle = {
    shape: "circle",
    cx: average(pluck(selectedData, mapping.x)),
    cy: average(pluck(selectedData, mapping.y)),
    stroke: color,
    strokeWidth: 1,
    r: 6,
    fill: "white",
    key: 'average',
  }

  const circles = [
    ...data.map((datum) => ({
      ...datumToCircle(mapping)(datum),
      opacity: isSelected(datum) ? 1 : 0.5
    })),
    averageCircle
  ]

  const lines = selectedData
    .map((datum) => ({
      shape: "line",
      x1: datum[mapping.x],
      y1: datum[mapping.y],
      x2: averageCircle.cx,
      y2: averageCircle.cy,
      strokeWidth: 1,
      stroke: color,
      strokeOpacity: 0.3,
      key: `${datum[mapping.guid]}--average`
    }))

  return [
    ...lines,
    ...circles
  ]
}

class ScatterPlot extends React.Component {
  render() {
    const {
      data,
      width,
      height,
      margin,
      showAverage,
      mapping
    } = this.props

    const xScale = d3ScaleLinear()
      .domain(d3ArrayExtent(data, (datum) => datum[mapping.x]))
      .range([0, width])

    const yScale = d3ScaleLinear()
      .domain(d3ArrayExtent(data, (datum) => datum[mapping.y]))
      .range([height, 0])

    const transformedData = showAverage
      ? makeAverageTransform(mapping, showAverage)(data)
      : makeDataTransform(mapping)(data)

    const renderShape = {
      line: function Line ({x1, y1, x2, y2, ...rest}) {
        return <line
          x1={xScale(x1)}
          y1={yScale(y1)}
          x2={xScale(x2)}
          y2={yScale(y2)}
          {...rest}
        />
      },
      circle: function Circle ({cx, cy, ...rest}) {
        return <circle
          cx={xScale(cx)}
          cy={yScale(cy)}
          {...rest}
        />
      }
    }

    return <svg height={height + margin * 2} width={width + margin * 2}>
      <g
        style={{
          transform: `translate(${margin}px, ${margin}px)`
        }}
      >
        {transformedData.map(({shape, ...attrs}) => {
          return renderShape[shape](attrs)
        })}
      </g>
    </svg>
  }
}

ScatterPlot.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  margin: PropTypes.number,
  showAverage: PropTypes.string,
  mapping: PropTypes.object.isRequired
}

ScatterPlot.defaultProps = {
  margin: 10
}

export default ScatterPlot
