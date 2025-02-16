<template>
  <table class="overflow-hidden rounded-lg">
    <thead class="bg-gray-light">
      <tr class="divide-x divide-gray-dark">
        <slot name="thead" />
      </tr>
    </thead>
    <tbody>
      <slot name="tbody" />
    </tbody>
  </table>
</template>
