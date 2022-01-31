import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import axios from "axios";
function Spacecraft(props) {
  const [showModal, setShowModal] = useState(false);
  const [speed, setSpeed] = useState(props.speed);
  const [name, setName] = useState(props.name);
  const [mass, setMass] = useState(props.mass);
  function toggleModal() {
    setShowModal(!showModal);
  }
  function deleteHandler() {
    props.handleDelete(props.id);
  }
  function handleSubmit() {
    console.log(props.id);
    console.log(name);
    console.log(mass);
    console.log(speed);

    props.handleUpdate(props.id, { name, speed, mass });
  }
  function getAstronauts() {
    var astronauts = [];
    // useEffect(() => {
    // axios
    //   .get("http://localhost:8080/spacecrafts/" + props.id + "/astronauts")
    //   .then((response) => {
    //     astronauts = response.data;
    //     console.log(astronauts);
    //   });
    // }, []);
    axios
      .get("http://localhost:8080/spacecrafts/" + props.id)
      .then((response) => {
        astronauts = response.data.astronauts;
        console.log(response.data.astronauts);
      });
  }
  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div onClick={getAstronauts}>
            <h5 className="card-title">{props.spacecraftName}</h5>
          </div>

          <a className="btn btn-danger" onClick={deleteHandler}>
            Delete
          </a>
          <a className="btn btn-primary" type="button" onClick={toggleModal}>
            Update
          </a>
        </div>
      </div>
      {showModal ? (
        <form>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              defaultValue={props.name}
            />
            <p>{name}</p>
          </div>
          <div className="form-group">
            <label>Speed</label>
            <input
              type="number"
              className="form-control"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Mass</label>
            <input
              type="number"
              className="form-control"
              value={mass}
              onChange={(e) => setMass(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      ) : null}
    </div>
  );
}

export default Spacecraft;
