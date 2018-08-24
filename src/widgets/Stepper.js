import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import './Stepper.css'

export const wrap = (index, max) => index > max ? 0 : index < 0 ? max : index

export const goBack = (max) => (index) => wrap(index - 1, max)
export const goForward = (max) => (index) => wrap(index + 1, max)
export const goTo = (index) => () => index

class Stepper extends Component {
  getKey(step) {
    return step.data
  }

  renderButton(key, children, isCurrentStep, getStepIndexAfterPush) {
    return <div
      className={cx('Stepper_item', {
        Stepper_item__selected: isCurrentStep
      })}
      key={key}
      onClick={() => {
        this.props.onStep(getStepIndexAfterPush(this.props.stepIndex))
      }}
    >{children}</div>
  }

  render() {
    const { steps } = this.props

    if(steps.length === 0) {
      console.warn("`steps` prop is an empty array") /* eslint-disable-line no-console */
      return null
    }

    return <div className="Stepper">
      {
        this.renderButton(
          'back',
          <span className='Arrow'>‹</span>,
          false,
          goBack(steps.length - 1)
        )
      }
      {
        steps.map((step, index) => {
          return this.renderButton(
            this.getKey(step),
            index + 1,
            index === this.props.stepIndex,
            goTo(index))
        })
      }
      {
        this.renderButton(
          'forward',
          <React.Fragment>
            next
            <span className='Arrow'>&nbsp;›</span>
          </React.Fragment>,
          false,
          goForward(steps.length - 1)
        )
      }
    </div>
  }
}

export const shapes = {
  stepIndex: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  onStep: PropTypes.func
}

Stepper.propTypes = shapes
Stepper.defaultProps = {
  onStep: () => {}
}

export default Stepper
