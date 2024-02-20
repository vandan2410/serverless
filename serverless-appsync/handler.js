console.log('Loading function');

const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const createEmployee = require('./functions/createEmployee');
const readEmployee = require('./functions/readEmployee');
const updateEmployee = require('./functions/updateEmployee');
const deleteEmployee = require('./functions/deleteEmployee');

const ddbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const tablename = "employeeTable";
module.exports.handler= async (event, context) => {
    const operation = event.operation;
    console.log(event)
    event.payload.TableName = tablename;

    try {
        switch (operation) {
            case 'create':
                await createEmployee.handler(event);
                break;
            case 'read':
                const employeeDetails = await readEmployee.handler(event);
                console.log(employeeDetails);
                break;
            case 'update':
                await updateEmployee.handler(event);
                break;
            case 'delete':
                await deleteEmployee.handler(event);
                break;
            default:
                return (`Unknown operation: ${operation}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error; // rethrow the error to be handled by Lambda
    }
};