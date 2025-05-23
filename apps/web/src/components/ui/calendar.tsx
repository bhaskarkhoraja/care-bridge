"use client"

import * as React from "react"
import { buttonVariants } from "@web/src/components/ui/button"
import { cn } from "@web/src/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, DropdownProps } from "react-day-picker"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CustomDropDown(props: DropdownProps) {
  const { onChange, value, children } = props
  const options = React.Children.toArray(children) as React.ReactElement<
    React.HTMLProps<HTMLOptionElement>
  >[]
  const selected = options.find((child) => child.props.value === value)
  const handleChange = (value: string) => {
    const changeEvent = {
      target: { value },
    } as React.ChangeEvent<HTMLSelectElement>
    onChange?.(changeEvent)
  }
  return (
    <Select
      value={value?.toString()}
      onValueChange={(value) => {
        handleChange(value)
      }}
    >
      <SelectTrigger className="flex h-fit items-center justify-center gap-1 px-2 py-1 focus:ring-0">
        <SelectValue>{selected?.props?.children}</SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-48 bg-white" align="center">
        {options.map((option, id: number) => (
          <SelectItem
            key={`${option.props.value}-${id}`}
            value={option.props.value?.toString() ?? ""}
            className="w-full text-center"
          >
            {option.props.children}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        dropdown:
          "appearance-none absolute z-2 top-0 left-0 bottom-0 cursor-pointer bg-transparent w-full",
        dropdown_icon: "ml-1.5",
        dropdown_month: "relative inline-flex items-center",
        dropdown_year: "relative inline-flex items-center",
        caption_dropdowns: "flex items-center justify-between gap-2",
        vhidden: "hidden",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="size-4" />,
        IconRight: () => <ChevronRight className="size-4" />,
        Dropdown: CustomDropDown,
      }}
      captionLayout="dropdown-buttons"
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
