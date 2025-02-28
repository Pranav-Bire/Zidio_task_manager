import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import Textbox from '../components/Textbox';
import Button from '../components/Button';
import { toast } from 'sonner';
import axios from 'axios';

const Signup = () => {
    const user = "";
    const {
        register, 
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm();

    const navigate = useNavigate();

    const submitHandler = async (data) => {
        try {
            const response = await axios.post('http://localhost:8800/api/user/register', {
                email: data.email,
                name: data.fullName,
                password: data.password,
                confirmPassword: data.confirmPassword,
                isAdmin: false,
                role: "User",
                title: "Team Member",
                isActive: true
            });

            if (response.status === 200 || response.status === 201) {
                toast.success("Account created successfully!");
                navigate('/log-in');
            } else {
                toast.error(response.data?.message || "Failed to create account");
            }
        } catch (error) {
            if (error.response?.status === 200 || error.response?.status === 201) {
                toast.success("Account created successfully!");
                navigate('/log-in');
            } else {
                const errorMessage = error.response?.data?.message || "Failed to create account";
                toast.error(errorMessage);
            }
        }
    };

    useEffect(() => {
        user && navigate('/dashboard');
    }, [user]);

    return (
        <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
            <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
                <div className='h-full w-full lg:w-2/3 flex-col items-center justify-center'>
                    {/* left side */}
                    <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-4 2xl:-mt-20'>
                        <span className='inline-flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600'>
                            Join our task management platform</span>

                        <p className='flex flex-col gap-2 font-black text-center text-blue-700'>
                            <span className='text-3xl md:text-5xl 2xl:text-6xl'>Create Account</span>
                            <span className='text-4xl md:text-6xl 2xl:text-7xl'>Zidio Task Manager</span>
                        </p>

                        <div className='cell'>
                            <div className='circle rotate-in-up-left'></div>
                        </div>
                    </div>
                </div>

                <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col items-center justify-center'>
                    {/* right side */}
                    <form 
                        onSubmit={handleSubmit(submitHandler)}
                        className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
                    >
                        <div>
                            <p className='text-blue-600 font-bold text-3xl text-center'>Get Started</p>
                            <p className='text-center text-base text-gray-700'>Create your account to continue</p>
                        </div>

                        <div className='flex flex-col gap-y-5'>
                            <Textbox
                                placeholder='Full Name'
                                type='text'
                                name='fullName'
                                label='Full Name'
                                className='w-full rounded-full'
                                register={register('fullName', {
                                    required: "Full name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Name must be at least 3 characters"
                                    }
                                })}
                                error={errors.fullName?.message}
                            />

                            <Textbox
                                placeholder='email@example.com'
                                type='email'
                                name='email'
                                label='Email Address'
                                className='w-full rounded-full'
                                register={register('email', {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                error={errors.email?.message}
                            />

                            <Textbox
                                placeholder='Your password'
                                type='password'
                                name='password'
                                label='Password'
                                className='w-full rounded-full'
                                register={register('password', {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                error={errors.password?.message}
                            />

                            <Textbox
                                placeholder='Confirm your password'
                                type='password'
                                name='confirmPassword'
                                label='Confirm Password'
                                className='w-full rounded-full'
                                register={register('confirmPassword', {
                                    required: "Please confirm your password",
                                    validate: (val) => {
                                        if (watch('password') !== val) {
                                            return "Passwords do not match";
                                        }
                                    }
                                })}
                                error={errors.confirmPassword?.message}
                            />

                            <Button
                                type='submit'
                                label='Create Account'
                                className='w-full h-10 bg-blue-700 text-white rounded-full'
                            />

                            <p className='text-center text-gray-600 text-sm'>
                                Already have an account?{' '}
                                <Link to="/log-in" className='text-blue-600 hover:underline'>
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
