const { DynamoDBClient, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamodbClient = new DynamoDBClient();

module.exports.handler = async (event) => {
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

    try {
        const command = new DeleteItemCommand(params);
        await dynamodbClient.send(command);

        return { id };
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};
