import { decodeComponent } from "./decodeComponent.js";

// Element Ref.
const colEl = document.querySelector("#col");
const lineEl = document.querySelector("#line");
const resultEl = document.querySelector("#result");
const fileEl = document.querySelector("#file");
const errorEl = document.querySelector("#error");

let sourceMap;
let hasError = false;

const logError = (message) => {
  errorEl.innerText = message;
  hasError = true;
};

const removeError = () => {
  [(fileEl, colEl, lineEl)].forEach((el) => (el.value = el.defaultValue));
  hasError = false;
  errorEl.innerText = "";
};

[colEl, lineEl].forEach((el) => {
  el.addEventListener("input", () => {
    hasError && removeError();
  });
});

// Source Map Reader
document.getElementById("file").addEventListener("change", (event) => {
  hasError && removeError();
  const reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
  function onReaderLoad(event) {
    try {
      sourceMap = JSON.parse(event.target.result);
    } catch (error) {
      console.info(error);
      logError("Invalid json");
    }
  }
});

document.querySelector("button").addEventListener("click", () => {
  const col = colEl.value;
  const line = lineEl.value;
  if (!sourceMap) return logError("Please upload source map first");
  if (!col) return logError("Please provide the column number");
  if (!line) return logError("Please provide the line number");
  decodeComponent({ sourceMap, col, line })
    .then(({ fileName, coordinate, keyword }) => {
      console.log({ fileName, coordinate, keyword });
      const textarea = document.createElement("textarea");
      textarea.setAttribute("readonly", true);
      textarea.value = `Name: ${fileName} \ncoordinate: ${coordinate} \nkeyword: ${keyword}`;
      textarea.rows = 5;
      resultEl.appendChild(textarea);
    })
    .catch(({ error }) => {
      logError(error);
    });
});
