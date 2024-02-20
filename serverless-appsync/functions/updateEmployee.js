const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamodbClient = new DynamoDBClient();

module.exports.handler = async (event) => {
    try {
        const id = parseInt(event.payload.arguments.id);
        const name = event.payload.arguments.name;
        const role = event.payload.arguments.role;
        const tableName = event.payload.TableName;

        const params = {
            ExpressionAttributeNames: {
                "#name": "name",
                "#role": "role"
            },
            ExpressionAttributeValues: {
                ":name": { S: name },
                ":role": { S: role }
            },
            Key: {
                "id": { N: id.toString() }
            },
            ReturnValues: "ALL_NEW",
            TableName: tableName,
            UpdateExpression: "SET #name = :name, #role = :role"
        };

        const command = new UpdateItemCommand(params);
        const data = await dynamodbClient.send(command);

        const body = data.Attributes;
        return {
            id: body.id.N,
            name: body.name.S,
            description: body.description.S
        };
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};
