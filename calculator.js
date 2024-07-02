//https://mikemcl.github.io/big.js/#

(function (fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
})(renderView);

// lookup tables
const chars = {
  0: "AC",
  1: "C",
  2: "%",
  3: "/",
  4: "7",
  5: "8",
  6: "9",
  7: "x",
  8: "4",
  9: "5",
  10: "6",
  11: "-",
  12: "1",
  13: "2",
  14: "3",
  15: "+",
  16: "0",
  17: ".",
  18: "+/-",
  19: "=",
};

const operators = ["+", "-", "/", "x", "=", "%"];

function renderView(event) {
  const body = document.querySelector("body");
  const form = document.createElement("form");
  const input = document.createElement("input");

  body.appendChild(form);
  form.appendChild(input);
  input.className = "input";
  input.disabled = true;
  input.value = "0";
  for (let i = 0; i < 20; i++) {
    const button = document.createElement("button");

    form.appendChild(button);

    button.type = "button";

    button.className = "button";

    button.textContent = chars[i];
  }

  form.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      const { textContent } = e.target;

      if (operators.includes(textContent)) {
        if (textContent === "=") {
          const operator = e.currentTarget.dataset.operator;
          const secondValue = e.currentTarget.dataset.value;
          const currentValue = input.value;

          if (operator && secondValue !== undefined) {
            const number = new Big(Number(secondValue));
            let result;

            if (operator === "+") {
              result = number.plus(Number(currentValue));
            } else if (operator === "-") {
              result = number.minus(Number(currentValue));
            } else if (operator === "x") {
              result = number.times(Number(currentValue));
            } else if (operator === "/") {
              result = number.div(Number(currentValue));
            }

            input.value =
              result.e >= 15 ? result.toExponential() : result.toNumber();
            e.currentTarget.removeAttribute("data-operator");
            e.currentTarget.removeAttribute("data-value");
          }

          e.currentTarget.removeAttribute("data-equal");

          return;
        } else if (textContent === "%") {
          const porcentaje = Number(input.value) / 100;
          input.value = porcentaje;
          return;
        } else {
          e.currentTarget.setAttribute("data-operator", textContent);
          e.currentTarget.setAttribute("data-value", input.value);
          input.value = "";
          return;
        }
      }

      if (textContent === ".") {
        if (!input.value.includes(".")) {
          input.value += textContent;
        }
        return;
      }

      if (textContent === "+/-") {
        if (input.value !== "0") {
          input.value = input.value.startsWith("-")
            ? input.value.slice(1)
            : `-${input.value}`;
        }
        return;
      }

      if (textContent === "AC" || textContent === "C") {
        input.value = "0";
        e.currentTarget.removeAttribute("data-operator");
        e.currentTarget.removeAttribute("data-value");
        e.currentTarget.removeAttribute("data-equal");
        return;
      }

      if (e.currentTarget.dataset.equal === "=") {
        input.value = textContent;
        e.currentTarget.removeAttribute("data-equal");
      } else {
        input.value =
          input.value === "0" ? textContent : input.value + textContent;
      }
    }
  });
}
