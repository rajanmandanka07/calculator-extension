document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById("display");
  const historyList = document.getElementById("history-list");
  const clearHistoryBtn = document.getElementById("clear-history");
  const toggleHistoryBtn = document.getElementById("toggle-history");
  const historyContainer = document.getElementById("history-container");
  let currentInput = "";
  let operator = "";
  let firstOperand = "";
  let secondOperand = "";
  let resultDisplayed = false;

  // Load history from local storage
  loadHistory();

  function updateDisplay(value) {
    display.value = value;
  }

  function clearDisplay() {
    currentInput = "";
    operator = "";
    firstOperand = "";
    secondOperand = "";
    resultDisplayed = false;
    updateDisplay("");
  }

  function deleteLastCharacter() {
    if (resultDisplayed) {
      clearDisplay();
    } else {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput);
    }
  }

  function handleNumberInput(number) {
    if (resultDisplayed) {
      clearDisplay();
    }
    currentInput += number;
    updateDisplay(currentInput);
  }

  function handleOperatorInput(op) {
    if (resultDisplayed) {
      firstOperand = display.value;
      resultDisplayed = false;
    } else if (currentInput) {
      firstOperand = currentInput;
    }
    operator = op;
    currentInput = "";
  }

  function calculate() {
    if (!firstOperand || !operator || !currentInput) return;

    secondOperand = currentInput;
    let result;
    switch (operator) {
      case "+":
        result = parseFloat(firstOperand) + parseFloat(secondOperand);
        break;
      case "-":
        result = parseFloat(firstOperand) - parseFloat(secondOperand);
        break;
      case "×":
        result = parseFloat(firstOperand) * parseFloat(secondOperand);
        break;
      case "÷":
        if (parseFloat(secondOperand) === 0) {
          alert("Cannot divide by zero");
          clearDisplay();
          return;
        }
        result = parseFloat(firstOperand) / parseFloat(secondOperand);
        break;
      default:
        return;
    }
    updateDisplay(result.toString());
    addToHistory(`${firstOperand} ${operator} ${secondOperand} = ${result}`);
    saveHistory();
    resultDisplayed = true;
    currentInput = result.toString();
  }

  function addToHistory(entry) {
    const listItem = document.createElement("li");
    listItem.textContent = entry;
    historyList.appendChild(listItem);
  }

  function saveHistory() {
    const historyItems = [];
    historyList.querySelectorAll("li").forEach(item => {
      historyItems.push(item.textContent);
    });
    localStorage.setItem("calculatorHistory", JSON.stringify(historyItems));
  }

  function loadHistory() {
    const historyItems = JSON.parse(localStorage.getItem("calculatorHistory")) || [];
    historyItems.forEach(item => {
      addToHistory(item);
    });
  }

  function clearHistory() {
    historyList.innerHTML = "";
    localStorage.removeItem("calculatorHistory");
  }

  function handleKeyInput(event) {
    const key = event.key;

    if (!isNaN(key)) {
      handleNumberInput(key);
    } else if (key === ".") {
      if (!currentInput.includes(".")) {
        handleNumberInput(".");
      }
    } else if (key === "+" || key === "-" || key === "*" || key === "/") {
      handleOperatorInput(key === "*" ? "×" : key === "/" ? "÷" : key);
    } else if (key === "Enter") {
      calculate();
    } else if (key === "Backspace") {
      deleteLastCharacter();
    }
  }

  function toggleHistory() {
    if (historyContainer.style.display === "none" || !historyContainer.style.display) {
      historyContainer.style.display = "block";
    } else {
      historyContainer.style.display = "none";
    }
  }

  document.getElementById("clear").addEventListener("click", clearDisplay);
  document.getElementById("backspace").addEventListener("click", deleteLastCharacter);

  document.querySelectorAll(".btn-light").forEach(button => {
    button.addEventListener("click", function () {
      handleNumberInput(this.innerText);
    });
  });

  document.querySelectorAll(".btn-secondary").forEach(button => {
    button.addEventListener("click", function () {
      handleOperatorInput(this.innerText);
    });
  });

  document.getElementById("equals").addEventListener("click", calculate);

  document.getElementById("decimal").addEventListener("click", function () {
    if (!currentInput.includes(".")) {
      handleNumberInput(".");
    }
  });

  document.addEventListener("keydown", handleKeyInput);

  clearHistoryBtn.addEventListener("click", clearHistory);
  toggleHistoryBtn.addEventListener("click", toggleHistory);
});
