const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamodbClient = new DynamoDBClient();

module.exports.handler = async (event) => {
    try {
        console.log("EVENT :: ", JSON.stringify(event))
        const id = event.payload.arguments.id;
        const name = event.payload.arguments.name;
        const role = event.payload.arguments.role;
        const tableName = event.payload.TableName;
        const params = {
            Item: {
                "id": {
                    N: id.toString()
                },
                "name": {
                    S: name
                },
                "role": {
                    S: role
                }
            },
            TableName: tableName
        };
        console.log("params :: ", JSON.stringify(params))
        const command = new PutItemCommand(params);
        const data = await dynamodbClient.send(command);
	console.log("data :: ", JSON.stringify(data))
        return {
            id,
            name,
            role
        };
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};