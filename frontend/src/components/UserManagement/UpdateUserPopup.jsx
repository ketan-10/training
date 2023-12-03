import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as z from 'zod';
import request from '../../utils/axios.config';
import LogoLoader from '../Common/LogoLoader';
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
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const formSchema = z.object({
  email: z.string(),
  name: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
});

const UpdateUserPopup = ({ id, setShowDialog }) => {
  const { data: thisUser, isLoading } = useQuery(`/api/users/${id}`, () =>
    request(`/api/users/${id}`)
  );

  if (isLoading) {
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );
  }
  return (
    <UpdateUserFrom
      defaultValue={thisUser?.data}
      setShowDialog={setShowDialog}
      id={id}
    />
  );
};

const UpdateUserFrom = ({ defaultValue, setShowDialog, id }) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue,
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      return request.put(`/api/users/${id}`, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries('/api/users');
      setShowDialog(false);
    },
    onError: (err) => {
      form.setError('email', {
        type: 'server',
        message: err?.response?.data?.message ?? 'Registration Failed',
      });
    },
  });

  const handleSubmit = async (values) => {
    await mutation.mutate(values);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <Form {...form}>
          <form
            key={id}
            className="max-h-[55vh] overflow-auto w-full flex flex-col gap-2 p-3"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormDescription>Please Entre your email id.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>Please Entre your name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="REQUESTER">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select role</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <Button
        type="submit"
        className="w-full"
        onClick={form.handleSubmit(handleSubmit)}
      >
        Edit User
      </Button>
    </>
  );
};

export default UpdateUserPopup;
