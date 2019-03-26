const express = require("express");
const helmet = require("helmet");

const server = express();

const knex = require("knex");

const knexConfigZoos = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  debug: true
};

const knexConfigBears = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/bears.db3"
  },
  debug: true
};

const db = knex(knexConfigZoos);
const bdb = knex(knexConfigBears);

server.use(express.json());
server.use(helmet());

// endpoints here

server.get("/zoos", async (req, res) => {
  try {
    const zoos = await db("zoos");
    console.log(zoos);
    res.status(200).json(zoos);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

server.get("/zoos/:id", async (req, res) => {
  const zooId = req.params.id;
  try {
    const zoo = await db("zoos")
      .where({ id: zooId })
      .first();
    if (zoo) {
      console.log(zoo);
      res.status(200).json(zoo);
    } else {
      res.status(404).json({ message: "zoo with that id not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

server.post("/zoos", async (req, res) => {
  if (req.body.name) {
    try {
      const ids = await db("zoos").insert(req.body);
      console.log(ids);
      const zooId = ids[0];
      try {
        const zoo = await db("zoos")
          .where({ id: zooId })
          .first();
        if (zoo) {
          res.status(201).json(zoo);
        } else {
          res.status(404).json({ message: "zoo with that id not found" });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res.status(403).json({ message: "please fill out required fields" });
  }
});

server.put("/zoos/:id", async (req, res) => {
  const zooId = req.params.id;
  if (req.body.name) {
    try {
      const count = await db("zoos")
        .where({ id: zooId })
        .update(req.body);
      if (count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "zoo not found" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json({ message: "please fill out required fields" });
  }
});

server.delete("/zoos/:id", async (req, res) => {
  const zooId = req.params.id;
  try {
    const count = await db("zoos")
      .where({ id: zooId })
      .del();
    if (count) {
      res.status(201).end();
    } else {
      res.status(404).json({ message: "zoo not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// bear endpoints

server.get("/bears", async (req, res) => {
  try {
    const bears = await bdb("bears");
    console.log(bears);
    res.status(200).json(bears);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

server.get("/bears/:id", async (req, res) => {
  const bearId = req.params.id;
  try {
    const bear = await bdb("bears")
      .where({ id: bearId })
      .first();
    if (bear) {
      console.log(bear);
      res.status(200).json(bear);
    } else {
      res.status(404).json({ message: "bear with that id not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

server.post("/bears", async (req, res) => {
  if (req.body.name) {
    try {
      const ids = await bdb("bears").insert(req.body);
      console.log(ids);
      const bearId = ids[0];
      try {
        const bear = await bdb("bears")
          .where({ id: bearId })
          .first();
        if (bear) {
          res.status(201).json(bear);
        } else {
          res.status(404).json({ message: "bear with that id not found" });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res.status(403).json({ message: "please fill out required fields" });
  }
});

server.put("/bears/:id", async (req, res) => {
  const bearId = req.params.id;
  if (req.body.name) {
    try {
      const count = await bdb("bears")
        .where({ id: bearId })
        .update(req.body);
      if (count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "bear not found" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json({ message: "please fill out required fields" });
  }
});

server.delete("/bears/:id", async (req, res) => {
  const bearId = req.params.id;
  try {
    const count = await bdb("bears")
      .where({ id: bearId })
      .del();
    if (count) {
      res.status(201).end();
    } else {
      res.status(404).json({ message: "bear not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
