import React, { Component, useState, useEffect } from "react";
import "./App.css";
import { Route, Switch, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ItemList from "./components/AddSpaceCraft";
import axios from "axios";
import Spacecraft from "./components/Spacecraft";
import AddSpaceCraft from "./components/AddSpaceCraft";

function App() {
  const [spacecrafts, setSpacecrafts] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8080/spacecrafts").then((response) => {
      setSpacecrafts(response.data);
    });
  }, []);

  function deleteSpacecraft(spacecraftId) {
    axios
      .delete("http://localhost:8080/spacecrafts/delete/" + spacecraftId)
      .then((response) => {
        console.log(response);
        const newSpacecrafts = spacecrafts.filter((e) => e.id !== spacecraftId);
        setSpacecrafts(newSpacecrafts);
      })
      .catch((error) => {
        throw error;
      });
  }
  function updateSpacecraft(spacecraftId, updatedSpacecraft) {
    console.log(spacecraftId);
    console.log(updateSpacecraft);
    axios
      .put(
        "http://localhost:8080/spacecrafts/" + spacecraftId,
        updatedSpacecraft
      )
      .then((response) => {
        const spacecraftIndex = spacecrafts.findIndex(
          (e) => e.id === spacecraftId
        );
        const newSpacecrafts = spacecrafts;
        newSpacecrafts[spacecraftIndex] = { ...updatedSpacecraft };
        setSpacecrafts(newSpacecrafts);
      });
  }
  return (
    <Switch>
      <Route path="/" exact>
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <a href="/tutorials" className="navbar-brand">
              Exam
            </a>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/add"} className="nav-link">
                  Add
                </Link>
              </li>
            </div>
          </nav>
          {spacecrafts.map((spacecraft) => (
            <Spacecraft
              handleDelete={deleteSpacecraft}
              handleUpdate={updateSpacecraft}
              spacecraftName={spacecraft.name}
              id={spacecraft.id}
              key={spacecraft.id}
            />
          ))}
        </div>
      </Route>
      <Route path="/add">
        <AddSpaceCraft />
      </Route>
    </Switch>
  );
}

export default App;
