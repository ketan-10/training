import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { STEP_2 } from '..';
import FileUpload from '../../../../components/FileUpload';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/Form/Form';
import { Button } from '../../../../components/ui/button';
import { Calendar } from '../../../../components/ui/calendar';
import { Input } from '../../../../components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';
import { cn } from '../../../../utils';
import { useRequestFormGlobal } from './RequestFormGlobalProvider';

const CATEGORY = [
  {
    name: 'Education',
    children: [
      {
        name: 'Cource',
      },
      {
        name: 'One time',
      },
    ],
  },
  {
    name: 'Talk',
    children: [
      {
        name: 'Developer Blog',
      },
      {
        name: 'Ed talk',
      },
    ],
  },
  {
    name: 'Social',
  },
];

const formSchema = z.object({
  trainingName: z.string().min(2).max(50),
  description: z.string().max(250).optional().nullable(),
  participantsCount: z.number().optional().nullable(),
  urgency: z.string().optional().nullable(),
  mode: z.string(),
  type: z.string().optional().nullable(),
  otherTrainingEvent: z.string().optional().nullable(),
  category: z.string(),
  categorySub: z.string().optional().nullable(),
  trainingScope: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  syllabusFilePath: z.string().optional().nullable(),
  comments: z
    .array(
      z.object({
        value: z.string().min(2).max(150),
      })
    )
    .optional(),
});

const Step1 = ({ setPage, ticketId }) => {
  const [formState, setFormState] = useRequestFormGlobal();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formState,
  });

  // console.log('Form Errors: ', form.formState.errors);

  const handleSubmit = async (values) => {
    setFormState({ ...formState, ...values });
    setPage(STEP_2);
  };

  const { fields, append } = useFieldArray({
    name: 'comments',
    control: form.control,
  });

  const [isTrainingTypeOther, setTrainingTypeOther] = useState(
    formState?.type === 'OTHERS'
  );
  const [selectedBU, setSelectedBU] = useState(
    CATEGORY.find((x) => x.name === formState?.category)
  );

  return (
    <div className="flex gap-5 flex-wrap justify-evenly mt-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 w-full max-w-4xl bg-white py-7 px-4 md:px-20"
        >
          <FormField
            control={form.control}
            name="trainingName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Training Name</FormLabel>
                <FormControl>
                  <Input placeholder="my training" {...field} />
                </FormControl>
                <FormDescription>
                  Please specify a name for the training.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit more about this training"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please describe the training for quick approval.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="participantsCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. Of Participants</FormLabel>
                <FormControl>
                  <Input
                    placeholder="count.."
                    {...{
                      ...field,
                      ...{
                        onChange: (e) => {
                          field.onChange(parseInt(e.target.value) ?? undefined);
                        },
                      },
                    }}
                    type="number"
                  />
                </FormControl>
                <FormDescription>
                  Please specify participant count.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Priority for the training" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="P1">High</SelectItem>
                    <SelectItem value="P2">Medium</SelectItem>
                    <SelectItem value="P3">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Priority will help us schedule trainings effectively.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mode</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mode of the training" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PHYSICAL">Physical</SelectItem>
                    <SelectItem value="VIRTUAL">Virtual</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Please describe if the training will be physical or virtual.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-0 flex-grow">
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(e) => {
                      setSelectedBU(CATEGORY.find((x) => x.name === e));
                      form.resetField('categorySub');
                      form.setValue('categorySub', undefined);
                      return field.onChange(e);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORY.map((bu) => (
                        <SelectItem key={bu.name} value={bu.name}>
                          {bu.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    In which of the following category does this training
                    belongs?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedBU?.children && selectedBU?.children?.length ? (
              <FormField
                key={selectedBU?.children}
                control={form.control}
                name="categorySub"
                render={({ field }) => (
                  <FormItem className="w-0 flex-grow">
                    <FormLabel>Category Sub Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category sub type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedBU?.children.map((bu) => (
                          <SelectItem key={bu.name} value={bu.name}>
                            {bu.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Please select the category sub type
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </div>
          <FormField
            control={form.control}
            name="trainingScope"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Training Scope</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a training scope" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TECHNICAL">Technical</SelectItem>
                    <SelectItem value="NON_TECHNICAL">Non Technical</SelectItem>
                    <SelectItem value="BEHAVIOURAL">Behavioural</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  In which of the following category this training belongs?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Training Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a training level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCE">Advance</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Please specify the difficulty of the training.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => {
              // cast default value to Date.
              // debugger;
              // field.value ?? field.onChange(new Date(field.value));
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
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
                            new Date(field.value).toLocaleDateString('in')
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
                        onSelect={(e) => field.onChange(e.toISOString())}
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

          <FormField
            control={form.control}
            name="syllabusFilePath"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Upload Training Content</FormLabel>
                <FileUpload
                  initialValue={field.value}
                  onChange={field.onChange}
                />
                <FormDescription>
                  Please Upload Training Content for this training.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {!!ticketId && (
            <div>
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`comments.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && 'sr-only')}>
                        Comments
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && 'sr-only')}>
                        Add links to your website, blog, or social media
                        profiles.
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="link"
                size="sm"
                className="mt-1"
                onClick={() => append({ value: '' })}
              >
                Add Comments
              </Button>
            </div>
          )}
          <div className="flex justify-end">
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Step1;
