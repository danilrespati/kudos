import {
  unstable_parseMultipartFormData,
  UploadHandler,
} from "@remix-run/node";
import { Credentials } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import cuid from "cuid";

const s3 = new S3({
  region: process.env.KUDOS_BUCKET_REGION,
  credentials: new Credentials({
    accessKeyId: process.env.KUDOS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.KUDOS_SECRET_ACCESS_KEY as string,
  }),
});

const uploadHandler: UploadHandler = async ({ name, filename, data }) => {
  if (name !== "profile-pic") {
    return;
  }
  console.log(name, filename, data);

  const asyncIterableToReadableStream = require("async-iterable-to-readable-stream");
  const { Location } = await s3
    .upload({
      Bucket: process.env.KUDOS_BUCKET_NAME || "",
      Key: `${cuid()}.${filename?.split(".").slice(-1)}`,
      Body: asyncIterableToReadableStream(data),
    })
    .promise();

  return Location;
};

export async function uploadAvatar(request: Request) {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("profile-pic")?.toString() || "";

  return file;
}
