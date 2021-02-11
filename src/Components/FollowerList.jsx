import React, { Component } from 'react';
import axios from 'axios';
import { Auth } from 'aws-amplify';

import config from '../config';
import Loading from './Loading';
import UserProfile from './UserProfile';

const { PRODUCTDB_API_URL } = config;

class FollowerList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount = async () => {
        await this.getFollowers();
    }

    getFollowers = async () => {
        const { username } = await Auth.currentAuthenticatedUser();
        const res = await axios.get(PRODUCTDB_API_URL + `/users/${username}/followers`);
        const { Followers } = res.data;

        this.setState({
            Followers,
            loading: false
        });
    }

    searchUser = (username) => {
        this.setState({
            showProfile: true,
            username
        })
    }

    render() {
        const { Followers, loading, showProfile, username } = this.state;

        if (loading)
            return <Loading />

        if (showProfile) {
            return <UserProfile username={username} />
        }

        return (
            <div>
                <h5>Followers:</h5>
                {Followers.map(follower =>
                    <p>
                        <a href="#" onClick={() => this.searchUser(follower.followingUser)}>
                            {follower.followingUser}
                        </a>
                    </p>
                )}
                <button onClick={this.props.goBack}>Back</button>
            </div>
        )
    }
}

export default FollowerList;