#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TutorialAwsCdkStack } from '../lib/tutorial_aws_cdk-stack';

const app = new cdk.App();
new TutorialAwsCdkStack(app, 'TutorialAwsCdkStack');
