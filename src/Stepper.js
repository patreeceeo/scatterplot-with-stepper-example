import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Stepper.css'

export const wrap = (index, max) => index > max ? 0 : index < 0 ? max : index

export const goBack = (max) => (index) => wrap(index - 1, max)
export const goForward = (max) => (index) => wrap(index + 1, max)
export const goTo = (index) => () => index

class Stepper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stepIndex: 0
    }
  }

  getKey(step) {
    return step.data
  }

  renderButton(key, children, getStepIndexAfterPush) {
    return <div
      key={key}
      onClick={() => {
        this.setState(({stepIndex}) => ({
          stepIndex: getStepIndexAfterPush(stepIndex)
        }), () => {
          this.props.onStep(this.state.stepIndex)
        })
      }}
    >{children}</div>
  }

  render() {
    const { steps } = this.props

    return <div className="Stepper">
      {this.renderButton('back', '<', goBack(steps.length - 1))}
      {
        steps.map((step, index) => {
          return this.renderButton(this.getKey(step), index + 1, goTo(index))
        })
      }
      {this.renderButton('forward', '>', goForward(steps.length - 1))}
    </div>
  }
}

export const shapes = {
  steps: PropTypes.array,
  onStep: PropTypes.func
}

Stepper.propTypes = shapes

export default Stepper
