import { assertEvent, fromPromise, setup, assign } from 'xstate'
import type { MachineContext, MachineEvents, MachineInput } from './userProfileImage.types'
import { getUserById, removeProfileImage, updateProfileImage } from '~/service/user'

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
    getUserProfileImageObjectName: fromPromise<string | undefined, { id: string }>(
      async ({ input }) => {
        const user = await getUserById(input.id)
        return user.media?.profileImage.objectName || undefined
      }
    )
  },
  guards: {
    hasProfileImage: function ({ context }) {
      return !!context.objectName
    }
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4AV0HsBmAlgDZgCSAtgIYwB0MALqQHYH0GVEDK9l9YAxBBxMwNWDz41UGbPmJkqtBs1bsuEsAG0ADAF1EoAA45Yq4QZAAPRAEZtAZgAsNAOwA2AExvHH7R4CsHi4u9gA0IACeiF4eNAAc-to+NnH2dnEeNgC+WeHSWLiEJBTUososbBzcvAJCImIaUmgFcsWKZWCMFWrVfJo2+kggxqZs5kPWCC42LjQ23gCc-v4Lvh5LbuFRCDHxicmp6Zk5ec2yRQqldJ0qleo11-QAqs2CwqIETABuOADWovlzvISkobt0qo0GC8MAhPj8AMa8AjCHS6VEWEZmJgWSZuBb2eJpOIudaOFz+RyrLbRfxzfxufxOTIuSn2bRuOInECAwrA9qPW49SGdaHofgYXDoGiGIi8PA4dDkJoyXltK7lVQQh5Q5qw744RFjJio9FDTFGnGIAC0dgWrgWjhSaQC7jiS2pCEcbho2m0Nns9hc7IDDmWXJ5rUutFgAAscAB3EEfdqcTr8ABKAFEALIAeQAapmAPqkbMAQQA4pnTUYTFjLQgbL44jQyQtUvYFuzpuyPW4Oa2bPi3PY8S5iSFw2dVVHRLGE0maOgwOQcF9PlAk296nC-gDp5HF-PE-zl6v10xN+09QikSi9DXhnWLRNbJltDQgoHUtN7AkPXEniuP444MvSQT0tkuTcgeFxHnGJ5XGea4bluEoKtKsr0PKirKi0cH8sei7IReV6lDeBp3saD56Biz7Itir6Nr4BIuAsbj+qsQQsvYHgeo4f40Gy9KJJ2bjuMEU4qoehEIQAYgqSpMDgQJqjA-BlgAIppJbllWj7mgxDZtjQ-Zeg4+K+toKwuH2eKfuSjpDnixKOI4Un4XyVzHgpuHIDKOCUBAW51B8+r-HhqmzmI8mKVIAVBUmFGGgxJq0Wa9HjKAkzma2wQ2I6QQLO4DKbJE0RAQkSSZIc2gZFBpzSQR3mxX5CXBe04roJKmFynFEbNdGrVKv5RCBR15G7il95oultajEZTFejYcyOIk45xJtCwOnx5WeoGraUgyQYzG5Xg5NBykQHAFgDV5MB0QtWVWNaNggfajqHC6HIOh6NqUvEAluZ4wZxL67nQXdakdF0mr3Hwj31kxEE+kyvGbWyfgLH9QFOHjPhrV4CRuB5UWLhqdy9DDoqIy+2WILxBIOD46OpL66weoJGN2HV7ZLBS52Q7B90w4KWqSJp7y04t9ONtZ3r+Gzf4jnEMw2H2K3+myxV1Qkjiqw1MFNSLMULu00vPZMdg2Ct6zjp2qu+oyZXbPYiTxPLCxNor7giaTM7wWbVwECmnQW4xst2Csn7Fak7Y887Hogd6XbWasuv4qs-syS1Qe0CRqHmxlT0Ry9jYCd6NtBuJG2beJSeMq2vr9oGXoMpyQvG9Dpvxr55Dhw2KR2pSvvzCEQYgXEnMAw67E+O24kcvY2eDXOw00MpZNF-NSOyx4B0jwyY+BtZ45J24H5ONoJKrKOc8Q41nndz5-XtUmA9MRPNCZ8rqvOknZI5gsnZEOcyIF-AXSyEAA */
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
            src: 'getUserProfileImageObjectName',
            input: ({ context }) => ({ id: context.userId }),
            onDone: {
              target: 'Done',
              description: 'Assign fetched URL to context',
              actions: assign({ objectName: ({ event }) => event.output }),
              reenter: true
            },
            onError: {
              target: '#userProfileImage.showForm',

              actions: {
                type: 'showToast',
                params: {
                  message: 'Benutzer konnte nicht geladen werden'
                }
              },

              reenter: true
            }
          }
        },
        Done: {
          type: 'final'
        }
      },
      onDone: [{
        target: '#userProfileImage.showImage',
        guard: 'hasProfileImage'
      }, {
        target: 'showForm',
        reenter: true
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
              target: '#userProfileImage.showForm',
              reenter: true,
              description: 'Remove profile image url from context',
              actions: assign({ objectName: undefined })
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

    showForm: {
      initial: 'noProfileImage',
      states: {
        noProfileImage: {
          on: {
            ADD_IMAGE: {
              target: '#userProfileImage.showForm.uploadImage'
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
              target: '#userProfileImage.getInitialState',
              reenter: true
            },
            onError: {
              target: '#userProfileImage.showForm.noProfileImage',
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
    }
  }
})
