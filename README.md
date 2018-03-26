# Monty Mole
Lambda function to notify via slack's bot DM that a PR has been reviewed


## Configuration
1. Download project
2. Configure the options described in `config.js`
3. Create a .zip file of the project
4. Upload .zip file to AWS Lambda
5. Build an [AWS API Gateway with Lambda proxy integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html)
6. Configure a new [webhook](https://developer.github.com/webhooks/) in your github project. Select the option '[Pull request review](https://developer.github.com/v3/activity/events/types/#pullrequestreviewevent)' and set your AWS API Gateway's url as the Payload URL.
