import { createLambdaFunction, createProbot } from "@probot/adapter-aws-lambda-serverless";

import appFn from "../../index";

export const handler = createLambdaFunction(appFn, {
  probot: createProbot(),
});
