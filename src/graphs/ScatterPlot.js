import React from 'react'
import PropTypes from 'prop-types'
import { extent as d3ArrayExtent } from 'd3-array'
import { scaleLinear as d3ScaleLinear } from 'd3-scale'
import { syncStateChange } from './animation.js'
import Circle from './shapes/Circle.js'
import Line from './shapes/Line.js'

export const average = (ary) => {
  return ary.reduce((total, n) => total + n, 0) / ary.length
}

export const pluck = (ary, key) => {
  return ary.map((i) => i[key])
}

export const datumToCircle = (mapping) => (datum) => ({
  shape: "circle",
  cx: parseFloat(datum[mapping.x]),
  cy: parseFloat(datum[mapping.y]),
  key: datum[mapping.guid],
  r: 6,
  fill: mapping.groupColors[datum[mapping.groupBy]]
})

export const makeDataTransform = (mapping) => (data) => {
  return data.map(datumToCircle(mapping))
}

export const makeDataTransformWithAverage = (mapping, group) => (data) => {
  const isSelected = (datum) => datum[mapping.groupBy] === group
  const selectedData = data.filter(isSelected)

  const color = mapping.groupColors[group]

  const averageCircle = {
    shape: "circle",
    fadeIn: true,
    cx: average(pluck(selectedData, mapping.x).map(parseFloat)),
    cy: average(pluck(selectedData, mapping.y).map(parseFloat)),
    stroke: color,
    strokeWidth: 1,
    r: 6,
    fill: 'white',
    key: 'average',
  }

  const circles = [
    ...data.map((datum) => ({
      ...datumToCircle(mapping)(datum),
      opacity: isSelected(datum) ? 1 : 0.5,
      fadeOut: !isSelected(datum)
    })),
    averageCircle
  ]

  const lines = selectedData
    .map((datum) => ({
      shape: "line",
      fadeIn: true,
      x1: parseFloat(datum[mapping.x]),
      y1: parseFloat(datum[mapping.y]),
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

function createScale (data, key, range) {
  const domain = d3ArrayExtent(data, (datum) => datum[key])
  return d3ScaleLinear()
    .domain(domain)
    .range(range)
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

    const filteredData = mapping.filterBy ? data.filter(mapping.filterBy) : data

    const xScale = createScale(filteredData, mapping.x, [0, width])

    const yScale = createScale(filteredData, mapping.y, [height, 0])

    const transformedData = showAverage
      ? makeDataTransformWithAverage(mapping, showAverage)(filteredData)
      : makeDataTransform(mapping)(filteredData)

    const syncFadeIn = syncStateChange({
      start: () => ({opacity: 0}),
      end: () => ({opacity: 1})
    })

    const syncFadeOut = syncStateChange({
      start: () => ({opacity: 1}),
      end: ({opacity}) => ({opacity})
    })

    return <svg
      height={height + margin * 2}
      width={width + margin * 2}
    >
      <g
        style={{
          transform: `translate(${margin}px, ${margin}px)`
        }}
      >
        {transformedData.map(({
          shape,
          key,
          fadeIn,
          fadeOut,
          ...svgAttrs
        }) => {

          let syncAnim

          if(fadeIn) {
            syncAnim = syncFadeIn
          }

          if(fadeOut) {
            syncAnim = syncFadeOut
          }

          const Shape = ({
            line: Line,
            circle: Circle
          })[shape]

          return <Shape
            key={key}
            xScale={xScale}
            yScale={yScale}
            syncAnim={syncAnim}
            {...svgAttrs}
          />
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
