const express = require("express");
const app = express();
const port = 8080;

const sequelize = require("./sequelize");

const Spacecraft = require("./models/Spacecraft");
const Astronaut = require("./models/Astronaut");
const {Op} = require("sequelize");
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
Spacecraft.hasMany(Astronaut);

app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json());

  app.listen(port, () => {
    console.log("server running on port:" + port);
  });

  app.use((err, req, res, next) => {
    console.error("[ERROR]:" + err);
    res.status(500).json({ message: "500 - Server Error" });
  });

  //create database
  app.get("/init", async (req, res, next) => {
    try {
      await sequelize.sync({ force: true });
      res.status(201).json({ message: "Database created with the models." });
    } catch (err) {
      next(err);
    }
  });


  // SPACE CRAFT

  //get all spacecrafts
  app.get("/spacecrafts",async (req,res)=>{
    try {
        const pageAsNumber= Number.parseInt(req.query.page);
        const sizeAsNumber=Number.parseInt(req.query.size);
        const name=req.query.name;
        const mass=req.query.mass;
        let page=0;
        if(!Number.isNaN(pageAsNumber)&& pageAsNumber>0){
            page=pageAsNumber;
        }
        let size =10;
        if(!Number.isNaN(sizeAsNumber)&& sizeAsNumber>0 && sizeAsNumber<10){
            size=sizeAsNumber;
        }

        const spacecraft= await Spacecraft.findAll({
            where: name ? { name: { [Op.like]: name }}:undefined || mass?{mass: {[Op.gt]:mass}}:undefined ,
            order: [
                ['id','ASC']
            ],
            limit:size,
            offset: page*size
        });
        res.status(200).json(spacecraft);

    } catch (err) {
        console.error(err.message);
        
    }
});


  //create new spacecraft
  app.post("/spacecraft", async (req, res, next) => {
    try {
      await Spacecraft.create(req.body);
      res.status(201).json({ message: "Spacecraft Created!" });
    } catch (err) {
      next(err);
    }
  });

   // retrieve a certain spacecraft based on it's ID 
app.get("/spacecrafts/:spacecraftId", async (req, res) => {
    try {
      const spacecraft = await Spacecraft.findByPk(req.params.spacecraftId, {
        include:Astronaut,
      });
      if (spacecraft) {
        res.status(200).json(spacecraft);
      } else {
        res.status(404).json({ message: "not found" });
      }
    } catch (err) {
      console.warn(err);
      res.status(500).json({ message: "error" });
    }
  });

  //update a certain  spacecraft
app.put("/spacecrafts/:spacecraftId", async (req, res) => {
    console.log("TEstin");
    try {
      const spacecraft = await Spacecraft.findByPk(req.params.spacecraftId);
      if (spacecraft) {
        await spacecraft.update(req.body, {
          fields: ["name", "speed","mass"],
        });
        res.status(202).json({ message: "ok" });
      } else {
        res.status(404).json({ message: "not found" });
      }
    } catch (err) {
      console.warn(err);
      res.status(500).json({ message: "error" });
    }
  });


  //delete spacecraft
  app.delete("/spacecrafts/delete/:spacecraftId", async (req, res) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.spacecraftId);
      if (spacecraft) {
        await spacecraft.destroy();
        res.status(202).json({ message: "ok" });
      } else {
        res.status(404).json({ message: "not found" });
      }
    } catch (err) {
      console.warn(err);
      res.status(500).json({ message: "error" });
    }
  });

//ASTRONAUTS

  //get all astronauts
  app.get("/astronauts", async (req, res, next) => {
    try {
      const astronauts = await Astronaut.findAll();
      res.status(200).json(astronauts);
    } catch (err) {
      next(err);
    }
  });

  //get a specific astronaut from a spacecraft
  app.get("/spacecrafts/:spacecraftID/astronauts", async (req, res, next) => {
    try {
      const spacecraft = await Spacecraft.findByPk(req.params.spacecraftId, {
        include: [Astronaut],
      });
      if (spacecraft) {
        res.status(200).json(spacecraft.astronauts);
      } else {
        res.status(404).json({ message: "No such spacecraft" });
      }
    } catch (err) {
      next(err);
    }
  });

//allocate new astronaut to spacecraft
app.post("/spacecrafts/:spacecraftId/astronauts", async (req, res, next) => {
    try {
      const spacecraft = await Spacecraft.findByPk(req.params.spacecraftId);
      if (spacecraft) {
          console.log(spacecraft);
          console.log(req.body);
        const astronaut = new Astronaut(req.body);
        astronaut.spacecraftId = spacecraft.id;
        await astronaut.save();
        res.status(201).json({ message: "Astronaut added" });
      } else {
        res.status(404).json({ message: "No such ship" });
      }
    } catch (err) {
      next(err);
    }
  });


  // edit existing astronaut from a spacecraft

  app.put("/spacecrafts/:spacecraftId/astronauts/:astronautId", async (req, res) => {
    try {
      // find the book that has the id specified in the path
      const spacecraft = await Spacecraft.findByPk(req.params.spacecraftId);
  
      if (spacecraft) {
        const astronauts = await spacecraft.getAstronauts({
          where: {
            id: req.params.astronautId,
          },
        });
        const astronaut = astronauts.shift();
  
        if (astronaut) {
          await astronaut.update(req.body);
          res.status(200).json({ message: "accepted" });
        } else {
          res.status(404).json({ message: "astrononaut not found" });
        }
      } else {
        res.status(404).json({ message: "spacecraft not found" });
      }
    } catch (err) {
      console.warn(err);
      res.status(500).json({ message: "error" });
    }
  });

  // remove a certain astronaut from a spacecraft
  app.delete("/spacecrafts/:spacecraftId/astronauts/:astronautId", async (req, res) => {
    try {
      const spacecraft = await Spacecraft.findByPk(req.params.spacecraftId);
  
      if (spacecraft) {
        const astronauts = await spacecraft.getAstronauts({
          where: {
            id: req.params.astronautId,
          },
        });
        const astronaut = astronauts.shift();
  
        if (astronaut) {
          await astronaut.destroy();
          res.status(200).json({ message: "OK" });
        } else {
          res.status(404).json({ message: "astronaut not found" });
        }
      } else {
        res.status(404).json({ message: "spacecraft not found" });
      }
    } catch (err) {
      console.warn(err);
      res.status(500).json({ message: "error" });
    }
  });

 

