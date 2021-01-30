import { Component } from 'react';
import './App.css';
import { AppContext } from './AppContext';

import aws_exports from './aws-exports';
import AddPhoto from './Components/AddPhoto';
import GetPhoto from './Components/GetPhoto';
import MyProfile from './Components/MyProfile';

import { withAuthenticator } from 'aws-amplify-react';
import { Amplify, Auth } from 'aws-amplify';
import Loading from './Components/Loading';


Amplify.configure(aws_exports);

class App extends Component {
  render() {
    return (
      <div>
        {/* <AddPhoto /> */}
        {/* {<GetPhoto /> } */}
        <MyProfile />
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
