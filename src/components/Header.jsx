import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { navbarLinks } from "../data/Data";

export function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);


  // Check for existing user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage or state management
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setShowLoginModal(false);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.log(err)
      setError('Network error occurred');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // Email domain validation
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Check email domain
    if (!email.toLowerCase().endsWith('@ashesi.edu.gh')) {
      setError('Only Ashesi email addresses are allowed');
      return;
    }

    // Password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const formData = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const response = await fetch("/api/auth/signup", {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

      const data = await response.json();

      if (data.success) {
        setShowSignUpModal(false);
        setShowLoginModal(true); // Show login modal after successful signup
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Error details:', err);
      setError('Network error occurred');
    }
  };

  const LoginForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
        <button 
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-red-800">Log In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-800 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );

  const SignUpForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
        <button 
          onClick={() => setShowSignUpModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-red-800">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
              required
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="signup-email"
              name="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
              required
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="signup-password"
              name="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
              required
            />
          </div>
          <div>
            <label htmlFor="signup-confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              id="signup-confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-800 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex-shrink-0">
              <img
                src="/ashesi-logo.png"
                alt="Ashesi logo"
                className="h-16 sm:h-20 w-auto"
              />
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              {/* Dashboard link only for admin users */}
              {user && user.role === 'administrator' && (
                <Link to="/dashboard">
                  <button
                    type="button"
                    className="px-4 py-2 text-red-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Dashboard
                  </button>
                </Link>
              )}

              {!user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowSignUpModal(true)}
                    className="px-4 py-2 text-red-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 text-red-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  <span className="text-red-700 mr-2">
                    {user.email}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 text-white bg-red-800 hover:bg-red-700 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-800"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute w-full shadow-md">
          <div className="flex flex-col items-center space-y-2 py-4">
            {/* Dashboard link only for admin users */}
            {user && user.role === 'administrator' && (
              <Link to="/dashboard" className="w-full text-center">
                <button
                  type="button"
                  className="w-full px-4 py-2 text-red-700 hover:bg-gray-100 transition-colors"
                >
                  Dashboard
                </button>
              </Link>
            )}

            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setShowSignUpModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-red-700 hover:bg-gray-100 transition-colors"
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-red-700 hover:bg-gray-100 transition-colors"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                <span className="text-red-700 mb-2">{user.email}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-white bg-red-800 hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <nav
        className={`bg-red-800 ${
          isMobileMenuOpen ? "block" : "hidden md:block"
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center">
            {navbarLinks.map((link) => (
              <Link
                key={link.id}
                to={`/${link.href}`}
                className={`
                  text-white font-medium px-4 py-3 md:py-4 
                  hover:bg-red-700 transition-colors duration-200
                  ${
                    link.id !== navbarLinks.length
                      ? "md:border-r md:border-red-700"
                      : ""
                  }
                  text-center
                `}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {showLoginModal && <LoginForm />}
      {showSignUpModal && <SignUpForm />}
    </header>
  );
}

export default Header;
