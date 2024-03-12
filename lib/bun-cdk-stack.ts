import * as cdk from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BunCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const layer = LayerVersion.fromLayerVersionArn(
      this,
      "BunLayer",
      "arn:aws:lambda:us-east-1:648568751601:layer:bun:2"
    );

    const nodejsFunction = new NodejsFunction(this, "BunCdkFunction", {
      entry: "lambda/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      layers: [layer],
    });


    const api = new RestApi(this, "bun-api");
    api.root.addMethod("GET", new LambdaIntegration(nodejsFunction));
    new cdk.CfnOutput(this, "BunApiUrl", {
      value: api.url ?? "Something went wrong with the deployment",
    });
  }
}
