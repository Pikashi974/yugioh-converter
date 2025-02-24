// import logo from "./logo.svg";

import { useState } from "react";
import "./App.css";

function App() {
  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const gridStyle = {
    gridTemplateColumns: "auto auto auto auto",
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      document.querySelector("#nameInput").classList.remove("is-invalid");
      document.querySelector("textarea").classList.remove("is-invalid");
      if (name === "") {
        document.querySelector("#nameInput").classList.add("is-invalid");
      }
      if (answer === "") {
        document.querySelector("textarea").classList.add("is-invalid");
      }
      if (name !== "" && answer !== "") {
        await convertText(answer, name);
      }
    } catch (err) {
      setError(err);
      console.error(error);
      document.querySelector("#nameInput").classList.add("is-invalid");
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  function handleNameChange(e) {
    setName(e.target.value);
  }

  async function handlePreview(e) {
    e.preventDefault();
    try {
      await previewList(answer, name);
    } catch (error) {}
  }

  return (
    <div className="App">
      <form id="form" onSubmit={handleSubmit}>
        <div className="row">
          <label className="col-sm-2 col-form-label">Name:</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              onChange={handleNameChange}
              id="nameInput"
            ></input>
            <div className="invalid-feedback">
              Enter a name for your decklist
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <label className="col-sm-2 col-form-label">List:</label>
          <div className="col-sm-10">
            <textarea
              value={answer}
              onChange={handleTextareaChange}
              className="form-control"
            ></textarea>
            <div className="invalid-feedback">Error with that list</div>
          </div>
        </div>
        <br />
        <button type="button" className="btn btn-info" onClick={handlePreview}>
          Preview
        </button>
        <button type="submit" className="btn btn-success">
          Convert
        </button>
      </form>
      <div className="card m-5">
        <h3 className="card-header">Decklist</h3>
        <div className="card-body d-grid" style={gridStyle}></div>
        <div className="card-footer d-grid" style={gridStyle}></div>
      </div>
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
    cardName = cardName.replaceAll("’", "'").replaceAll("–", "-");
    // console.log(cardName);
    let cardResult = dataYGOPRODECK.find(
      (element) => element.name === cardName
    );
    // console.log(cardResult);

    return `${cardResult.id}\n`.repeat(numberCards);
  }
  return "";
}
async function previewList(filetext) {
  let infos = filetext.split("\n\n");
  infos = infos.map((element) => element.split("\n"));
  let main = infos[0]
    .map((element) => getID(element).split("\n"))
    .flat()
    .filter((element) => element !== "");
  let spell_traps = infos[1]
    .map((element) => getID(element).split("\n"))
    .flat()
    .filter((element) => element !== "");
  let extra = infos[2]
    .map((element) => getID(element).split("\n"))
    .flat()
    .filter((element) => element !== "");
  // console.log(main);
  document.querySelector(".card-body").innerHTML = `
  
  ${main
    .concat(spell_traps)
    .map(
      (id) =>
        `<img src="https://pikashi974.github.io/Tierlist/src/img/${id}.jpg" width="100%" height="100%" alt="${id}" title="${id}">`
    )
    .join("")}`;

  document.querySelector(".card-footer").innerHTML = `
    ${extra
      .map(
        (id) =>
          `<img src="https://pikashi974.github.io/Tierlist/src/img/${id}.jpg" width="100%" height="100%" alt="${id}" title="${id}">`
      )
      .join("")}`;
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
