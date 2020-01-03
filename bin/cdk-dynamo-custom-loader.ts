#!/usr/bin/env node
import 'source-map-support/register';

import { App } from '@aws-cdk/core';

import { CdkDynamoCustomLoaderStack } from '../src/cdk-dynamo-custom-loader-stack';

const app = new App();
new CdkDynamoCustomLoaderStack(app, 'CdkDynamoCustomLoaderStack');
