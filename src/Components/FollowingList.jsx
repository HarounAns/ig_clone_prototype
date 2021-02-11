import React, { Component } from 'react';
import axios from 'axios';
import { Auth } from 'aws-amplify';

import config from '../config';
import Loading from './Loading';
import UserProfile from './UserProfile';

const { PRODUCTDB_API_URL } = config;

class FollowingList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount = async () => {
        await this.getFollowing();
    }

    getFollowing = async () => {
        const { username } = await Auth.currentAuthenticatedUser();
        const res = await axios.get(PRODUCTDB_API_URL + `/users/${username}/following`);
        const { Following } = res.data;

        this.setState({
            Following,
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
        const { Following, loading, showProfile, username } = this.state;

        if (loading)
            return <Loading />

        if (showProfile) {
            return <UserProfile username={username} />
        }

        return (
            <div>
                <h5>Following:</h5>
                {Following.map(follower =>
                    <p>
                        <a href="#" onClick={() => this.searchUser(follower.followedUser)}>
                            {follower.followedUser}
                        </a>
                    </p>
                )}
                <button onClick={this.props.goBack}>Back</button>
            </div>
        )
    }
}

export default FollowingList;