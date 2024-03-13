import * as cdk from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Code, LayerVersion, Runtime, Function, Architecture } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import path = require("node:path");

export class BunCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const layer = LayerVersion.fromLayerVersionArn(
      this,
      "BunLayer",
      // Follow https://github.com/oven-sh/bun/tree/main/packages/bun-lambda#setup
      // and deploy the layer to your account
      // then get the ARN from the AWS Console under Lambda -> Layers
      "arn:aws:lambda:us-east-1:648568751601:layer:bun:2"
    );

    const helloHandler = new Function(this, "HelloFn", {
      runtime: Runtime.PROVIDED_AL2,
      handler: "hello.handler",
      code: Code.fromAsset(path.join(__dirname, "../", "lambda")),
      architecture: Architecture.ARM_64,
      layers: [layer],
    });
    
    const dateHandler = new Function(this, "DateFn", {
      runtime: Runtime.PROVIDED_AL2,
      handler: "date.handler",
      code: Code.fromAsset(path.join(__dirname, "../", "lambda")),
      architecture: Architecture.ARM_64,
      layers: [layer],
    });


    const api = new RestApi(this, "bun-api");
    api.root.addMethod("GET", new LambdaIntegration(helloHandler));

    const date = api.root.addResource("date");
    date.addMethod("GET", new LambdaIntegration(dateHandler));

    new cdk.CfnOutput(this, "BunApiUrl", {
      value: api.url ?? "Something went wrong with the deployment",
    });
  }
}
