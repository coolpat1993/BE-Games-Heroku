import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = props => {
  const [loggedInUser, setLoggedInUser] = useState({
    username: "something",
    name: "something",
    url: "something,",
  });

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

/* import {UserContext} from "./components/contexts/User"
import {useContext} from 'react' */ // from app

import { UserProvider } from "./components/contexts/User";

<UserProvider>
</UserProvider>