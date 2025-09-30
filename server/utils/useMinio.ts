import { Client } from 'minio'

export const useMinio = () => {
  const runtimeConfig = useRuntimeConfig()

  const minioClient = new Client({
    endPoint: runtimeConfig.storage.s3.endpoint,
    port: runtimeConfig.storage.s3.port,
    region: runtimeConfig.storage.s3.region,
    accessKey: runtimeConfig.storage.s3.accessKeyId,
    secretKey: runtimeConfig.storage.s3.secretAccessKey,
    useSSL: false
  })

  async function ensureBucketExists(bucketName: string) {
    const exists = await minioClient.bucketExists(bucketName).catch(() => false)
    if (!exists) {
      await minioClient.makeBucket(bucketName, '')
    }
  }

  function getExtensionOf(name: string) {
    const idx = name.lastIndexOf('.')
    return idx >= 0 ? name.slice(idx + 1) : ''
  }

  return { minioClient,
    ensureBucketExists,
    getExtensionOf
  }
}
