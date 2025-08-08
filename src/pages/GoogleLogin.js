import React from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const GoogleLogin = () => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => console.log(codeResponse),
    flow: "auth-code",
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg font-semibold text-md hover:bg-red-700 transition-colors"
    >
      Sign in with Google 🚀
    </button>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId="189626540628-goi86smbh3m8slu6i3pdka007kkvim09.apps.googleusercontent.com">
      <GoogleLogin />
    </GoogleOAuthProvider>
  );
};

export default App;
