import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({ user: null, token: "", address:null, cart: null, wishlist:null});

    useEffect(()=>{
        const data = localStorage.getItem('auth');
        if(data){
            const parseData = JSON.parse(data);
            setAuth({ ...auth, 
              user: parseData?.user, 
              token: parseData?.token, 
              address:parseData?.address, 
              cart:parseData?.cart, 
              wishlist:parseData?.wishlist,})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom Hook
const useAuth = () => useContext(AuthContext);

export{ useAuth, AuthProvider };