import React from 'react'
import PropTypes from 'prop-types'

export class AnimationGroup extends React.Component {
  constructor(props) {
    super(props)

    this.state = props.animation
      ? props.animation.getInitialState()
      : this.getInitialState()
  }

  getInitialState() {
    return {
      opacity: 1
    }
  }

  scheduleAnimation(animation) {
    const animationTimeout = setTimeout(() => {
      this.setState(animation.getEndState())
    }, 10)

    this.cancelAnimation = () => {
      clearTimeout(animationTimeout)
    }
  }

  scheduleAnimationReset() {
    const animationTimeout = setTimeout(() => {
      this.setState(this.getInitialState())
    }, 10)

    this.cancelAnimation = () => {
      clearTimeout(animationTimeout)
    }
  }

  componentWillUnmount() {
    this.cancelAnimation && this.cancelAnimation()
  }

  render() {
    this.props.animation
      ? this.scheduleAnimation(this.props.animation)
      : this.scheduleAnimationReset()

    return <g
      style={{
        opacity: this.state.opacity,
        transition: 'opacity 1s'
      }}
    >
      {this.props.children}
    </g>
  }
}

AnimationGroup.propTypes = {
  children: PropTypes.node,
  animation: PropTypes.object
}

export const fadeAnimation = (startOpacity, endOpacity) => {
  return {
    getInitialState() {
      return {
        opacity: startOpacity
      }
    },
    getEndState() {
      return {
        opacity: endOpacity
      }
    }
  }
}

