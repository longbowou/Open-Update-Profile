import {DynamoDBClient, ScanCommand, UpdateItemCommand} from "@aws-sdk/client-dynamodb";

const region = 'us-east-2'

const DYNAMO_TABLE_NAME = 'ProjectOpen';

const dynamoDbClient = new DynamoDBClient({region});

export const handler = async (event) => {
    try {
        let user = event.requestContext.authorizer;

        const {name, email, address} = JSON.parse(event.body);
        if (!name || !email || !address) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({message: 'All fields are required'}),
            };
        }

        const scanParams = {
            TableName: DYNAMO_TABLE_NAME,
            FilterExpression: 'email = :email AND id <> :id',
            ExpressionAttributeValues: {
                ':email': {S: email},
                ':id': {S: user.id}
            }
        };

        let data = await dynamoDbClient.send(new ScanCommand(scanParams));
        console.log(data)
        if (data.Count > 0) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({errors: [{field: "email", message: "Email already used."}]}),
            };
        }

        const updateParams = {
            TableName: DYNAMO_TABLE_NAME,
            Key: {
                id: {S: user.id}
            },
            UpdateExpression: 'SET #n = :name, email = :email, address = :address',
            ExpressionAttributeNames: {
                '#n': 'name'
            },
            ExpressionAttributeValues: {
                ':name': {S: name},
                ':email': {S: email},
                ':address': {S: address}
            },
            ReturnValues: 'ALL_NEW'
        };

        data = await dynamoDbClient.send(new UpdateItemCommand(updateParams));
        console.log(data)

        user = {
            id: data.Attributes.id.S,
            name: data.Attributes.name.S,
            email: data.Attributes.email.S,
            address: data.Attributes.address.S,
            imageUrl: data.Attributes.imageUrl.S,
            createdOn: data.Attributes.createdOn.S,
        };

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                error: [],
                user
            }),
        };
    } catch (err) {
        console.error('Error updating user profile:', err);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                message: 'Failed to update user profile'
            }),
        };
    }
};
