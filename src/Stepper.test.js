import {
  wrap,
  goBack,
  goTo,
  goForward
} from './Stepper.js'

describe('wrap', () => {
  it('wraps from lower to upper (inclusive)', () => {
    expect(wrap(-1, 100)).toBe(100)
  })

  it('wraps from upper to lower (inclusive)', () => {
    expect(wrap(101, 100)).toBe(0)
  })
})

describe('goBack', () => {
  it('returns function which returns previous index', () => {
    expect(goBack(100)(43)).toBe(42)
  })

  it('wraps', () => {
    expect(goBack(100)(0)).toBe(100)
  })
})

describe('goForward', () => {
  it('returns function which returns next index', () => {
    expect(goForward(100)(43)).toBe(44)
  })

  it('wraps', () => {
    expect(goForward(100)(100)).toBe(0)
  })
})

describe('goTo', () => {
  it('returns function which returns fixed index', () => {
    expect(goTo(43)()).toBe(43)
  })
})
