import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PasswordInput } from '@/components/password-input';

const loginFormSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof loginFormSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { mutate: login, isLoading } = useMutation(
    ['login'],
    async (data: LoginForm) => await axios.post('/api/v1/auth/login', data),
    {
      onSuccess: (res) => {
        if (res.data.status === 'success') {
          queryClient.invalidateQueries(['profile']);
          toast.success('Logged in successfully');
          navigate('/', { replace: true });
        }
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data.message ?? err.message);
        }
      },
    },
  );

  return (
    <div className="container mx-auto">
      <div className="min-h-screen grid place-items-center">
        <Card className="w-[360px] mt-10">
          <CardHeader>
            <CardTitle>Log in to Innomarkt Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="grid gap-4"
                onSubmit={(...args) =>
                  form.handleSubmit((data) => login(data))(...args)
                }
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="user" {...field} />
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
                        <PasswordInput placeholder="**********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Log in'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
