import {
  average,
  makeDataTransformWithAverage
} from './ScatterPlot.js'

import last from 'lodash.last'

describe('average', () => {
  it('returns the average of an array', () => {
    expect(average([2,4,6])).toBe(4)
  })
})

describe('makeDataTransformWithAverage', () => {
  it('fades points that are not selected', () => {
    const data = [
      {
        ISO3: 'XXX',
        incidence: 55,
        mortality: 22,
        HDI: 'very high'
      },
      {
        ISO3: 'YYY',
        incidence: 44,
        mortality: 44,
        HDI: 'high'
      },
      {
        ISO3: 'ZZX',
        incidence: 33,
        mortality: 52,
        HDI: 'medium'
      },
      {
        ISO3: 'ZZY',
        incidence: 25,
        mortality: 46,
        HDI: 'medium'
      },
      {
        ISO3: 'ZZZ',
        incidence: 22,
        mortality: 55,
        HDI: "medium"
      },
    ]

    const mapping = {
      guid: "ISO3",
      x: "incidence",
      y: "mortality",
      groupBy: "HDI",
      groupColors: {
        'very high': '#4AA1C9',
        'high': '#459162',
        'medium': '#CF764D',
        'low': '#9F3B42'
      }
    }

    const transform = makeDataTransformWithAverage(mapping, 'medium')

    const groups = transform(data)

    expect(groups[0].animation.getEndState()).toEqual({
      opacity: 0.5
    })

    expect(groups[1].animation.getEndState()).toEqual({
      opacity: 0.5
    })
  })

  it('adds the average point', () => {
    const data = [
      {
        ISO3: 'XXX',
        incidence: 55,
        mortality: 22,
        HDI: 'very high'
      },
      {
        ISO3: 'YYY',
        incidence: 44,
        mortality: 44,
        HDI: 'high'
      },
      {
        ISO3: 'ZZX',
        incidence: 22,
        mortality: 66,
        HDI: 'medium'
      },
      {
        ISO3: 'ZZY',
        incidence: 44,
        mortality: 44,
        HDI: 'medium'
      },
      {
        ISO3: 'ZZZ',
        incidence: 66,
        mortality: 22,
        HDI: "medium"
      },
    ]

    const mapping = {
      guid: "ISO3",
      x: "incidence",
      y: "mortality",
      groupBy: "HDI",
      groupColors: {
        'very high': '#4AA1C9',
        'high': '#459162',
        'medium': '#CF764D',
        'low': '#9F3B42'
      }
    }

    const transform = makeDataTransformWithAverage(mapping, 'medium')

    const groups = transform(data)

    expect(last(last(groups).shapes)).toEqual(expect.objectContaining({
      cx: 44,
      cy: 44,
    }))

  })

  it('adds lines connecting the average point', () => {
    const data = [
      {
        ISO3: 'XXX',
        incidence: 55,
        mortality: 22,
        HDI: 'very high'
      },
      {
        ISO3: 'YYY',
        incidence: 44,
        mortality: 44,
        HDI: 'high'
      },
      {
        ISO3: 'ZZX',
        incidence: 22,
        mortality: 66,
        HDI: 'medium'
      },
      {
        ISO3: 'ZZY',
        incidence: 44,
        mortality: 44,
        HDI: 'medium'
      },
      {
        ISO3: 'ZZZ',
        incidence: 66,
        mortality: 22,
        HDI: "medium"
      },
    ]

    const mapping = {
      guid: "ISO3",
      x: "incidence",
      y: "mortality",
      groupBy: "HDI",
      groupColors: {
        'very high': '#4AA1C9',
        'high': '#459162',
        'medium': '#CF764D',
        'low': '#9F3B42'
      }
    }

    const transform = makeDataTransformWithAverage(mapping, 'medium')

    const groups = transform(data)

    expect(last(groups).shapes).toEqual(expect.arrayContaining([
      expect.objectContaining({
        x1: 22,
        y1: 66,
        x2: 44,
        y2: 44
      }),
      expect.objectContaining({
        x1: 44,
        y1: 44,
        x2: 44,
        y2: 44
      }),
      expect.objectContaining({
        x1: 66,
        y1: 22,
        x2: 44,
        y2: 44
      })
    ]))
  })
})
