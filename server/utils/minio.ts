import { Client } from 'minio'

const useMinio = () => {
  const runtimeConfig = useRuntimeConfig()

  const minioClient = new Client({
    endPoint: runtimeConfig.storage.s3.endpoint,
    region: runtimeConfig.storage.s3.region,
    accessKey: runtimeConfig.storage.s3.accessKeyId,
    secretKey: runtimeConfig.storage.s3.secretAccessKey,
    useSSL: false
  })

  return minioClient
}
