class StackFiFo {
  constructor() {
    this._array = [];
  }

  push = (data) => {
    this._array.push(data)
  }

  pop = () => {
    return this._array.pop()
  }

  get data() {
    return Object.freeze([...this._array]);
  }
}


class StackLiFo {
  constructor() {
    this._array = [];
  }

  push = (data) => {
    this._array.push(data)
  }

  unshift = () => {
    return this._array.unshift()
  }

  get data() {
    return Object.freeze([...this._array]);
  }
}

const brackets = [
  ['(', ')'],
  ['{', '}'],
  ['[', ']'],
  ['<', '>'],
]

jQuery(document).ready(function ($) {
  $('[name="content"]').on('keyup', function () {
    const val = $(this).val();
    const openBrackets = new StackFiFo();
    let line = 1;
    let col = 0;
    let message = '';
    let error = val.split('').some((s) => {
      if (brackets.some(b => b[0] === s)) {
        openBrackets.push(s);
      } else if (brackets.some(b => b[1] === s)) {
        const lastBracket = openBrackets.pop();
        const closeIndex = brackets.findIndex(b => b[1] === s)
        const openIndex = brackets.findIndex(b => b[0] === lastBracket)
        if (closeIndex !== openIndex) {
          message = `Unexpected clos for ${lastBracket}, expected ${brackets[openIndex][1]}`
          return true;
        }
      } else if (/[\n\r]/.test(s)) {
        col = 0;
        line += 1;
      }
      col += 1;
      return false;
    })

    if (openBrackets.data.length) {
      error = true;
      const lastBracket = openBrackets.pop();
      const openIndex = brackets.findIndex(b => b[0] === lastBracket)
      message = `Unexpected clos for ${lastBracket}, expected ${brackets[openIndex][1]}`
    }
    if (error) {
      console.log({ line, col, message })
    }
  });
});



