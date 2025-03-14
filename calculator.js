(function (fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
})(renderView);

const chars = [
  "AC", "C", "%", "/", "7", "8", "9", "x",
  "4", "5", "6", "-", "1", "2", "3", "+",
  "0", ".", "+/-", "="
];

const operators = new Set(["+", "-", "/", "x", "=", "%"]);

function renderView() {
  const body = document.body;
  const form = document.createElement("form");
  const input = document.createElement("input");

  input.className = "input";
  input.disabled = true;
  input.value = "0";

  form.appendChild(input);
  chars.forEach(char => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button";
    button.textContent = char;
    form.appendChild(button);
  });
  
  body.appendChild(form);

  form.addEventListener("click", function (e) {
    if (e.target.tagName !== "BUTTON") return;

    const text = e.target.textContent;
    let { operator, value } = form.dataset;

    if (operators.has(text)) {
      if (text === "=") {
        if (operator && value) {
          let expression = value + operator.replace("x", "*") + input.value;
          try {
            let result = new Big(eval(expression));
            input.value = result.e >= 15 ? result.toExponential() : result.toString();
            delete form.dataset.operator;
            delete form.dataset.value;
          } catch (error) {
            input.value = "Error";
          }
        }
      } else if (text === "%") {
        input.value = new Big(input.value).div(100).toString();
      } else {
        if (operator) {
          form.dataset.value = value + operator.replace("x", "*") + input.value;
        } else {
          form.dataset.value = input.value;
        }
        form.dataset.operator = text;
        input.value = "";
      }
      return;
    }

    if (text === "." && !input.value.includes(".")) {
      input.value += text;
      return;
    }

    if (text === "+/-") {
      input.value = input.value.startsWith("-") ? input.value.slice(1) : "-" + input.value;
      return;
    }

    if (text === "AC" || text === "C") {
      input.value = "0";
      delete form.dataset.operator;
      delete form.dataset.value;
      return;
    }

    input.value = input.value === "0" ? text : input.value + text;
  });
}
