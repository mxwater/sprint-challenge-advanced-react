import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppFunctional from './AppFunctional';
import server from '../../backend/mock-server'

const waitForOptions = { timeout: 100 }
const queryOptions = { exact: false }

let initalSquare, squares, coordinates, steps, message, email, button

const updateStatefulSelectors = document => {
  squares = document.querySelectorAll('.square')
  coordinates = document.querySelector('#coordinates')
  steps = document.querySelector('#steps')
  message = document.querySelector('#message')
  email = document.querySelector('#email')
  button = document.querySelector('#submit')
  initalSquare = document.querySelector('.active')
}

[AppFunctional, /* AppClass */].forEach((Component, idx) => {
  const label = idx === 0 ? 'FUNCTIONAL' : 'CLASS-BASED'

  describe('all tests', () => {
    beforeAll(() => { server.listen() })
    afterAll(() => { server.close() })
    beforeEach(() => {
      render(<Component />)
      updateStatefulSelectors(document)
    })
    afterEach(() => {
      server.resetHandlers()
      document.body.innerHTML = ''
    })

    describe('AppFunctional Component', () => {
      test('renders initial state correctly', () => {
        render(<AppFunctional />);
      })

      test('coordinates message is displayed correctly on first render', () => {
        expect(coordinates.textContent).toBe('Coordinates (2, 2)')
      })

      test('email state updates after input', async () => {
        fireEvent.change(email, {target:{value:'user@example.com'}})
        expect(email.value).toBe('user@example.com')
      })

      test('submit button text is rendering correctly', ()=>{
        expect(button.value).toBe('Submit')
      })

      test('Steps message is displayed correctly on first render', () => {
        expect(steps.textContent).toBe('You moved 0 times')
      })

      test('center square text content is B', ()=> {
        expect(initalSquare.textContent).toBe('B')
      })



    })
  })
})


