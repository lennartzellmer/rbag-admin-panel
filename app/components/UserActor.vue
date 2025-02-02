<script setup lang="ts">
import { useActor } from '@xstate/vue'
import { createBrowserInspector } from '@statelyai/inspect'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h } from 'vue'
import * as z from 'zod'
import { toast } from './ui/toast'
import { Input } from './ui/input'
import type { UserDocument } from '~~/server/models/User'
import { userEditorMachine } from '~/machines/userEditor/userEditor.machine'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

const props = defineProps<{
  user: UserDocument
}>()

// add inspector to the user machine
const { inspect } = createBrowserInspector()

const { snapshot, send } = useActor(userEditorMachine, { input: { user: props.user }, inspect })

const formSchema = toTypedSchema(z.object({
  firstname: z.string().min(2).max(50),
  lastname: z.string().min(2).max(50)
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit((values) => {
  send({ type: 'SAVE_USER', payload: { user: values } })
  toast({
    title: 'You submitted the following values:',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2)))
  })
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardDescription>{{ snapshot.context.user.email }}</CardDescription>
      <CardDescription>{{ snapshot.context.user.organisation?.name }}</CardDescription>
      <CardContent>
        <form
          class="w-2/3 space-y-6"
          @submit="onSubmit"
        >
          <FormField
            v-slot="{ componentField }"
            name="firstname"
            :model-value="snapshot.context.user.firstname"
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
            name="lastname"
            :model-value="snapshot.context.user.lastname"
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
          <Button
            type="submit"
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </CardHeader>
  </Card>
</template>
