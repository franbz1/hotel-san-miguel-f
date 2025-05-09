import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { useState, useEffect } from "react"

export function DateTimePicker({ onChange, initialDate }: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate ? new Date(initialDate) : undefined)
  const [time, setTime] = useState("12:00")
  const [open, setOpen] = useState(false)

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      const [hours, minutes] = time.split(":").map(Number)
      const newDate = new Date(selectedDate)
      newDate.setHours(hours, minutes, 0, 0)
      onChange(newDate.toISOString())

      // cerrar manualmente el popover
      setOpen(false)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    if (date) {
      const [hours, minutes] = newTime.split(":").map(Number)
      const newDate = new Date(date)
      newDate.setHours(hours, minutes, 0, 0)
      onChange(newDate.toISOString())
    }
  }

  useEffect(() => {
    if (initialDate) {
      const initialDateTime = new Date(initialDate)
      setDate(initialDateTime)
      setTime(`${String(initialDateTime.getHours()).padStart(2, '0')}:${String(initialDateTime.getMinutes()).padStart(2, '0')}`)
    }
  }, [initialDate])

  return (
    <div className="space-y-2">
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span className="text-muted-foreground">Selecciona una fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" onClick={(e) => e.stopPropagation()}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Hora</label>
        <Input
          type="time"
          value={time}
          onChange={handleTimeChange}
        />
      </div>
    </div>
  )
}

interface DateTimePickerProps {
  onChange: (date: string) => void
  initialDate?: string
}

