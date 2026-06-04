const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const {
  fromCognitoIdentityPool,
} = require("@aws-sdk/credential-provider-cognito-identity");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const IDENTITY_POOL_ID = process.env.AWS_IDENTITY_POOL_ID;

const s3Client = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: IDENTITY_POOL_ID,
  }),
});

async function getPhotos() {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
  });
  const response = await s3Client.send(command);

  if (response.KeyCount === 0) {
    return null;
  }

  const sortedByNewestContents = [...response.Contents].sort((a, b) => {
    return Date.parse(b.LastModified) - Date.parse(a.LastModified);
  });

  const photos = await Promise.all(
    sortedByNewestContents.map(async (content) => {
      return {
        key: content.Key,
        url: await s3GetSignedUrl(content.Key),
      };
    }),
  );

  return photos;
}

async function s3GetSignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  const response = await getSignedUrl(s3Client, command, { expiresIn: 600 });
  return response;
}

async function uploadPhoto(file, fileName) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file,
  });
  const response = await s3Client.send(command);
  return response;
}

module.exports = {
  getPhotos,
  uploadPhoto,
  s3GetSignedUrl,
};
