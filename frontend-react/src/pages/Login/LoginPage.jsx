import { useAuth } from '../../components/Auth/AuthProvider';

import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/Form/Form';
import RegistrationRequest from '../../components/UserManagement/RegistrationRequest';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import request from '../../utils/axios.config';
import LogoLoader from '../../components/Common/LogoLoader';
import Logo from '/logo.svg';

const formSchema = z.object({
  // Temporary solution for email bcz it is not taking the ncs email formate.
  email: z.string().email(),
  password: z.string().min(3).max(50),
});

export default function LoginPage() {
  const { setUser } = useAuth();

  const [isRegPopupOpen, setRegPopupOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'admin@gmail.com',
      password: 'admin',
    },
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => {
      return request.post(`/api/auth/login`, data);
    },
    onSuccess: (response) => {
      setUser(response.data);
      return navigate('/');
    },
    onError: (err) => {
      form.setError('password', {
        type: 'server',
        message: err?.response?.data?.message ?? 'Login Failed',
      });
    },
  });

  const handleSubmit = async (values) => {
    // console.log(values);

    await mutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen">
      <div className="min-h-full flex-grow-[3] w-0 flex justify-center p-3">
        <div className="h-10 absolute top-5 left-5">
          <img className="object-contain h-full" src={Logo} />
        </div>
        <div className="flex flex-col justify-center items-center min-w-full">
          <div
            id="application-title"
            className="mb-4 text-3xl font-extrabold text-center"
          >
            My Training Portal
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 max-w-sm w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
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
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setRegPopupOpen(true)}
              >
                Register
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="bg-blue-50 min-h-full flex-grow-[2] w-0 p-3 hidden md:block">
        <LogoLoader isAnimating={false} />
      </div>
      <RegistrationRequest {...{ isRegPopupOpen, setRegPopupOpen }} />
    </div>
  );
}
