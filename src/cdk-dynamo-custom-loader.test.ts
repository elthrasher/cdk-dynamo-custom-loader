import { countResources, expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';

import { CdkDynamoCustomLoaderStack } from './cdk-dynamo-custom-loader-stack';

test('Create Dynamo Table', () => {
  const app = new App();
  // WHEN
  const stack = new CdkDynamoCustomLoaderStack(app, 'MyTestStack');
  // THEN
  expect(stack).to(
    haveResource(
      'AWS::DynamoDB::Table',
      {
        Properties: {
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
        },
        UpdateReplacePolicy: 'Delete',
        DeletionPolicy: 'Delete',
      },
      ResourcePart.CompleteDefinition,
      true,
    ),
  );
});

test('Custom AWS Resources', () => {
  const app = new App();
  // WHEN
  const stack = new CdkDynamoCustomLoaderStack(app, 'MyTestStack');
  // THEN
  expect(stack).to(
    haveResource(
      'Custom::AWS',
      {
        Create: { service: 'DynamoDB', action: 'putItem' },
      },
      ResourcePart.Properties,
      true,
    ),
  );
  expect(stack).to(
    haveResource(
      'Custom::AWS',
      {
        Create: { service: 'DynamoDB', action: 'batchWriteItem' },
      },
      ResourcePart.Properties,
      true,
    ),
  );
  expect(stack).to(countResources('Custom::AWS', 11));
});
