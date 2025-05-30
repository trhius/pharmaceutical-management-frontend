import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form'; // Import useFormContext

interface DateRangeSelectorProps {
  namePrefix: string; // e.g., 'createdDate', 'birthDate'
  label: string;      // e.g., 'Ngày tạo', 'Ngày sinh'
  dateFormat: string; // e.g., 'dd/MM/yyyy'
}

export function DateRangeSelector({ namePrefix, label, dateFormat }: DateRangeSelectorProps) {
  const { control, watch, setValue } = useFormContext(); // Use useFormContext to access form methods

  const optionFieldName = `${namePrefix}Option`;
  const customFieldName = `${namePrefix}Custom`;

  const selectedOption = watch(optionFieldName);
  const selectedDateRange = watch(customFieldName);

  return (
    <div className="space-y-2">
      <h3 className="font-medium">{label}</h3>
      <FormField
        control={control}
        name={optionFieldName}
        render={({ field }) => (
          <FormItem className="space-y-2">
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="all" id={`${namePrefix}-all-time`} />
                <Label htmlFor={`${namePrefix}-all-time`}>Toàn thời gian</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="custom" id={`${namePrefix}-custom-radio`} />
                <div className="flex w-full items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !selectedDateRange?.from && 'text-muted-foreground'
                        )}
                        onClick={() => setValue(optionFieldName, 'custom')}
                        disabled={selectedOption !== 'custom'}
                      >
                        {selectedDateRange?.from ? (
                          selectedDateRange.to ? (
                            <>
                              {format(selectedDateRange.from, dateFormat)} -{' '}
                              {format(selectedDateRange.to, dateFormat)}
                            </>
                          ) : (
                            format(selectedDateRange.from, dateFormat)
                          )
                        ) : (
                          <span>Chọn khoảng ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="range"
                        selected={selectedDateRange}
                        onSelect={(range) =>
                          setValue(customFieldName, { from: range?.from || new Date(), to: range?.to })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </RadioGroup>
          </FormItem>
        )}
      />
    </div>
  );
}
