import { 
  S3Client,
  PutObjectCommand,
  ListBucketsCommand
 } from '@aws-sdk/client-s3'
import config from './config.js'

const s3Client = new S3Client({
  region: config.AWS_REGION,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
      } 
})

const checkS3Connection = async () => {
  try {
    const result = await s3Client.send(new ListBucketsCommand({}))
    console.log('S3 connection works. Buckets:', result.Buckets)
  }
  catch (e) {
    console.error('Error connecting to s3:', e)
  }
}
checkS3Connection()

export default s3Client
