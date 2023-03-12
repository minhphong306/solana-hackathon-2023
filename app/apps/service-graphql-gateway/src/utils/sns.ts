import * as aws from 'aws-sdk';
import {SNS} from 'aws-sdk';

let SnsClient: SNS;

export interface GetSnsClientInput {
  accessKey: string
  secretAccessKey: string

  snsRegion: string
  snsDispatcherArn: string
  snsSingleArn: string
}
export const GetSnsClient = (input: GetSnsClientInput, instance: SNS = SnsClient): SNS => {
  if (instance) {
    return instance;
  }

  aws.config.update({
    sns: {
      credentials: {
        accessKeyId: input.accessKey,
        secretAccessKey: input.secretAccessKey,
      },
    },

    region: input.snsRegion,
  });

  SnsClient = new aws.SNS();
  return SnsClient;
};

