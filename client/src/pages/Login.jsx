import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Textbox from '../components/Textbox';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../redux/slices/api/authApiSlice';
import { toast } from 'sonner';
import { setCredentials } from '../redux/slices/authSlice';
import Loading from '../components/Loader';

const Login = () => {
    const {user} = useSelector((state) => state.auth);
    const {
        register, 
        handleSubmit, 
        formState: {errors},
    } = useForm();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login,{isLoading}] = useLoginMutation();
      
    const submitHandler = async (data) => {
            try{
                const result = await login(data).unwrap();
                dispatch(setCredentials(result));
                navigate('/');
                

            }catch (error){
                console.log(error);
                toast.error(error?.data?.message || error.message);

            }
    };

    console.log(user);

    useEffect(() => {
        user && navigate('/dashboard');
        },[user]);



    return (
        <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
            <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
            
            <div className='h-full w-full lg:w-2/3 flex-col items-center justify-center'>
                    {/* left side */}

                    <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-4 2xl:-mt-20'>

                        <span className='inline-flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600'>
                            Manage all task in one place!</span>

                        <p className='flex flex-col gap-2 font-black text-center text-blue-700'>

                            <span className='text-3xl md:text-5xl 2xl:text-6xl'>Welcome to</span>
                            <span className='text-4xl md:text-6xl 2xl:text-7xl'>Zidio Task Manager</span>

                        </p>

                        <div className='cell'>
                            <div className='circle rotate-in-up-left'></div>
                        </div>
                    </div>
            </div>
                    

            <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col items-center justify-center'>
                {/* right side */}

             <form onSubmit={handleSubmit(submitHandler)}

             className='form-conatiner w-full  md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'>

                <div className=''>
                   <p className='text-blue-600 font-bold text-3xl text-center'>welcome back</p>

                   <p className='text-center text-base text-gray-700'> keep all your crediantials safe </p>
                </div>
                <div className='flex flex-col gap-y-5'>
                            <Textbox
                                placeholder='email@example.com'
                                type='email'
                                name='email'
                                label='Email Address'
                                className='w-full rounded-full'
                                register={register('email',
                                    {required: "Email is required",}
                                )}

                                error = {errors.email ? errors.email.message : ""}
                            />

                           <Textbox
                                placeholder='your password'
                                type='password'
                                name='password'
                                label='Password'
                                className='w-full rounded-full'
                                register={register("password", 
                                    {required: "Password is required!",}
                                )}
                               
                                error={errors.password ? errors.password.message : ""}
                           />                
                        <span className='text-gray-500 text-sm hover:text-blue-600 hover:underline cursor-pointer'>
                            Forget Password?
                        </span>

                    {isLoading ?(<Loading/>): (<Button
                    type='submit'
                    label='submit'
                    className='w-full h-10 bg-blue-700 text-white rounded-full'
                    />)}

                        <p className='text-center text-gray-600 text-sm'>
                            Don't have an account?{' '}
                            <Link to="/signup" className='text-blue-600 hover:underline'>
                                Sign up
                            </Link>
                        </p>
                </div>
             </form>

            </div>


        </div>
    </div>
    );
};

export default Login;