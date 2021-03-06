import React, { useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
//Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Loading from './components/layout/Loading'
//Router
import { Route, Switch } from 'react-router-dom';
import ArtistScreen from './screens/ArtistScreen';
import PrivateRoutes from './components/auth/ProtectedRoutes';
//Context 
import { CurrentUserContext } from './store/currentUser'
//Data Provider
import DataProvider from './store/DataProvider'

function App() {

  const {state: currentUserState, fetchUser} = useContext(CurrentUserContext)
  const unloadedUser = (localStorage.getItem('token') && !currentUserState.user) 

  if (unloadedUser){
    fetchUser()
  }

  useEffect(() => {
  },[currentUserState])

  return (
    <>
    {unloadedUser ?
      <Loading/>
      :
      <Switch>
        <Route path='/' component={Login} exact />
        <Route path='/register' component={Register} exact />
        <PrivateRoutes>
          <DataProvider>
            <Route path='/companies' component={Register} exact />
            <Route path='/artists' component={Register} exact />
            <Route path='/artists/:id' component={ArtistScreen} />
          </DataProvider>
        </PrivateRoutes>
      </Switch>
    }
    </>
  );
}

export default App;
