import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';

const Login = () => {
    const { signIn, googleSignIn, logOut } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || "/";
    const [error, setError] = useState('');

    const handleLogin = event => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        signIn(email, password)
            .then(result => {
                const user = result.user;
                if (!user.emailVerified) {
                    logOut();
                    setError("⚠️ Email not verified! Please check your inbox.");
                    return;
                }
                setError('');
                form.reset();
                navigate(from, { replace: true });
            })
            .catch(err => {
                console.error(err);
                setError("Invalid email or password.");
            })
    }

    const handleGoogleLogin = () => {
        googleSignIn()
            .then(result => {
                navigate(from, { replace: true });
            })
            .catch(error => setError(error.message));
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="card lg:card-side bg-base-100 shadow-2xl max-w-4xl w-full overflow-hidden">
                
                {/* Left Side - Image/Illustration */}
                <div className="lg:w-1/2 bg-indigo-600 flex flex-col justify-center items-center text-white p-10 relative">
                    {/* Decorative Circles */}
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                    
                    <img 
                        src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?w=740&t=st=1708456683~exp=1708457283~hmac=685d6b412574636259062319083321" 
                        alt="Login Illustration" 
                        className="rounded-xl shadow-lg mb-6 w-3/4 mix-blend-overlay"
                    />
                    <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                    <p className="text-indigo-200 text-center">Access your course materials and continue your learning journey.</p>
                </div>

                {/* Right Side - Form */}
                <div className="card-body lg:w-1/2 p-10">
                    <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Student Login</h2>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Email Address</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </span>
                                <input type="email" name="email" placeholder="student@example.com" className="input input-bordered w-full pl-10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" required />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <input type="password" name="password" placeholder="••••••" className="input input-bordered w-full pl-10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" required />
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover text-indigo-600">Forgot password?</a>
                                </label>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="alert alert-error shadow-lg py-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-control mt-6">
                            <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg w-full">Login</button>
                        </div>
                    </form>

                    <div className="divider text-sm text-gray-500">OR</div>

                    <button onClick={handleGoogleLogin} className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-300 w-full flex items-center gap-2">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        Continue with Google
                    </button>

                    <p className='mt-6 text-center text-sm'>
                        Don't have an account? <Link className='text-indigo-600 font-bold hover:underline' to="/signup">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;