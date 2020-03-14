import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { AwsCustomResource, PhysicalResourceId } from '@aws-cdk/custom-resources';
import { commerce, name, random } from 'faker';

interface IFriend {
  id: { S: string };
  firstName: { S: string };
  lastName: { S: string };
  shoeSize: { N: number };
  favoriteColor: { S: string };
}

export class CdkDynamoCustomLoaderStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const tableName = 'friends';

    // Create a table
    new Table(this, 'FriendsTable', {
      tableName,
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Add one item to the table.
    new AwsCustomResource(this, 'initDBResource', {
      onCreate: {
        service: 'DynamoDB',
        action: 'putItem',
        parameters: {
          TableName: tableName,
          Item: this.generateItem(),
        },
        physicalResourceId: PhysicalResourceId.of('initDBData'),
      },
    });

    // Add 25 items at a time ten times.
    for (let i = 0; i < 10; i++) {
      new AwsCustomResource(this, `initDBResourceBatch${i}`, {
        onCreate: {
          service: 'DynamoDB',
          action: 'batchWriteItem',
          parameters: {
            RequestItems: {
              [tableName]: this.generateBatch(),
            },
          },
          physicalResourceId: PhysicalResourceId.of(`initDBDataBatch${i}`),
        },
      });
    }
  }

  private generateBatch = (batchSize = 25): { PutRequest: { Item: IFriend } }[] => {
    return new Array(batchSize).fill(undefined).map(() => {
      return { PutRequest: { Item: this.generateItem() } };
    });
  };

  private generateItem = (): IFriend => {
    return {
      id: { S: random.uuid() },
      firstName: { S: name.firstName() },
      lastName: { S: name.lastName() },
      shoeSize: { N: random.number({ max: 25, min: 1, precision: 0.1 }) },
      favoriteColor: { S: commerce.color() },
    };
  };
}
