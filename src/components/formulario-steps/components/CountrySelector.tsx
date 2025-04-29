import { ICountry } from "country-state-city";
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
import { Path, UseFormReturn } from "react-hook-form";

// Make this component accept any form type
interface CountrySelectorProps<TFieldValues extends Record<string, unknown>> {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  countries: ICountry[];
  onCountryChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const CountrySelector = <TFieldValues extends Record<string, unknown>>({
  form,
  name,
  label,
  placeholder = "Seleccione país",
  countries,
  onCountryChange,
  disabled = false,
  className
}: CountrySelectorProps<TFieldValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              onCountryChange(value);
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
              {countries.map((country) => (
                <SelectItem key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}; 