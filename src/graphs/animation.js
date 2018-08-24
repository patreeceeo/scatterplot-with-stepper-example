import React from 'react'
import PropTypes from 'prop-types'

export function syncStateChange ({start, end, delay = 10}) {
  let components = []
  let timeoutIds = []
  return (() => {

    return function enqueStateChange (component) {
      components = [...components, component]
      timeoutIds = [...timeoutIds, setTimeout(() => {
        components.forEach((c) => {
          c.setState(end(c.props))
        })
      }, delay)]

      component.setState(start(component.props))

      return () => {
        timeoutIds.forEach(clearTimeout)
      }
    }
  })()
}

export class SyncAnim extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.cancel = this.props.sync(this)
  }

  componentWillUnmount() {
    this.cancel()
  }

  render() {
    const {children, sync} = this.props

    void sync

    return React.cloneElement(
      React.Children.only(children),
      {
        style: {
          opacity: this.state.opacity,
          transition: 'opacity 1s'
        }
      }
    )
  }
}

SyncAnim.propTypes = {
  children: PropTypes.node,
  sync: PropTypes.func
}
