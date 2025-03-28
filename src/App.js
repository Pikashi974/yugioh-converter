// import logo from "./logo.svg";

import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const [data, setData] = useState(require("./data.json"));

  async function getData() {
    return await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php")
      .then((response) => response.json())
      .then((json) => {
        setData(json.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

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
        convertText(answer, name, data);
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
      await previewList(answer, data);
    } catch (error) {}
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="App">
      <form id="form" className="m-3" onSubmit={handleSubmit}>
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
        <div
          className="card-footer d-grid"
          style={gridStyle}
          id="footerExtra"
        ></div>
        <div
          className="card-footer d-grid"
          style={gridStyle}
          id="footerSide"
        ></div>
      </div>
    </div>
  );
}

function convertText(filetext, deckname, data) {
  //   let fileData = await fetch(filetext).then((res) => res.text());

  //   console.log(filetext);
  let infos = filetext.split("\n\n");
  infos = infos.map((element) => element.split("\n"));
  console.log(infos);
  //   console.log(infos);
  let cardOutput = `#created by Javascript\n#main\n${infos[0]
    .map((element) => getID(element, data))
    .join("")}\n#extra\n${
    infos.length > 1
      ? infos[1].map((element) => getID(element, data)).join("")
      : ""
  }\n!side\n${
    infos.length === 3
      ? infos[2].map((element) => getID(element, data)).join("")
      : ""
  }
`;
  saveData(cardOutput, deckname + ".ydk");
}

function getID(text, data) {
  // console.log(text);

  if (text.match(/([0-9]+) ([^\n]+)/)[0] != null) {
    // console.log(text.match(/([0-9]+) ([^\n]+)/)[0]);

    let numberCards = text.match(/([0-9]+) ([^\n]+)/)[1];
    // console.log(numberCards);
    let cardName = text.match(/([0-9]+) ([^\n]+)/)[2];
    cardName = cardName.replaceAll("’", "'").replaceAll("–", "-").trim();
    // console.log(cardName);
    let cardResult = data.find((element) => element.name === cardName);
    // console.log(cardResult);

    return `${cardResult === undefined ? cardName : cardResult.id}\n`.repeat(
      numberCards
    );
  }
  return "";
}
async function previewList(filetext, data) {
  let infos = filetext.split("\n\n");
  infos = infos.map((element) => element.split("\n"));
  let main =
    infos[0] === undefined
      ? []
      : infos[0]
          .map((element) => getID(element, data).split("\n"))
          .flat()
          .filter((element) => element !== "");
  let extra =
    infos[1] === undefined
      ? []
      : infos[1]
          .map((element) => getID(element, data).split("\n"))
          .flat()
          .filter((element) => element !== "");
  let side =
    infos[2] === undefined
      ? []
      : infos[2]
          .map((element) => getID(element, data).split("\n"))
          .flat()
          .filter((element) => element !== "");
  // console.log(main);
  document.querySelector(".card-body").innerHTML = `
  
  ${main
    .map(
      (id) =>
        `<img src="https://pikashi974.github.io/Tierlist/src/img/${id}.jpg" width="100%" height="100%" alt="${id}" title="${id}">`
    )
    .join("")}`;

  document.querySelector("#footerExtra").innerHTML = `
    ${extra
      .map(
        (id) =>
          `<img src="https://pikashi974.github.io/Tierlist/src/img/${id}.jpg" width="100%" height="100%" alt="${id}" title="${id}">`
      )
      .join("")}`;
  document.querySelector("#footerSide").innerHTML = `
    ${side
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
