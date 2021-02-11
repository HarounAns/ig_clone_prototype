import { Component } from 'react';
import './App.css';
import { AppContext } from './AppContext';

import aws_exports from './aws-exports';
import AddPhoto from './Components/AddPhoto';
import GetPhoto from './Components/GetPhoto';
import MyProfile from './Components/MyProfile';
import Search from './Components/Search/Search';

import { withAuthenticator } from 'aws-amplify-react';
import { Amplify, Auth } from 'aws-amplify';
import Navbar from './Components/Navbar/Navbar';
import { screens } from './Screens';
import Feed from './Components/Feed';


Amplify.configure(aws_exports);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: screens.search
    };
  }

  selectScreen = () => {
    const { screen } = this.state;

    if (screen === screens.search)
      return <Search />

    if (screen === screens.myProfile)
      return <MyProfile />

    if (screen === screens.add)
      return <AddPhoto />

    if (screen === screens.feed)
      return <Feed />
  }

  render() {
    return (
      <div>
        <Navbar setScreen={(screen) => this.setState({ screen })} />
        {this.selectScreen()}
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
