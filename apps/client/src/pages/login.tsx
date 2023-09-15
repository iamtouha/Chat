import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
} from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof loginFormSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
  });

  const { mutate: login, isLoading } = useMutation(
    ['login'],
    async (data: LoginForm) => await axios.post('/api/v1/auth/login', data),
    {
      onSuccess: (res) => {
        if (res.data.status === 'success') {
          toast.success('Logged in successfully');
          navigate('/');
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
    <div className="container mx-auto p-2">
      <div className="h-full grid place-items-center">
        <form onSubmit={handleSubmit((data) => login(data))}>
          <Card className="w-[360px] mt-10">
            <CardHeader>
              <h2 className="font-bold">Log in to Innomarkt Chat</h2>
            </CardHeader>
            <CardBody>
              <Input
                size={'sm'}
                type="email"
                label="Email"
                className="mb-3"
                errorMessage={errors.email?.message}
                {...register('email')}
              />
              <Input
                size={'sm'}
                type="password"
                label="Password"
                errorMessage={errors.password?.message}
                {...register('password')}
              />
            </CardBody>
            <CardFooter>
              <Button
                color="primary"
                size="lg"
                type="submit"
                isLoading={isLoading}
              >
                Submit
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};
