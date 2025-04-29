import { ICity } from "country-state-city";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Path, UseFormReturn } from "react-hook-form";

// Make this component accept any form type
interface CitySelectorProps<TFieldValues extends Record<string, unknown>> {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  cities: ICity[];
  onCityChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const CitySelector = <TFieldValues extends Record<string, unknown>>({
  form,
  name,
  label,
  placeholder = "Seleccione ciudad",
  cities,
  onCityChange,
  disabled = false,
  className
}: CitySelectorProps<TFieldValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          {cities.length > 0 ? (
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                if (onCityChange) onCityChange(value);
              }} 
              value={field.value as string}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[200px]">
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <FormControl>
              <Input 
                {...field} 
                value={field.value as string}
                placeholder={`Ingrese ${label.toLowerCase()}`} 
                disabled={disabled}
              />
            </FormControl>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}; 