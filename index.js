const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb")
const express = require("express");
const serverless = require("serverless-http");


const app = express();

const USERS_TABLE = "userTable"
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());
//get specific user
app.get("/users/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: parseInt(req.params.userId),
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});
//insert user in DB
app.post("/users", async function (req, res) {
  const { userId, name } = req.body;
  if (!Number.isInteger(userId)) {
    res.status(400).json({ error: '"userId" must be a Integer' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
    },
  };

  try {
    await dynamoDbClient.send(new PutCommand(params));
    res.json({ userId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});
//delete a user

app.delete("/delete/:userId", async function (req, res) { // Change the method to app.delete
    const params = {
      TableName: USERS_TABLE,
      Key: {
        userId: parseInt(req.params.userId),
      },
    };
  
    try {
      await dynamoDbClient.send(new DeleteCommand(params)); // Use DeleteCommand to delete the item
      res.status(204).send(); // Respond with status 204 indicating success with no content
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not delete user" });
    }
});

//update name of user
app.put("/update/:userId", async function (req, res) { // Change the method to app.put for update
    const params = {
      TableName: USERS_TABLE,
      Key: {
        userId: parseInt(req.params.userId),
      },
      UpdateExpression: "set #name = :name", // Define the update expression
      ExpressionAttributeNames: {
        "#name": "name" // Define the attribute name placeholder
      },
      ExpressionAttributeValues: {
        ":name": req.body.name // Get the updated name from the request body
      },
      ReturnValues: "ALL_NEW" // Specify that you want to get the updated item
    };
  
    try {
      const { Attributes } = await dynamoDbClient.send(new UpdateCommand(params)); // Use UpdateCommand to update the item
      res.json(Attributes); // Respond with the updated item attributes
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not update user" });
    }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});



module.exports.handler = serverless(app);