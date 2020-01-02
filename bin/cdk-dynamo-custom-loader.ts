#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkDynamoCustomLoaderStack } from '../lib/cdk-dynamo-custom-loader-stack';

const app = new cdk.App();
new CdkDynamoCustomLoaderStack(app, 'CdkDynamoCustomLoaderStack');
