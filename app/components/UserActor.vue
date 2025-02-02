<script setup lang="ts">
import { useActor } from '@xstate/vue'
import { userEditorMachine } from '~/machines/userEditor/userEditor.machine'

const props = defineProps<{
  user: UserDocument
}>()

const { snapshot } = useActor(userEditorMachine, { input: { user: props.user } })
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ snapshot.context.user.firstname }} {{ snapshot.context.user.lastname }}</CardTitle>
      <CardDescription>{{ snapshot.context.user.email }}</CardDescription>
      <CardDescription>{{ snapshot.context.user.organisation?.name }}</CardDescription>
    </CardHeader>
  </Card>
</template>
