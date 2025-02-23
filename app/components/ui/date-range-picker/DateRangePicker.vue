<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useForwardPropsEmits, DateRangePickerArrow, DateRangePickerCalendar, DateRangePickerCell, DateRangePickerCellTrigger, DateRangePickerContent, DateRangePickerField, DateRangePickerGrid, DateRangePickerGridBody, DateRangePickerGridHead, DateRangePickerGridRow, DateRangePickerHeadCell, DateRangePickerHeader, DateRangePickerHeading, DateRangePickerNext, DateRangePickerPrev, DateRangePickerRoot, DateRangePickerTrigger } from 'reka-ui'
import type { DateRangePickerRootProps, DateRangePickerRootEmits } from 'reka-ui'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

const props = defineProps<DateRangePickerRootProps>()
const emits = defineEmits<DateRangePickerRootEmits>()

const df = new DateFormatter('de-DE', { dateStyle: 'short'
})

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DateRangePickerRoot
    v-bind="forwarded"
  >
    <DateRangePickerField
      class="flex select-none bg-white items-center rounded-lg text-center border border-transparent data-[invalid]:border-red-500"
    >
      <DateRangePickerTrigger class="flex items-center gap-4 justify-between min-w-52 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <span
          v-if="modelValue?.start && modelValue?.end"
          class="text-sm"
        >
          {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }} - {{ df.format(modelValue.end.toDate(getLocalTimeZone())) }}
        </span>
        <span
          v-else
          class="text-muted-foreground"
        >Datum wählen</span>
        <Icon
          icon="radix-icons:calendar"
          class="w-6 h-6"
        />
      </DateRangePickerTrigger>
    </DateRangePickerField>

    <DateRangePickerContent
      :side-offset="4"
      class="rounded-xl z-[100] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.green.700)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
    >
      <DateRangePickerArrow class="fill-white" />
      <DateRangePickerCalendar
        v-slot="{ weekDays, grid }"
        class="p-4"
      >
        <DateRangePickerHeader class="flex items-center justify-between">
          <DateRangePickerPrev
            class="inline-flex items-center cursor-pointer text-black justify-center rounded-[9px] bg-transparent w-8 h-8 hover:bg-black hover:text-white active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black"
          >
            <Icon
              icon="radix-icons:chevron-left"
              class="w-6 h-6"
            />
          </DateRangePickerPrev>

          <DateRangePickerHeading class="text-[15px] text-black font-medium" />
          <DateRangePickerNext
            class="inline-flex items-center cursor-pointer text-black justify-center rounded-[9px] bg-transparent w-8 h-8 hover:bg-black hover:text-white active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black"
          >
            <Icon
              icon="radix-icons:chevron-right"
              class="w-6 h-6"
            />
          </DateRangePickerNext>
        </DateRangePickerHeader>
        <div
          class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        >
          <DateRangePickerGrid
            v-for="month in grid"
            :key="month.value.toString()"
            class="w-full border-collapse select-none space-y-1"
          >
            <DateRangePickerGridHead>
              <DateRangePickerGridRow class="mb-1 flex w-full justify-between">
                <DateRangePickerHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  class="w-8 rounded-md text-xs !font-normal text-black"
                >
                  {{ day }}
                </DateRangePickerHeadCell>
              </DateRangePickerGridRow>
            </DateRangePickerGridHead>
            <DateRangePickerGridBody>
              <DateRangePickerGridRow
                v-for="(weekDates, index) in month.rows"
                :key="`weekDate-${index}`"
                class="flex w-full"
              >
                <DateRangePickerCell
                  v-for="weekDate in weekDates"
                  :key="weekDate.toString()"
                  :date="weekDate"
                >
                  <DateRangePickerCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    class="`
                      relative
                      flex
                      items-center
                      justify-center
                      rounded-md
                      whitespace-nowrap
                      text-sm
                      font-normal
                      text-black
                      w-8
                      h-8
                      outline-none
                      focus:shadow-[0_0_0_1px]
                      focus:shadow-black
                      data-[outside-view]:text-black/30
                      data-[selection-end]:bg-gray-700
                      data-[selection-start]:bg-gray-700
                      data-[selected]:bg-gray-500
                      data-[selected]:text-white
                      hover:bg-gray-200
                      data-[highlighted]:bg-gray-300
                      data-[unavailable]:pointer-events-none
                      data-[unavailable]:text-black/30
                      data-[unavailable]:line-through
                      before:absolute
                      before:top-[4px]
                      before:hidden
                      before:rounded-full
                      before:w-1
                      before:h-1
                      before:bg-white
                      data-[today]:before:block
                      data-[today]:before:bg-blue-500
                    `"
                  />
                </DateRangePickerCell>
              </DateRangePickerGridRow>
            </DateRangePickerGridBody>
          </DateRangePickerGrid>
        </div>
      </DateRangePickerCalendar>
    </DateRangePickerContent>
  </DateRangePickerRoot>
</template>
