import React from 'react'
import { render, act } from '@testing-library/react'
import Offline from '../src/Offline'

describe('Offline', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false
    })
  })

  it('should render children when offline', () => {
    const { getByText } = render(
      <Offline>
        <h1>Hello World</h1>
      </Offline>
    )

    expect(getByText(/Hello World/)).toBeDefined()
  })

  it('should render children when offline and using a custom polling URL', () => {
    const { getByText } = render(
      <Offline polling={{ url: 'https://www.google.com/' }}>
        <h1>Hello World</h1>
      </Offline>
    )

    expect(getByText(/Hello World/)).toBeDefined()
  })

  it('should not render children when online', () => {
    Object.defineProperty(navigator, 'onLine', { value: true })

    const { queryByText } = render(
      <Offline>
        <h1>Hello World</h1>
      </Offline>
    )

    expect(queryByText(/Hello World/)).toBeNull()
  })

  it('should not render children when online and using a custom polling URL', () => {
    Object.defineProperty(navigator, 'onLine', { value: true })

    const { queryByText } = render(
      <Offline polling={{ url: 'https://www.google.com/' }}>
        <h1>Hello World</h1>
      </Offline>
    )

    expect(queryByText(/Hello World/)).toBeNull()
  })

  it('should not render children when going from offline to online', () => {
    window.addEventListener = jest.fn()
    const { queryByText } = render(
      <Offline>
        <h1>Hello World</h1>
      </Offline>
    )

    // get the listener with name "online" (param 0) and call the function (param 1)
    const onlineListener = (window.addEventListener as jest.Mock).mock.calls.find(call => call[0] === 'online')[1]

    act(() => {
      onlineListener()
    })
    expect(queryByText(/Hello World/)).toBeNull()
    ;(window.addEventListener as jest.Mock).mockReset()
  })

  it('should remove event listeners when unmounting', () => {
    window.removeEventListener = jest.fn()
    const { unmount } = render(
      <Offline>
        <h1>Hello World</h1>
      </Offline>
    )
    unmount()

    const listenerNames = (window.removeEventListener as jest.Mock).mock.calls.map(call => call[0])
    expect(listenerNames).toContain('online')
    expect(listenerNames).toContain('online')
    ;(window.removeEventListener as jest.Mock).mockReset()
  })
})
