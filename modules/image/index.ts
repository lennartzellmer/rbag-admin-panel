import {
  addServerHandler,
  createResolver,
  defineNuxtModule
} from 'nuxt/kit'

const { resolve } = createResolver(__dirname)

export default defineNuxtModule({
  meta: {
    name: 'imageOptimizer'
  },
  setup() {
    /**
     * Custom image ipx handler
     */
    addServerHandler({
      route: '/_ipx/**',
      method: 'get',
      handler: resolve('./runtime/ipx')
    })
    /**
     * Auth server middleware
     */
    addServerHandler({
      handler: resolve('./runtime/server-middleware')
    })
  }
})
