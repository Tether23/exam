import axios from "axios";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
function AddSpaceCraft() {
  const [speed, setSpeed] = useState();
  const [name, setName] = useState();
  const [mass, setMass] = useState();
  function handleSubmit() {
    const createdSpacecraft = { name, speed, mass };
    console.log(createdSpacecraft);
    axios
      .post("http://localhost:8080/spacecrafts", createdSpacecraft)
      .then((response) => {
        this.setState({ spacecraftId: response.data.id });
        console.log(response);
      });
  }

  return (
    <form>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

      <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
}

export default AddSpaceCraft;
