// ... existing code ...
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    // Always prefer localStorage for persistence
    return localStorage.getItem('authToken');
  });
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Start with true to indicate initial validation is pending
  const [error, setError] = useState(null);

  const logout = useCallback(async () => {
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    // No longer using sessionStorage for the token
    setLogoutLoading(false);
  }, []);

  const validateSession = useCallback(async () => {
    if (authLoading && user) return; // Avoid re-validating

    setAuthLoading(true);
    // Only check localStorage for the token
    const existingToken = localStorage.getItem('authToken');

    if (!existingToken) {
      setUser(null);
      setToken(null);
      setAuthLoading(false);
      return;
    }

    try {
      const status = await getVendorStatus();
      if (status.is_login) {
        const profileData = await getVendorProfile();
        setUser({
          ...profileData,
          is_seller: status.is_seller,
          role: status.is_seller ? 'vendor' : 'shop',
        });
        // If there's a token in storage but not in state, set it.
        if (!token) {
          setToken(existingToken);
        }
      } else {
        // If backend says we are not logged in, clear everything.
        await logout();
      }
    } catch (err) { 
      // Any error during validation should result in a logged-out state.
      console.error("Session validation failed", err);
      await logout();
    } finally {
      setAuthLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    validateSession();
    setLoading(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on initial component mount

  const login = async (credentials, rememberMe) => {
    try {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = { user, token, loading, logoutLoading, error, authLoading, vendorStatus, login, logout, validateSession };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};