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
import { UseFormReturn } from "react-hook-form";

interface CountrySelectorProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  countries: ICountry[];
  onCountryChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const CountrySelector = ({
  form,
  name,
  label,
  placeholder = "Seleccione país",
  countries,
  onCountryChange,
  disabled = false,
  className
}: CountrySelectorProps) => {
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
            value={field.value}
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