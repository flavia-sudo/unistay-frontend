import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import * as yup from 'yup';
import { usersAPI } from '../features/userAPI';
import { toast } from 'sonner';

type VerifyInputs = {
    email: string;
    code: string;
};

const schema = yup.object({
    email: yup.string().email('Invalid email').max(100,'Max 100 characters').required('Email is required'),
    code: yup
    .string()
    .matches(/^\d{6}$/, 'Code must be 6 digit number')
    .required('Verification code is required'),
});

const VerifyUser = () => {
    const [verifyUser] = usersAPI.useVerifyUserMutation()
    const location = useLocation()
    const navigate = useNavigate();
    const emailFormState = location.state?.email || ''
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: emailFormState
        }
    });

    const onSubmit: SubmitHandler<VerifyInputs> = async (data) => {
        console.log('Verification data', data);
        try {
            const response = await verifyUser(data).unwrap()
            console.log("Verification", response);
            toast.success("Verification successful!");
            navigate('/login', {
                state: {
                    email: data.email
                }
            }
            )
        }catch (error) {
            console.log("errorr", error);
            toast.error("Verification failed. Please try again later.");
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-100 p-4">
        <div className="max-w-lg w-full rounded-xl shadow-lg bg-gray-200">
                <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-yellow-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                </div>
                <h1 className='text-2xl font-semibold mb-6 text-center text-gray-700'>Verify Your Account</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                <div className="flex flex-col gap-4"></div>
                {/* email */}
                <div className="form-control">
                <label className="label">
                <span className="label-text text-gray-700 font-medium">Email Address</span>
                </label>
                <input
                    type="email"
                    {...register('email')}
                    placeholder="Email"
                    className="input w-full pl-10 pr-10 py-4 text-gray-800 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    readOnly={!!emailFormState}
                    />
                    { errors.email && (
                        <span className="text-red-700 text-sm">{errors.email.message}</span>
                    )}
                </div>

                    {/* code */}
                <div className="form-control">
                <label className="label">
                <span className="label-text text-gray-700 font-medium">Verification Code</span>
                </label>
                <input
                    type="text"
                    {...register('code')}
                    placeholder="6 Digit Code"
                    maxLength={6}
                    className="input w-full pl-10 pr-10 py-4 text-gray-800 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    />
                    { errors.code && (
                        <span className="text-red-700 text-sm">{errors.code.message}</span>
                    )}
                    </div>

                    <button
                    type="submit"
                    className="btn btn-primary w-full mt-4"
                    >
                    Verify
                    </button>
            </form>

        </div>
    </div>
  )
}

export default VerifyUser