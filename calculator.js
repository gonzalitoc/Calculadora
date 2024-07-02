//https://mikemcl.github.io/big.js/#

;(function (fn) {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
})(renderView)

// lookup tables
const chars = {
  0: 'AC',
  1: 'C',
  2: '%',
  3: '/',
  4: '7',
  5: '8',
  6: '9',
  7: 'x',
  8: '4',
  9: '5',
  10: '6',
  11: '-',
  12: '1',
  13: '2',
  14: '3',
  15: '+',
  16: '0',
  17: '.',
  18: '+/-',
  19: '=',
}

const operators = ['+', '-', '/', 'x', '=', '%']

function renderView(event) {
  const body = document.querySelector('body')
  const form = document.createElement('form')
  const input = document.createElement('input')

  body.appendChild(form)
  form.appendChild(input)
  input.className = 'input'
  input.disabled = true
  input.value = '0'
  for (let i = 0; i < 20; i++) {
    const button = document.createElement('button')

    form.appendChild(button)

    button.type = 'button'

    button.className = 'button'

    button.textContent = chars[i]
  }

  form.addEventListener('click', function (e) {
    if ((e.target = 'BUTTON')) {
      const { textContent } = e.target
      if (operators.includes(textContent)) {
        if (textContent === '=') {
          const operator = e.currentTarget.dataset.operator

          const secondValue = e.currentTarget.dataset.equal === '=' ? e.currentTarget.dataset.value : input.value

          e.currentTarget.setAttribute('data-equal', e.target.textContent)

          if (e.currentTarget.dataset.operator && !e.currentTarget.dataset.value) {
            e.currentTarget.setAttribute('data-value', input.value)
          }

          if (operator === '+') {
            const number = new Big(Number(e.currentTarget.dataset.value))

            const suma = number.plus(Number(input.value))

            input.value = suma.e >= 15 ? suma.toExponential() : suma.toNumber()
          } else if (operator === '-') {
            const number = new Big(Number(e.currentTarget.dataset.value))

            const resta = number.minus(Number(input.value))

            input.value = resta.e >= 15 ? resta.toExponential() : resta.toNumber()
          } else if (operator === 'x') {
            const number = new Big(Number(e.currentTarget.dataset.value))

            const multiplicacion = number.times(Number(input.value))

            input.value = multiplicacion.e >= 15 ? multiplicacion.toExponential() : multiplicacion.toNumber()
          } else if (operator === '/') {
            const number = new Big(Number(e.currentTarget.dataset.value))

            const division = number.div(Number(input.value))

            input.value = division.e >= 15 ? division.toExponential() : division.toNumber()
          }

          e.currentTarget.setAttribute('data-value', secondValue)

          return
        } else if (textContent === '%') {
          const porcentaje = Number(input.value) / 100

          input.value = porcentaje

          return
        } else {
          e.currentTarget.setAttribute('data-operator', textContent)

          if (e.currentTarget.dataset.equal) {
            e.currentTarget.setAttribute('data-value', input.value)
          }

          return
        }
      }

      if (textContent === '.') {
        const punto = `${input.value}${textContent}`

        if (input.value.includes('.')) {
          return
        } else {
          input.value = punto

          return
        }
      }

      if (textContent === '+/-') {
        if (input.value === '0') {
          return
        } else {
          if (input.value.includes('-')) {
            return
          } else {
            input.value = '-' + `${input.value}`
          }
        }

        return
      }

      if (textContent === 'AC' || textContent === 'C') {
        input.value = '0'

        e.currentTarget.removeAttribute('data-operator')
        e.currentTarget.removeAttribute('data-value')

        return
      }

      if (e.currentTarget.dataset.equal === '=') {
        input.valPue = textContent

        e.currentTarget.removeAttribute('data-equal')

        return
      }

      let value = Number(`${input.value}${textContent}`)

      const isResult = Boolean(e.currentTarget.dataset.operator)

      if (isResult) {
        const isEmptyPreviousValue = !e.currentTarget.dataset.value

        e.currentTarget.setAttribute('data-value', input.value)

        value = isEmptyPreviousValue ? e.target.textContent : value
      }

      input.value = value
    }
  })
}
