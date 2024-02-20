const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamodbClient = new DynamoDBClient();

module.exports.handler = async (event) => {
    try {
        const id = parseInt(event.payload.arguments.id);
        const tableName = event.payload.TableName;

        const params = {
            Key: {
                "id": {
                    N: id.toString()
                }
            },
            TableName: tableName
        };

        const command = new GetItemCommand(params);
        const data = await dynamodbClient.send(command);

        const body = data.Item;
        if (!body) {
            throw new Error('Item not found');
        }

        return {
            id: body.id.N,
            name: body.name.S,
            role: body.role.S
        };
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};
