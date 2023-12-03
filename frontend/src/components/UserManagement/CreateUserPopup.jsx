import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import * as z from 'zod';
import request from '../../utils/axios.config';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(50),
  name: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
});

const CreateUserPopup = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      return request.post('/api/users', data);
    },
    onSuccess: (response) => {
      alert(response.data);
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
    <Dialog>
      <DialogTrigger>
        <Button
          variant="default"
          type="input"
          size="sm"
          className="ml-2 hidden h-8 lg:flex"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center">
          <Form {...form}>
            <form
              className="max-h-[55vh] overflow-auto w-full flex flex-col gap-2 p-3"
              autoComplete="false"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email"
                        autocomplete="false"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please Entre your email id.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        autocomplete="new-password"
                        {...field}
                      />
                    </FormControl>
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
        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={form.handleSubmit(handleSubmit)}
          >
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserPopup;
