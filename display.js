//CONSTANTES

const display = document.getElementById("display");
const zerar = document.getElementById("zerar");
const mudar = document.getElementById("mudar");
const porcentagem = document.getElementById("porcentagem");
const dividir = document.getElementById("dividir");
const numeros = document.querySelectorAll(".button");
const multiplicar = document.getElementById("multiplicar");
const subtrair = document.getElementById("subtrair");
const adicionar = document.getElementById("somar");
const igual = document.getElementById("igual");
const operators = document.querySelectorAll(".operator-orange");
const point = document.getElementById("point");
const zero = document.getElementById("zero");
const switchElement = document.getElementById("modeSwitch");
const titleElement = document.querySelector(".title");

switchElement.addEventListener("change", function () {
  if (this.checked) {
    titleElement.classList.add("active");
  } else {
    titleElement.classList.remove("active");
  }
});

//VARIAVEIS
let firstOperand = null;
let operator = null;
let awaitingSecondOperand = false;
let highlightTimeoutId;

//DISPLAY

function updateDisplayValue(value) {
  if (Number.isFinite(value) && Math.floor(value) !== value) {
    const decimalPlaces = Math.max(0, 10 - Math.floor(value).toString().length);
    display.textContent = value.toFixed(decimalPlaces);
  } else {
    display.textContent = value;
  }
  updateZerarButtonText();
}

// Botões numéricos
numeros.forEach((botao) => {
  botao.addEventListener("click", () => {
    const numValue = botao.textContent;
    const currentValue = display.textContent;

    if (currentValue === "0" || awaitingSecondOperand) {
      updateDisplayValue(numValue);
      awaitingSecondOperand = false;
      removeSelectedOperator();
    } else if (currentValue.length < 10) {
      updateDisplayValue(currentValue + numValue);
    }
  });
});

//NUMERO ZERO
zero.addEventListener("click", () => {
  const currentValue = display.textContent;

  if (currentValue !== "0") {
    updateDisplayValue(currentValue + "0");
  }
});

// VIRGULA

point.addEventListener("click", () => {
  const currentValue = display.textContent;

  if (!currentValue.includes(",")) {
    updateDisplayValue(currentValue + ",");
  }
});
// BOTÃO AC

zerar.addEventListener("click", () => {
  const currentValue = display.textContent;

  if (currentValue === "0") {
    zerar.textContent = "AC";
  } else {
    zerar.textContent = "C";
  }

  updateDisplayValue("0");
  firstOperand = null;
  operator = null;
  awaitingSecondOperand = false;
});

// Atualiza o texto do botão "zerar" automaticamente
function updateZerarButtonText() {
  const currentValue = display.textContent;
  if (currentValue === "0") {
    zerar.textContent = "AC";
  } else {
    zerar.textContent = "C";
  }
}

// Atualiza o texto do botão ao modificar o display

// BOTAO DE MUDAR O SINAL

mudar.addEventListener("click", () => {
  const currentValue = display.textContent;
  const signValue = parseFloat(currentValue) * -1;

  updateDisplayValue(signValue);
});

adicionar.addEventListener("click", () => {
  const currentValue = display.textContent;
  const secondOperand = parseFloat(currentValue);

  if (firstOperand === null) {
    firstOperand = parseFloat(currentValue);
  } else if (!awaitingSecondOperand) {
    const result = calculateResult(firstOperand, secondOperand, operator);
    updateDisplayValue(result);
    firstOperand = result;
  }

  removeSelectedOperator();
  operator = "+";
  awaitingSecondOperand = true;

  if (result.toString().length > 11) {
    updateDisplayValue("E");
  }
});

//SUBTRAÇÃO

subtrair.addEventListener("click", () => {
  const currentValue = display.textContent;
  const secondOperand = parseFloat(currentValue);

  if (firstOperand === null) {
    firstOperand = parseFloat(currentValue);
  } else {
    let result = 0;

    if (operator && !awaitingSecondOperand) {
      result = calculateResult(firstOperand, secondOperand, operator);
    } else {
      result = firstOperand - secondOperand;
    }

    if (awaitingSecondOperand && result === 0) {
      result = -parseFloat(currentValue);
    }

    updateDisplayValue(result);
    firstOperand = result;
  }

  removeSelectedOperator();
  operator = "-";
  awaitingSecondOperand = true;
});

//MULTIPLICAÇÃO
multiplicar.addEventListener("click", () => {
  const currentValue = display.textContent;
  const secondOperand = parseFloat(currentValue);

  if (firstOperand === null) {
    firstOperand = parseFloat(currentValue);
  } else if (!awaitingSecondOperand) {
    const result = calculateResult(firstOperand, secondOperand, operator);
    updateDisplayValue(result);
    firstOperand = result;
  }

  removeSelectedOperator(); // Remover a classe "selected" de todos os botões de operador

  operator = "*";
  awaitingSecondOperand = true;

  if (result.toString().length > 11) {
    updateDisplayValue("E");
  }
});
//DIVISÃO

dividir.addEventListener("click", () => {
  if (!awaitingSecondOperand) {
    const currentValue = display.textContent;
    const secondOperand = parseFloat(currentValue);

    if (firstOperand === null) {
      firstOperand = parseFloat(currentValue);
    } else {
      let result = 0;

      if (operator && !awaitingSecondOperand) {
        result = calculateResult(firstOperand, secondOperand, operator);
      } else {
        result = firstOperand / secondOperand;
      }
      if (result.toString().length > 11) {
        updateDisplayValue("E");
      }

      updateDisplayValue(result);
      firstOperand = result;
    }

    operator = "/";
    awaitingSecondOperand = true;
    removeSelectedOperator();
  }
});

//PORCENTAGEM

porcentagem.addEventListener("click", () => {
  const currentValue = display.textContent;
  const percentageValue = parseFloat(currentValue) / 100;

  updateDisplayValue(percentageValue);
  firstOperand = percentageValue;
  operator = "%";
  awaitingSecondOperand = true;
  removeSelectedOperator();
});

//IGUAL

igual.addEventListener("click", () => {
  const currentValue = display.textContent;
  const secondOperand = parseFloat(currentValue);
  let result;

  if (operator) {
    if (operator === "+") {
      result = firstOperand + secondOperand;
    } else if (operator === "-") {
      result = firstOperand - secondOperand;
    } else if (operator === "*") {
      result = firstOperand * secondOperand;
    } else if (operator === "/") {
      result = firstOperand / secondOperand;
    }

    if (result && result.toString().length > 11) {
      if (Number.isFinite(result)) {
        result = result.toPrecision(9);
      } else {
        result = result.toExponential(6);
      }
    }

    if (result && result.toString().length > 11) {
      updateDisplayValue(result.toExponential(6));
    } else {
      updateDisplayValue(result);
      firstOperand = result;
    }
  }
  removeSelectedOperator();
  igual.classList.add("igual-highlight");
  setTimeout(() => {
    igual.classList.remove("igual-highlight");
  }, 200);
});

function removeSelectedOperator() {
  operators.forEach((operator) => {
    operator.classList.remove("selected");
  });
}

operators.forEach((operator) => {
  operator.addEventListener("click", () => {
    if (operator.classList.contains("selected")) {
      operator.classList.remove("selected");
    } else {
      removeSelectedOperator();
      operator.classList.add("selected");
    }
  });
});

//FUNÇÃO DE SELECIONAR UM OPERADOR E ELE FICAR BRANCO
operators.forEach((operadorBtn) => {
  operadorBtn.addEventListener("click", () => {
    if (firstOperand !== null && awaitingSecondOperand) {
      calcularResultado();
    } else {
      firstOperand = parseFloat(display.textContent);
    }

    const clickedOperator = operadorBtn.textContent;

    if (operator === clickedOperator) {
      removeSelectedOperator();
      operator = null;
    } else {
      removeSelectedOperator();
      operadorBtn.classList.add("selected");
      operator = clickedOperator;
    }

    awaitingSecondOperand = true;
  });
});

// para fazer com que os operadores retornem um resultado sempre que eu tiver o primeiro numero com o segundo numero e quiser um terceiro
function calculateResult() {
  const currentValue = display.textContent;
  const secondOperand = parseFloat(currentValue);
  let result = 0;

  switch (operator) {
    case "+":
      result = firstOperand + secondOperand;
      break;
    case "-":
      result = firstOperand - secondOperand;
      break;
    case "*":
      result = firstOperand * secondOperand;
      break;
    case "/":
      result = firstOperand / secondOperand;
      break;
  }

  if (result && result.toString().length > 11) {
    if (Number.isFinite(result)) {
      result = result.toPrecision(9);
    } else {
      result = result.toExponential(6);
    }
  }

  return result;
}
