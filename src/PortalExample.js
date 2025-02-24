import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Modal";

export default function PortalButton() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button className="btn btn-outline-light" onClick={handleShow}>
        Help ?
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>How to use?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ol>
            <li>Add a name to your decklist</li>
            <li>
              Copy-paste or write your list of cards, with how many just behind
              (you will need to type the correct name for each) Example :
              <dd>3 Rite of Aramesir</dd>
              <dd>2 Nibiru, the Primal Being</dd>
            </li>
            <li>
              Separate the Main Deck, Extra Deck and Side Deck with 2 Spacing
            </li>
            <li>
              Use the
              <button type="button" className="btn btn-info">
                Preview
              </button>
              button to show your decklist and confirm no error has been shown
            </li>
            <li>If the list seems correct to you, you can download the YDK</li>
          </ol>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
