import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '../../utils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../Form/Form';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { TimeField } from '../ui/time-field';

const WEEKDAYS = [
  {
    id: 0,
    label: 'Sunday',
  },
  {
    id: 1,
    label: 'Monday',
  },
  {
    id: 2,
    label: 'Tuesday',
  },
  {
    id: 3,
    label: 'Wednesday',
  },
  {
    id: 4,
    label: 'Thursday',
  },
  {
    id: 5,
    label: 'Friday',
  },
  {
    id: 6,
    label: 'Saturday',
  },
];

const isRangeValid = (data) => {
  return data && data.from && data.to;
};

const parseTimeToToday = (time) => {
  return new Date(new Date().toDateString() + ' ' + time.toLocaleString());
};

const customValidation = async (data) => {
  const errors = [];

  if (!data['start-time']) {
    errors.push({
      field: 'start-time',
      message: 'start time is mandatory',
    });
  }

  if (!data['end-time']) {
    errors.push({
      field: 'end-time',
      message: 'end time is mandatory',
    });
  }

  if (data['start-time'] && data['end-time']) {
    const startTime = parseTimeToToday(data['start-time']);
    const endTime = parseTimeToToday(data['end-time']);

    if (endTime < startTime) {
      errors.push({
        field: 'end-time',
        message: 'end time must be greater than start time',
      });
    }
  }

  switch (data['recurrence']) {
    case 'recurrent':
      switch (data['occurrence']) {
        case 'every-day':
          !isRangeValid(data['every-day']) &&
            errors.push({
              field: 'every-day',
              message: 'date is mandatory',
            });
          break;
        case 'on-weekdays':
          !isRangeValid(data['on-weekdays']) &&
            errors.push({
              field: 'on-weekdays',
              message: 'date is mandatory',
            });
          break;
        case 'on-weekends':
          !isRangeValid(data['on-weekends']) &&
            errors.push({
              field: 'on-weekends',
              message: 'date is mandatory',
            });
          break;
        case 'specific-week-days':
          !isRangeValid(data['specific-week-days']) &&
            errors.push({
              field: 'specific-week-days',
              message: 'date is mandatory',
            });
          break;
        case 'custom':
          !(data['custom'] && data['custom'].length) &&
            errors.push({
              field: 'custom',
              message: 'At least one date must be selected.',
            });
          break;
        default:
          errors.push({
            field: 'occurrence',
            message: 'invalid occurrence',
          });
      }
      break;
    case 'one-time':
      !data['one-time'] &&
        errors.push({
          field: 'one-time',
          message: 'date is mandatory',
        });
      break;
    default:
      errors.push({
        field: 'recurrence',
        message: 'can not be empty',
      });
  }

  return {
    values: data,
    errors: errors.reduce((acc, v) => {
      return {
        ...acc,
        [v.field]: {
          type: 'validation',
          message: v.message,
        },
      };
    }, {}),
  };
};

const ScheduleTraining = ({ setShowSchedule, handlePopupSubmit }) => {
  const form = useForm({
    resolver: customValidation,
  });

  const [recurrence, setRecurrence] = useState(null);
  const [occurrence, setOccurrences] = useState(null);
  const [weeks, setSelectedWeeks] = useState(
    WEEKDAYS.map((w) => ({ ...w, isChecked: false }))
  );

  const onWeekSelectedChange = (id, isChecked) => {
    const value = weeks.find((w) => w.id == id);
    value.isChecked = isChecked;
    const newWeeks = weeks.filter((w) => w.id != id);
    newWeeks.push(value);
    setSelectedWeeks(newWeeks);
  };

  const handleSubmit = (values) => {
    console.log('Submit: ', values);
    let events = [];

    const startTime = values['start-time'].toLocaleString();
    const endTime = values['end-time'].toLocaleString();

    if (values['recurrence'] == 'one-time') {
      const date = values['one-time'].toLocaleDateString();
      events.push({
        start: new Date(date + ' ' + startTime),
        end: new Date(date + ' ' + endTime),
      });
    } else if (values['recurrence'] == 'recurrent') {
      if (
        [
          'every-day',
          'on-weekdays',
          'on-weekends',
          'specific-week-days',
        ].includes(values['occurrence'])
      ) {
        const startDate =
          values[values['occurrence']].from.toLocaleDateString();
        const endDate = values[values['occurrence']].to.toLocaleDateString();
        let currentEvent = new Date(startDate + ' ' + startTime);

        while (
          new Date(currentEvent.toLocaleDateString()) <= new Date(endDate)
        ) {
          events.push({
            start: currentEvent,
            end: new Date(currentEvent.toDateString() + ' ' + endTime),
          });
          currentEvent = new Date(currentEvent);
          currentEvent.setDate(currentEvent.getDate() + 1);
        }
        if (values['occurrence'] == 'specific-week-days') {
          events = events.filter((e) =>
            weeks
              .filter((w) => w.isChecked)
              .map((w) => w.id)
              .includes(e.start.getDay())
          );
        } else if (values['occurrence'] == 'on-weekdays') {
          events = events.filter((e) =>
            [1, 2, 3, 4, 5].includes(e.start.getDay())
          );
        } else if (values['occurrence'] == 'on-weekends') {
          events = events.filter((e) => [0, 6].includes(e.start.getDay()));
        }
      } else if (values['occurrence'] == 'custom') {
        events = values['custom'].map((d) => {
          const thisDate = d.toLocaleDateString();
          return {
            start: new Date(thisDate + ' ' + startTime),
            end: new Date(thisDate + ' ' + endTime),
          };
        });
      }
    }
    console.log('Events: ', events);
    handlePopupSubmit(events);
  };

  const className =
    'aria-selected:text-muted-foreground aria-selected:opacity-50 aria-selected:bg-red-50';
  return (
    <div className="flex flex-col justify-center items-center pt-3 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
          <div className="flex flex-col gap-4">
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="start-time"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Please select start time.</FormLabel>
                    <TimeField
                      aria-label="start-time"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormDescription>
                      At what time will the training start.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end-time"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Please select end time.</FormLabel>
                    <TimeField
                      aria-label="end-time"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormDescription>
                      At what time the training will end.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="recurrence"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>
                    Is training recurrent or for a single day?
                  </FormLabel>
                  <Select
                    onValueChange={(e) => {
                      setRecurrence(e);
                      field.onChange(e);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      <SelectItem value="one-time">One Time</SelectItem>
                      <SelectItem value="recurrent">Recurring</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Is training recurrent or for a single day?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {recurrence === 'recurrent' ? (
              <>
                <FormField
                  control={form.control}
                  name="occurrence"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Select Occurrence</FormLabel>
                      <Select
                        onValueChange={(e) => {
                          setOccurrences(e);
                          field.onChange(e);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper">
                          <SelectItem value="every-day">Every Day</SelectItem>
                          <SelectItem value="on-weekdays">
                            On Weekdays
                          </SelectItem>
                          <SelectItem value="on-weekends">
                            On Weekends
                          </SelectItem>
                          <SelectItem value="specific-week-days">
                            Specific week days
                          </SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Select Occurrence</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {occurrence === 'every-day' ? (
                  <FormField
                    control={form.control}
                    name="every-day"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>Select Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-[240px] pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field?.value?.from ? (
                                    field?.value?.to ? (
                                      <>
                                        {format(
                                          field?.value?.from,
                                          'LLL dd, y'
                                        )}{' '}
                                        -{' '}
                                        {format(field?.value?.to, 'LLL dd, y')}
                                      </>
                                    ) : (
                                      format(field?.value?.from, 'LLL dd, y')
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="range"
                                defaultMonth={new Date()}
                                selected={field.value}
                                onSelect={field.onChange}
                                numberOfMonths={2}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Please Specify start date for this training.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                ) : null}

                {occurrence === 'on-weekdays' ? (
                  <FormField
                    control={form.control}
                    name="on-weekdays"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>Select Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-[240px] pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field?.value?.from ? (
                                    field?.value?.to ? (
                                      <>
                                        {format(
                                          field?.value?.from,
                                          'LLL dd, y'
                                        )}{' '}
                                        -{' '}
                                        {format(field?.value?.to, 'LLL dd, y')}
                                      </>
                                    ) : (
                                      format(field?.value?.from, 'LLL dd, y')
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="range"
                                defaultMonth={new Date()}
                                selected={field.value}
                                onSelect={field.onChange}
                                numberOfMonths={2}
                                disabled={[{ dayOfWeek: [0, 6] }]}
                                weekStartsOn={1}
                                initialFocus
                                modifiers={{
                                  disableSomeDates: {
                                    dayOfWeek: [0, 6],
                                  },
                                }}
                                modifiersClassNames={{
                                  disableSomeDates: cn(className),
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Please Specify start date for this training.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                ) : null}

                {occurrence === 'on-weekends' ? (
                  <FormField
                    control={form.control}
                    name="on-weekends"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>Select Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-[240px] pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field?.value?.from ? (
                                    field?.value?.to ? (
                                      <>
                                        {format(
                                          field?.value?.from,
                                          'LLL dd, y'
                                        )}{' '}
                                        -{' '}
                                        {format(field?.value?.to, 'LLL dd, y')}
                                      </>
                                    ) : (
                                      format(field?.value?.from, 'LLL dd, y')
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="range"
                                defaultMonth={new Date()}
                                selected={field.value}
                                onSelect={field.onChange}
                                numberOfMonths={2}
                                disabled={[{ dayOfWeek: [1, 2, 3, 4, 5] }]}
                                weekStartsOn={1}
                                initialFocus
                                modifiers={{
                                  disableSomeDates: {
                                    dayOfWeek: [1, 2, 3, 4, 5],
                                  },
                                }}
                                modifiersClassNames={{
                                  disableSomeDates: cn(className),
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Please Specify start date for this training.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                ) : null}

                {occurrence === 'specific-week-days' ? (
                  <div className="flex gap-10">
                    <div className="flex gap-3 flex-col px-10">
                      {weeks
                        .sort((a, b) => a.id - b.id)
                        .map((w) => (
                          <div
                            key={w.id}
                            className="flex items-center space-x-2"
                          >
                            <Switch
                              id={w.label}
                              checked={w.isChecked}
                              onCheckedChange={(val) => {
                                onWeekSelectedChange(w.id, val);
                              }}
                            />
                            <Label htmlFor={w.label}>{w.label}</Label>
                          </div>
                        ))}
                    </div>

                    <FormField
                      control={form.control}
                      name="specific-week-days"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-col">
                            <FormLabel>Select Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-[240px] pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field?.value?.from ? (
                                      field?.value?.to ? (
                                        <>
                                          {format(
                                            field?.value?.from,
                                            'LLL dd, y'
                                          )}{' '}
                                          -{' '}
                                          {format(
                                            field?.value?.to,
                                            'LLL dd, y'
                                          )}
                                        </>
                                      ) : (
                                        format(field?.value?.from, 'LLL dd, y')
                                      )
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="range"
                                  defaultMonth={new Date()}
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  numberOfMonths={2}
                                  disabled={[
                                    {
                                      dayOfWeek: weeks
                                        .filter((w) => !w.isChecked)
                                        .map((w) => w.id),
                                    },
                                  ]}
                                  weekStartsOn={1}
                                  initialFocus
                                  modifiers={{
                                    disableSomeDates: {
                                      dayOfWeek: weeks
                                        .filter((w) => !w.isChecked)
                                        .map((w) => w.id),
                                    },
                                  }}
                                  modifiersClassNames={{
                                    disableSomeDates: cn(className),
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Please Specify start date for this training.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                ) : null}

                {occurrence === 'custom' ? (
                  <FormField
                    control={form.control}
                    name="custom"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>Select Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-[240px] pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field?.value?.length > 0 ? (
                                    <p>
                                      You selected {field.value.length} day(s).
                                    </p>
                                  ) : (
                                    <p>Please pick one or more days.</p>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="multiple"
                                defaultMonth={new Date()}
                                selected={field.value}
                                onSelect={field.onChange}
                                numberOfMonths={2}
                                weekStartsOn={1}
                                max={50}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <div className="text-sm text-muted-foreground flex flex-col-reverse">
                            {field.value?.map((v) => (
                              <div key={v}>- {format(v, 'LLL dd, y')}</div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                ) : null}
              </>
            ) : null}

            {recurrence === 'one-time' ? (
              <FormField
                control={form.control}
                name="one-time"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Select Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date > new Date('2100-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Please Specify start date for this training.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            ) : null}
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="input"
              variant="secondary"
              onClick={setShowSchedule.bind(null, false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const ScheduleTrainingPopup = ScheduleTraining;

export default ScheduleTrainingPopup;
