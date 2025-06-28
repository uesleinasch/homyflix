import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, type RegisterFormData } from '../../core/auth/schemas/authSchemas';
import { useAuth } from '../../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, registerUser } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerUser(data);
    
    if (!result.success) {
      setError('root', {
        type: 'manual',
        message: result.error || 'Ocorreu um erro ao registrar.',
      });
    }
  };

  return (
    <div>
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" {...register('name')} />
          {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" {...register('email')} />
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" {...register('password')} />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="password_confirmation">Confirm Password:</label>
          <input type="password" id="password_confirmation" {...register('password_confirmation')} />
          {errors.password_confirmation && <p style={{ color: 'red' }}>{errors.password_confirmation.message}</p>}
        </div>

        {errors.root && <p style={{ color: 'red' }}>{errors.root.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      <Link to="/login">
        <button>Ir para login</button>
      </Link>
    </div>
  );
};

export default RegisterPage;
