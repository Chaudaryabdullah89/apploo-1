import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

const GoogleAuthButton = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      console.log('Google login successful, redirecting to backend...');
      // Redirect to backend Google auth endpoint
      window.location.href = `${import.meta.env.VITE_API_URL}/api/users/google`;
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Google authentication failed. Please try again.');
    }
  };

  const handleError = (error) => {
    console.error('Google login error:', error);
    toast.error('Google authentication failed. Please try again.');
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="filled_blue"
        shape="rectangular"
        text="continue_with"
        locale="en"
        flow="implicit"
      />
    </div>
  );
};

export default GoogleAuthButton; 