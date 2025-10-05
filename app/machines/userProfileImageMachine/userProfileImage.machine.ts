import { assertEvent, fromPromise, setup, assign } from 'xstate'
import type { MachineContext, MachineEvents, MachineInput } from './userProfileImage.types'
import { getUserById, removeProfileImage, updateProfileImage } from '~/service/user'
import type { WithMediaUrls } from '~/types/media.types'

export const machine = setup({
  types: {
    context: {} as MachineContext,
    events: {} as MachineEvents,
    input: {} as MachineInput
  },
  actions: {
    showToast: function (_, params: { message: string }) {
      const toast = useToast()
      toast.add({
        title: params.message,
        color: 'error'
      })
    }
  },
  actors: {
    removeImage: fromPromise<undefined, { id: string }>(
      async ({ input }) => {
        await removeProfileImage(input.id)
        return
      }
    ),
    uploadImage: fromPromise<undefined, { id: string, file: File }>(
      async ({ input }) => {
        await updateProfileImage(input.id, input.file)
        return
      }
    ),
    getUserProfileImageUrl: fromPromise<WithMediaUrls<string | undefined>, { id: string }>(
      async ({ input }) => {
        const user = await getUserById(input.id)
        return user.media?.profileImage.url || undefined
      }
    )
  },
  guards: {
    hasProfileImage: function ({ context }) {
      return !!context.url
    }
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4AV0HsBmAlgDZgCSAtgIYwB0MALqQHYH0GVEDK9l9YAxBBxMwNWDz41UGbPmJkqtBs1bsuEsAG0ADAF1EoAA45Yq4QZAAPRABYAHHZoA2GwE4bAJgDsT7dq+uAKwAjAA0IACeiMEAzB40HoEernZedk6BgdqBMQC+ueHSWLiEJBTUososbBzcvAJCImIaUmjFcmWKlWCM1Wp1fJrB+kggxqZs5qPWCB6xzjFeXolOMcF2Nj4e4VEIsfGJyanpmdl5BSBFsqUKFXQ9KjXq9ff0AKptgsKiBEwAbjgANaiK4leTlJQPPq1FoMD4YBC-AEAY14BGEOl0mIs4zMTAsM2CSRoyxs-i8a20rg8MScTh2iAAtMFtPEbMF2TFKTZNq5gvlCm1ruCuq9Hv1YT14eh+BhcOgaIYiLw8Dh0ORWjIwZ07lVVDCXnC2oj-jhUZMmJjsaNcRaCUzgq4nDQOe5AnZqSyHP4GQgnMESesfDEHEsPDY6QLLkLtbdaLAABY4ADuEJ+XU4PX4ACUAKIAWQA8gA1XMAfVI+YAggBxXPWowmPH2hCuJY0EPLbQhuyLJZhSKILI2F1knnaYKJPmBLyBKOgjpx0SJlNpmjoMDkHB-X5QNNfJpIoEgmOLtcr1OijdbndMPddE0otEYvQNsZNu3TaLrQLOTYzkJfDmLxfTpZ0li5VxtHZTYYlcc5BS1M9RQvNdr23Xd9zlNVFWVehVXVTV2huc8k0vO50Nve8KkfM1n0tV89BxD90XxL9Wx8GhPECJwaXDdZeNcX0PG0RwZypQJPBifwUnnU8SNFJgcGFHUYH4KsABENIras6zfW1WJbdZHBpOCKXcWJgicIJfRiTwuKSGwYiyJJaRZLw5KQhS7mQJUcEoCB90aH5TWBIiVKXKQ-ICtNaPNVirSYm0WKmUAZl47QaEyOw5jsfxglif1bLcBJvGCCk-DJI5POIkUfOiwKulldB5VwlU1Q1BdvNoXyiH8xqaKPeKXyxJLGwmQz2J-DsKQ2Nz-DmJw7GE0Ssq8CSpJkvKbHyC4lIgOALC6uqYGYibUqsJlpOdJwlh5FxEhncNfUZbxXCynLe3dXinoQ6MvJO7pen1Z4+DO5t2Ne91nDuiNuKemwXsdA5AlcakuXWok7FiGqIrXPUngGIHpXBz80qZOZMturx7vh5ZaSR6CaHg6yXBSPlnI8DxcdjfGoRBomaA075Scm8mEBCTK7BnB7ezcNtAhenKSSWp1Nlu6y0Y8i5jtU5cyLTUWLpmPLfxCVIknDbwfUHPY5gSexYnWmxJPcP7dci1DRQIDMeiNtjxelmIsqDS3PHWkDbdpTKgmcqzUmcoJ+R1+TAbEA2r03DC70N5LzoDy69nKgM0msnjjPZaDiq8Gg5q8AqAlEnInB55C7iUvGun9lsbpZRbe3SZyqUj3YuWdWlFuguIqXSVvupBBrc-GiHxZDANsbcev-XrrZEajydmc2CNYkySc4LnXagA */
  context: ({ input }) => ({
    userId: input.userId
  }),
  id: 'userProfileImage',
  initial: 'getInitialState',
  states: {
    getInitialState: {
      initial: 'getUser',
      states: {
        getUser: {
          invoke: {
            src: 'getUserProfileImageUrl',
            input: ({ context }) => ({ id: context.userId }),
            onDone: {
              target: 'Done',
              description: 'Assign fetched URL to context',
              actions: assign({ url: ({ event }) => event.output }),
              reenter: true
            },
            onError: {
              target: '#userProfileImage.noProfileImage',
              actions: {
                type: 'showToast',
                params: {
                  message: 'Benutzer konnte nicht geladen werden'
                }
              }
            }
          }
        },
        Done: {
          type: 'final'
        }
      },
      onDone: [{
        target: 'showImage',
        guard: 'hasProfileImage'
      }, {
        target: 'noProfileImage'
      }]
    },
    showImage: {
      initial: 'imageSet',
      states: {
        imageSet: {
          on: {
            REMOVE_IMAGE: {
              target: '#userProfileImage.showImage.removingImage'
            }
          }
        },
        removingImage: {
          invoke: {
            src: 'removeImage',
            input: ({ context }) => ({ id: context.userId! }),
            onDone: {
              target: '#userProfileImage.noProfileImage',
              reenter: true,
              description: 'Remove profile image url from context',
              actions: assign({ url: undefined })
            },
            onError: {
              target: '#userProfileImage.showImage.imageSet',
              actions: {
                type: 'showToast',
                params: {
                  message: 'Profilbild konnte nicht entfernt werden'
                }
              }
            }
          }
        }
      }
    },
    noProfileImage: {
      on: {
        ADD_IMAGE: {
          target: '#userProfileImage.uploadImage'
        }
      }
    },
    uploadImage: {
      invoke: {
        input: ({ event, context }) => {
          assertEvent(event, 'ADD_IMAGE')
          return { id: context.userId!, file: event.file }
        },
        onDone: {
          target: 'getInitialState',
          reenter: true
        },
        onError: {
          target: '#userProfileImage.noProfileImage',
          actions: {
            type: 'showToast',
            params: {
              message: 'Profilbild konnte nicht hochgeladen werden'
            }
          }
        },
        src: 'uploadImage'
      }
    }
  }
})
