import { createIPX, createIPXH3Handler } from 'ipx'
import type { IPXOptions, IPXStorage } from 'ipx'
import { lazyEventHandler, useBase } from 'h3'
import { useMinio } from '../../../server/utils/useMinio'

export default lazyEventHandler(() => {
  const { minioClient } = useMinio()
  const runtimeConfig = useRuntimeConfig()
  const bucket = runtimeConfig.storage.s3.bucket

  const storage: IPXStorage = {
    name: 'minio',
    getMeta: () => {
      return {
        mtime: 100
      }
    },
    getData: async (objectName) => {
      if (!objectName) throw new Error('No UUID found in URL')

      const stream = await minioClient.getObject(bucket, objectName)
      const arrayBuffer = await new Response(stream as unknown as BodyInit).arrayBuffer()
      return arrayBuffer
    }
  }

  const ipxOptions: IPXOptions = {
    storage
  }

  const ipx = createIPX(ipxOptions)

  const ipxHandler = createIPXH3Handler(ipx)
  return useBase('/_ipx', ipxHandler)
})
