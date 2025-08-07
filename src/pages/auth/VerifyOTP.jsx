import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { app } from '../../firebase';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 menit dalam detik
  const [resendDisabled, setResendDisabled] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // Jika tidak ada email, redirect ke login
      navigate('/login');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Timer countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const db = getFirestore(app);
      
      // Cari user berdasarkan email
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('User not found');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Verifikasi OTP
      if (userData.otp !== otp) {
        throw new Error('Invalid OTP code');
      }

      // Cek apakah OTP masih berlaku
      if (userData.otpExpiry.toDate() < new Date()) {
        throw new Error('OTP has expired');
      }

      // Update status verifikasi
      await updateDoc(doc(db, 'users', userDoc.id), {
        isVerified: true,
        otp: null,
        otpExpiry: null
      });

      // Redirect berdasarkan role
      if (userData.role === 'admin') {
        navigate('/dashboard-admin');
      } else {
        navigate('/dashboard-users');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      setResendDisabled(true);
      setCountdown(300); // Reset countdown

      const db = getFirestore(app);
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('User not found');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Generate OTP baru
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // Update OTP di database
      await updateDoc(doc(db, 'users', userDoc.id), {
        otp: newOtp,
        otpExpiry: Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000))
      });

      // Kirim OTP baru via WhatsApp
      await sendOTPviaWhatsApp(userData.noTlp, newOtp);

      // Beri feedback ke user
      setError('New OTP has been sent to your WhatsApp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-[#eb6807]/10 rounded-full flex items-center justify-center mb-4">
            <i className="ri-shield-check-line text-3xl text-[#eb6807]"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Verify Your Account</h1>
          <p className="text-gray-500 mt-2">
            We've sent a 6-digit OTP to your WhatsApp
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-start">
            <i className="ri-error-warning-line mr-2 mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="otp">
              OTP Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-key-2-line text-gray-400"></i>
              </div>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 transition duration-200"
                placeholder="123456"
                maxLength="6"
                required
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              OTP will expire in {formatTime(countdown)}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#eb6807] hover:bg-[#d45e06] text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#eb6807]/50 focus:ring-offset-2"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Verifying...
              </>
            ) : (
              <>
                <i className="ri-check-line mr-2"></i>
                Verify Account
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Didn't receive the code?{' '}
          <button
            onClick={handleResendOTP}
            disabled={resendDisabled || loading}
            className={`font-medium ${resendDisabled ? 'text-gray-400' : 'text-[#eb6807] hover:text-[#d45e06] hover:underline'}`}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}