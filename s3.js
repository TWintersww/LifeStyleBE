import { createInterface } from "node:readline/promises";
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import config from './utils/config.js'

// const sendSomething = async () => {

//   const s3Client = new S3Client({ 
//     region: config.AWS_REGION,
//     credentials: {
//       accessKeyId: config.AWS_ACCESS_KEY_ID,
//       secretAccessKey: config.AWS_SECRET_ACCESS_KEY
//     } 
//   });
//   await s3Client.send(
//     new PutObjectCommand({
//       Bucket: "evwu-lifestyle-app",
//       Key: "news3.txt",
//       Body: "hello world world"
//     })
//   )
// }

const readSomething = async () => {
    const s3Client = new S3Client({ 
      region: config.AWS_REGION,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
      } 
    });
    const { Body } = await s3Client.send(
      new GetObjectCommand({
        Bucket: "evwu-lifestyle-app",
        Key: "news3.txt"
      })
    )

    console.log(await Body.transformToString())
}

// sendSomething()
readSomething()

