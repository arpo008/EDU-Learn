import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { updateProfile, sendEmailVerification } from 'firebase/auth';

const SignUp = () => {
    const { createUser, googleSignIn, logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignUp = event => {
        event.preventDefault();
        setSuccess('');
        setError('');
        
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        createUser(email, password)
            .then(result => {
                const user = result.user;
                updateProfile(user, { displayName: name })
                    .then(() => {
                        sendEmailVerification(user)
                            .then(() => {
                                setSuccess(`✅ Account created! We sent a verification link to ${email}. Check your Inbox/Spam.`);
                                logOut();
                                form.reset();
                            });
                    })
                    .catch(err => setError(err.message));
            })
            .catch(error => {
                if(error.message.includes('email-already-in-use')){
                    setError("⚠️ This email is already registered. Please Login.");
                } else {
                    setError(error.message);
                }
            })
    }

    const handleGoogleSignUp = () => {
        googleSignIn()
            .then(result => {
                navigate("/");
            })
            .catch(error => console.error(error));
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="card lg:card-side bg-base-100 shadow-2xl max-w-4xl w-full overflow-hidden">
                
                {/* Left Side - Image */}
                <div className="lg:w-1/2 bg-indigo-600 flex flex-col justify-center items-center text-white p-10 relative">
                     <div className="absolute top-10 right-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
                     <div className="absolute bottom-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                    
                    <img 
                        src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7865.jpg?w=740&t=st=1708456885~exp=1708457485~hmac=a4087961d609259276239105437194d2d466668702b8045958564883584858f9" 
                        alt="SignUp Illustration" 
                        className="rounded-xl shadow-lg mb-6 w-3/4 mix-blend-screen"
                    />
                    <h2 className="text-3xl font-bold mb-2">Join EduLearn</h2>
                    <p className="text-indigo-200 text-center">Start your journey with thousands of free courses and expert tutors.</p>
                </div>

                {/* Right Side - Form */}
                <div className="card-body lg:w-1/2 p-10">
                    <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Create Account</h2>
                    
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Full Name</span>
                            </label>
                            <input type="text" name="name" placeholder="Ex: John Doe" className="input input-bordered w-full focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" required />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Email Address</span>
                            </label>
                            <input type="email" name="email" placeholder="student@example.com" className="input input-bordered w-full focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" required />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                            </label>
                            <input type="password" name="password" placeholder="Min 6 characters" className="input input-bordered w-full focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" required />
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="alert alert-error shadow-sm py-2 text-sm mt-2">
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success shadow-sm py-2 text-sm mt-2">
                                <span>{success}</span>
                            </div>
                        )}

                        <div className="form-control mt-6">
                            <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg w-full">Sign Up Free</button>
                        </div>
                    </form>

                    <div className="divider text-sm text-gray-500">OR</div>

                    <button onClick={handleGoogleSignUp} className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-300 w-full flex items-center gap-2">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        Sign Up with Google
                    </button>

                    <p className='mt-6 text-center text-sm'>
                        Already have an account? <Link className='text-indigo-600 font-bold hover:underline' to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;