const { ensureBucketExists } = useMinio()
const { storage: { s3: { bucket, tempBucket } } } = useRuntimeConfig()

export default defineNitroPlugin(async () => {
  await ensureBucketExists(bucket)
  await ensureBucketExists(tempBucket)
})
