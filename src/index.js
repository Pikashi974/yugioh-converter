import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootswatch/dist/united/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Navbar className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Yu-Gi-Oh Converter</Navbar.Brand>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <NavDropdown title="Yu-Gi-Oh">
            <NavDropdown.Item href="./Tierlist">Tierlist</NavDropdown.Item>
            <NavDropdown.Item href="./Numbers-Evaille">
              Numbers Eveil
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      </Container>
    </Navbar>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
