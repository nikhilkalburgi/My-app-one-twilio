"use client"
import {useEffect, useState} from 'react';

function parseCookies(): string[] {
  let cookies : any = {};
  document.cookie.split(';').map((cookie) => {
    const [name, value]: any = cookie.trim().split('=');
    cookies[name] = decodeURIComponent(value);
  });

  return cookies
}

const App1LandingPage = () => {
  
  const [logoutError, setLogoutError] = useState("");
  const [user, setUser] = useState("");

  const verifyUser = async () => {
    // Make a GET request to the API endpoint
        const cookies: any = parseCookies();
        const {searchParams} = new URL(window.location.href);

        console.log(searchParams.get('token'), searchParams.get('user'))
        if(searchParams.has('token') && searchParams.has('user')){
          const response: any = await fetch(`http://localhost:3000/api/login?token=${searchParams.get('token')}`,{cache:'no-cache'});
          const json = await response.json();
          if(json.ok == 'false'){
            window.location.assign(`http://localhost:3000/?callback=${window.location.host}`);
          }
        }else{

          const response: any = await fetch(`http://localhost:3000/api/auth?callback=http://${window.location.host}`,{cache:'no-cache'});
          const json = await response.json();
          if(json.status == 302){
            window.location.assign(json.Location);
          }
        }
        
    };

  useEffect(()=>{

    verifyUser();
    const {searchParams} = new URL(window.location.href);
    const text: any = (searchParams.get('user'))
    if(text)
    setUser(text)
  },[])
  

    // Call the fetchData function when the component mounts
    


  const handleLogout = async () => {
    try {
      // Make a fetch request to logout API
      const response = await fetch(`http://localhost:3000/api/auth?callback=http://${window.location.host}&logout=true`,{cache:'no-cache'});
      const json = await response.json();
      if(json.status == 302){
        window.location.assign(json.Location);
      }
      // Check if the request was successful
      if (!response.ok) {
        // Handle logout error
        setLogoutError('Failed to logout');
      }
    } catch (error) {
      // Handle fetch error
      setLogoutError('Failed to logout');
    }
  };
    

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4 text-black">App One Dashboard</h1>
      {
      (user)?
      <>
      <h2 className="text-xl font-semibold mb-6 text-black"> Hi {user}! Welcome to your dashboard! </h2>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>Logout</button>
      </>
      
      : <h2 className="text-xl font-semibold mb-6 text-black">Redirecting you to Login Page...</h2>
      }
      {logoutError && <p className="text-red-500 mb-4">Error: {logoutError}</p>}
    </div>
  );
};

export default App1LandingPage;
