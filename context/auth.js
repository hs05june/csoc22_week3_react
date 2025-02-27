import { useEffect, useState, useContext, createContext } from 'react'
import { useCookies } from 'react-cookie'
import axios from '../utils/axios'
import { useRouter } from 'next/router'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const router = useRouter()
  const [profileName, setProfileName] = useState('')
  const [avatarImage, setAvatarImage] = useState('#')
  const [cookies, setCookies, removeCookies] = useCookies(['auth'])
  const [tok, setTok] = useState(cookies.token)
  const setToken =(newToken) => {setCookies('token', newToken, { path: '/' })}
  const deleteToken = () => {
    removeCookies('token')
  }
   const logout = async() => {
    setProfileName('')
    setAvatarImage('#')
     setTok('')
     deleteToken()
    router.push('/login')
    alert('Logget out!')
  }

  const [count, incCount] = useState(0)
  
  useEffect(() => {
    if (tok) {
      axios
        .get('auth/profile/', {
          headers: {
            Authorization: 'Token ' + tok,
          },
        })
        .then((response) => {
          setAvatarImage(
            'https://ui-avatars.com/api/?name=' +
              response.data.name +
              '&background=fff&size=33&color=007bff'
          )
          setProfileName(response.data.name)
        })
        .catch((error) => {
          console.log('Some error occurred')
        })
    }
  }, [setAvatarImage, setProfileName, tok]
  )

  return (
    <AuthContext.Provider
      value={{
        tok,
        setToken,
        deleteToken,
        profileName,
        setProfileName,
        avatarImage,
        setAvatarImage,
        logout,
        setTok,
        count,
        incCount
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
