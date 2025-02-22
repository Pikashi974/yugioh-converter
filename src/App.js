import logo from "./logo.svg";
import { useState } from "react";
import "./App.css";

function App() {
  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await convertText(answer, name);
    } catch (err) {
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  function handleNameChange(e) {
    setName(e.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Yu-Gi-Oh Converter</h1>
        <form id="form" onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" onChange={handleNameChange}></input>
          <br />
          <label>List:</label>
          <textarea
            value={answer}
            onChange={handleTextareaChange}
            className="form-control"
          ></textarea>
          <br />
          <button type="button" className="btn btn-success">
            Convertir
          </button>
        </form>
      </header>
    </div>
  );
}

async function convertText(filetext, deckname) {
  //   let fileData = await fetch(filetext).then((res) => res.text());

  //   console.log(filetext);
  let infos = filetext.split("\n\n");
  infos = infos.map((element) => element.split("\n"));
  //   console.log(infos);
  let cardOutput = `#created by Javascript
#main
${infos[0].map((element) => getID(element)).join("")}
${infos[1].map((element) => getID(element)).join("")}
#extra
${infos[2].map((element) => getID(element)).join("")}
!side
`;
  saveData(cardOutput, deckname + ".ydk");
}

function getID(text) {
  const dataYGOPRODECK = require("./data.json");
  if (text.match(/([0-9]+) ([^\n]+)/)[0] != null) {
    // console.log(text.match(/([0-9]+) ([^\n]+)/)[0]);

    let numberCards = text.match(/([0-9]+) ([^\n]+)/)[1];
    // console.log(numberCards);
    let cardName = text.match(/([0-9]+) ([^\n]+)/)[2];
    // console.log(cardName);
    let cardResult = dataYGOPRODECK.find(
      (element) => element.name === cardName
    );
    // console.log(cardResult);

    return `${cardResult.id}\n`.repeat(numberCards);
  }
  return "";
}
var saveData = (function () {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (data, fileName) {
    var blob = new Blob([data], { type: "octet/stream" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();

export default App;
