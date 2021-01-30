import React, { Component } from 'react';
import { AppContext } from '../AppContext';

import { Storage, Auth } from 'aws-amplify';
import axios from "axios";
import config from "../config";
import Loading from './Loading';

import UserProfileInfo  from './UserProfileInfo';
import Grid  from './Grid';

const { PRODUCTDB_API_URL } = config;

class MyProfile extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            user: null,
            postSelected: null
        };
    }

    componentDidMount = async () => {
        const { username } = await Auth.currentAuthenticatedUser();
        console.log('username', username);
        const res = await axios.get(PRODUCTDB_API_URL + `/users/${username}/photos`);
        console.log(res);
        const { Posts: posts, User: user } = res.data;
        this.setState({
            posts,
            user
        });
    }

    render() {
        const { posts, user, postSelected } = this.state;

        if (!user || !posts[0]) {
            return <Loading />
        }

        if (postSelected) {
            return <Post post={postSelected} />
        }

        return (
            <div>
                <UserProfileInfo user={user} />
                <Grid posts={posts} setPost={(postSelected) => this.setState({postSelected})}/>
            </div>
        )
    }
}

export default MyProfile;