import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { useState, useEffect } from "react"
import { CalendarIcon, ClockIcon } from "lucide-react"

interface DateTimePickerProps {
  onChange: (utcDate: string) => void;
  initialDate?: string;
}

export function DateTimePicker({ onChange, initialDate }: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate ? new Date(initialDate) : undefined)
  const [time, setTime] = useState(() => {
    if (initialDate) {
      const initialDateTime = new Date(initialDate);
      return `${String(initialDateTime.getHours()).padStart(2, '0')}:${String(initialDateTime.getMinutes()).padStart(2, '0')}`;
    }
    return "12:00";
  })

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      // Al seleccionar fecha, si hay tiempo, actualizamos el valor
      if (time) {
        const [hours, minutes] = time.split(":").map(Number)
        const newDate = new Date(selectedDate)
        newDate.setHours(hours, minutes, 0, 0)
        onChange(newDate.toISOString())
      }
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    
    // Al cambiar el tiempo, si hay fecha, actualizamos el valor
    if (date) {
      const [hours, minutes] = newTime.split(":").map(Number)
      const newDate = new Date(date)
      newDate.setHours(hours, minutes, 0, 0)
      onChange(newDate.toISOString())
    }
  }

  // Si se actualiza initialDate desde fuera
  useEffect(() => {
    if (initialDate) {
      const initialDateTime = new Date(initialDate);
      setDate(initialDateTime);
      setTime(`${String(initialDateTime.getHours()).padStart(2, '0')}:${String(initialDateTime.getMinutes()).padStart(2, '0')}`);
    }
  }, [initialDate]);

  return (
    <div className="w-full sm:max-w-md mx-auto space-y-4 p-4 rounded-xl border bg-white shadow-sm">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Fecha</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span className="text-muted-foreground">Selecciona una fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1">
        <label htmlFor="time" className="text-sm font-medium text-gray-700">Hora</label>
        <div className="relative">
          <Input
            id="time"
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="w-full pr-10"
          />
          <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}
