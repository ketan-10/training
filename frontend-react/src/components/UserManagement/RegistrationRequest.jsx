import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import React, { useState } from 'react';
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
import { ToastAction } from '../ui/toast';
import { toast } from '../ui/use-toast';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(50),
  name: z.string().optional().nullable(),
  role: z.string().nullable(),
});

const RegistrationRequest = ({ isRegPopupOpen, setRegPopupOpen }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      return request.post('/api/auth/registration-request', data);
    },
    onSuccess: (response) => {
      toast({
        title: 'Your request is pending for approval',
        description: `Once admin approves, you will be able to login with your credential`,
        action: <ToastAction altText="alt Text">Dismiss</ToastAction>,
        duration: 20000,
      });
      setRegPopupOpen(false);
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
    <Dialog open={isRegPopupOpen} onOpenChange={setRegPopupOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request For Registration</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col justify-center items-center">
          <Form {...form}>
            <form className="max-h-[55vh] overflow-auto w-full flex flex-col gap-2 p-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
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
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationRequest;
