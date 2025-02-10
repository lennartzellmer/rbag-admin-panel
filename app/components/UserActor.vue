<script setup lang="ts">
import { useActor } from '@xstate/vue'
import { createBrowserInspector } from '@statelyai/inspect'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toast, ToastAction } from './ui/toast'
import { Input } from './ui/input'
import type { UserDocument } from '~~/server/models/User'
import { userEditorMachine } from '~/machines/userEditor/userEditor.machine'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'

const props = defineProps<{
  user: UserDocument
}>()

// add inspector to the user machine
const { inspect } = createBrowserInspector()

const { snapshot, send } = useActor(userEditorMachine.provide({
  actions: {
    onSaved: ({ context }, params: { user: UserDocument }) => {
      toast({
        description: `User details for ${params.user.firstname} (${context.user.organisation?.name || 'no organisation'}) updated`
      })
    },
    onError: ({ context }) => {
      toast({
        description: `User ${context.user.firstname} (${context.user.organisation?.name || 'no organisation'}) not saved`,
        variant: 'destructive',
        action: h(ToastAction, {
          altText: 'Try again',
          onClick: () => send({ type: 'RETRY' })
        }, {
          default: () => 'Try again'
        })
      })
    }
  }
}),
{
  input: { user: props.user },
  inspect
}
)

const formData = ref({
  firstname: props.user.firstname,
  lastname: props.user.lastname,
  email: props.user.email
})

// watch formData and send touch event when it changes
watch(formData, () => {
  send({ type: 'TOUCH' })
}, { deep: true })

const formSchema = toTypedSchema(z.object({
  firstname: z.string().min(2).max(50),
  lastname: z.string().min(2).max(50),
  email: z.string().email()
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit((values) => {
  send({ type: 'SAVE_USER', payload: { user: values } })
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardContent>
        <form
          class="w-full space-y-3"
          @submit="onSubmit"
        >
          <FormField
            v-slot="{ componentField }"
            v-model="formData.firstname"
            name="firstname"
          >
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="First name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            v-model="formData.lastname"
            name="lastname"
          >
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Last name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            v-model="formData.email"
            name="email"
          >
            <FormItem>
              <FormLabel>eMail</FormLabel>
              <FormControl>
                <Input
                  disabled
                  type="email"
                  placeholder="email@email.com"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button
            v-if="snapshot.matches({ idle: 'touched' })"
            type="submit"
          >
            Save
          </Button>
        </form>
      </CardContent>
    </CardHeader>
  </Card>
</template>
