import { useEffect } from 'react';
import { createContext, ReactNode, useState } from 'react';
import { auth,firebase } from "../services/firebase";

type TUser = {
  id: string,
  name: string,
  avatar:string
}

type AuthProviderProps = {
  children:ReactNode
}


interface AuthContextData {
  user:TUser | undefined
  signInWithGoogle: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthContextProvider = ({children}:AuthProviderProps) => {
  const [user, setUser] = useState<TUser>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const {displayName, photoURL, uid} = user
  
        if (!displayName || !photoURL) {
          throw new Error('Missing information from google')
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar:photoURL
        })
      }
    })

    return () => {
      unsubscribe();
    }
  },[])

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider)

    if (result.user) {
      const {displayName, photoURL, uid} = result.user

      if (!displayName || !photoURL) {
        throw new Error('Missing information from google')
      }

      setUser({
        id: uid,
        name: displayName,
        avatar:photoURL
      })
    }
  }
  
  return (
    <AuthContext.Provider value={
      {signInWithGoogle,

      user}
    }>
      {children}
    </AuthContext.Provider>
  )
}
