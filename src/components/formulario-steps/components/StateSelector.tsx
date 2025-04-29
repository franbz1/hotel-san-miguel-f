import { IState } from "country-state-city";
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
interface StateSelectorProps<TFieldValues extends Record<string, unknown>> {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  states: IState[];
  onStateChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const StateSelector = <TFieldValues extends Record<string, unknown>>({
  form,
  name,
  label,
  placeholder = "Seleccione estado/departamento",
  states,
  onStateChange,
  disabled = false,
  className
}: StateSelectorProps<TFieldValues>) => {
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
              onStateChange(value);
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
              {states.map((state) => (
                <SelectItem key={state.isoCode} value={state.isoCode}>
                  {state.name}
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