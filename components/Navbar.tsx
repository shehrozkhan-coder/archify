import React from "react";
import { Box } from "lucide-react";
import { useOutletContext } from "react-router";

const Navbar = () => {
  const { isSignedIn, userName, signIn, signOut} = useOutletContext<AuthContext>()

  const handleAuthClick = async () => {
    if(isSignedIn) {
        try {
            await signOut()
        } catch (error) {
            console.log(`Puter sign out failed: ${error}`)
        }
        return 
    }
    try {
        await signIn()
    } catch (error) {
        console.log(`Puter signin failed: ${error}`)
    }
  };

  // Premium SaaS style Log In / Log Out button
  const premiumButtonClass = `
    bg-orange-500 
    text-white 
    font-semibold 
    px-6 py-2 
    rounded-lg 
    shadow-md 
    hover:bg-orange-600 
    hover:shadow-lg 
    transition-all 
    duration-300 
    ease-in-out 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    focus:ring-orange-400
    cursor-pointer
  `;

  // Light gray Get Started button
  const lightButtonClass = `
    bg-gray-100 
    text-gray-800 
    font-semibold 
    px-6 py-2 
    rounded-lg 
    shadow-sm 
    hover:bg-gray-200 
    transition-all 
    duration-300 
    ease-in-out
    cursor-pointer
  `;

  return (
    <header className="navbar bg-white shadow-sm">
      <nav className="inner flex justify-between items-center px-8 py-4">
        {/* Left section */}
        <div className="left flex items-center gap-8">
          <div className="brand flex items-center gap-2">
            <Box className="logo text-orange-500" size={28} />
            <span className="name font-bold text-xl text-gray-800">ARCHIFY</span>
          </div>

          <ul className="links flex gap-6 text-gray-700 font-medium">
            <li><a href="#">Products</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Enterprise</a></li>
          </ul>
        </div>

        {/* Right section (Buttons) */}
        <div className="action flex items-center gap-4">
          {isSignedIn ? (
            <>
              <span className="greeting text-gray-800 font-medium">
                Hi, {userName}
              </span>
              <button onClick={handleAuthClick} className={premiumButtonClass}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button onClick={handleAuthClick} className={premiumButtonClass}>
                Log In
              </button>
              <a href="#upload" className={lightButtonClass}>
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;