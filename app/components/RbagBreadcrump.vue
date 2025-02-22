<script setup lang="ts">
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbItem } from '@/components/ui/breadcrumb'

const items = useBreadcrumbItems({
  hideRoot: true,
  overrides: [
    undefined, // Root
    {
      label: 'RBAG'
    }
  ]
})
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template
        v-for="(item, key) in items"
        :key="key"
      >
        <BreadcrumbItem
          class="hidden md:block"
        >
          <BreadcrumbLink v-bind="item">
            {{ item.label }}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator
          v-if="key !== items.length - 1"
          class="hidden md:block"
        />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

<style scoped>

</style>
