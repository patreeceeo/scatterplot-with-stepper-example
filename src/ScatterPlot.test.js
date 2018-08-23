import {
  average,
  makeAverageTransform
} from './ScatterPlot.js'

describe('average', () => {
  it('returns the average of an array', () => {
    expect(average([2,4,6])).toBe(4)
  })
})

describe('makeAverageTransform', () => {
  it('fades points that are not selected', () => {
    const transform = makeAverageTransform(({color}) => color === 'orange')

    const points = [
      {color: 'blue'},
      {color: 'orange'}
    ]

    expect(transform(points).circles[0].opacity).toBe(0.5)
  })

  it('adds the average point', () => {
    const transform = makeAverageTransform(({color}) => color === 'red')

    const points = [
      {
        x: 2,
        y: 6,
        color: 'red'
      },
      {
        x: 4,
        y: 4,
        color: 'red'
      },
      {
        x: 6,
        y: 2,
        color: 'red'
      },
      {
        x: 10,
        y: 10,
        color: 'orange'
      },
    ]

    const circles = transform(points).circles

    expect(circles[circles.length - 1]).toEqual(expect.objectContaining({
      cx: 4,
      cy: 4,
    }))

  })

  it('adds lines connecting the average point', () => {
    const transform = makeAverageTransform(({color}) => color === 'red')

    const points = [
      {
        x: 2,
        y: 6,
        color: 'red'
      },
      {
        x: 4,
        y: 4,
        color: 'red'
      },
      {
        x: 6,
        y: 2,
        color: 'red'
      },
      {
        x: 10,
        y: 10,
        color: 'orange'
      },
    ]

    expect(transform(points).lines).toEqual([
      expect.objectContaining({
        x1: 2,
        y1: 6,
        x2: 4,
        y2: 4
      }),
      expect.objectContaining({
        x1: 4,
        y1: 4,
        x2: 4,
        y2: 4
      }),
      expect.objectContaining({
        x1: 6,
        y1: 2,
        x2: 4,
        y2: 4
      })
    ])
  })
})
