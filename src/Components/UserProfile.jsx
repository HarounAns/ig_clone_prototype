import React, { Component } from 'react';
import axios from "axios";
import config from "../config";
import Loading from './Loading';
import Profile from './Profile';
import Post from './Post';
import { Auth } from 'aws-amplify';

const { PRODUCTDB_API_URL } = config;


class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            posts: [],
            error: null,
            selectedPost: null,
            following: null,
            userFollowsMe: null
        };
    }

    componentDidMount = async () => {
        await this.getUserInfo();
    }

    getUserInfo = async () => {
        const [userPostsAndInfo, following, userFollowsMe] = await Promise.all([
            this.getUserPostsAndInfo(),
            this.getfollowing(),
            this.getDoesUserFollowMe(),
        ]);

        const { Posts: posts, User: user } = userPostsAndInfo;
        this.setState({
            posts,
            user,
            following,
            userFollowsMe
        });
    }

    getDoesUserFollowMe = async () => {
        const { username: follower } = this.props;
        const { username } = await Auth.currentAuthenticatedUser();

        const res = await axios.get(PRODUCTDB_API_URL + `/users/${username}/follows/${follower}`);
        return res.status === 200;
    }

    getfollowing = async () => {
        const { username } = this.props;
        const { username: follower } = await Auth.currentAuthenticatedUser();

        const res = await axios.get(PRODUCTDB_API_URL + `/users/${username}/follows/${follower}`);
        return res.status === 200;
    }

    getUserPostsAndInfo = async () => {
        const { username } = this.props;

        try {
            const res = await axios.get(PRODUCTDB_API_URL + `/users/${username}/posts`);
            console.log(res);
            return res.data;
        } catch (error) {
            console.error(error);
            this.setState({
                error
            });
        }
    }

    followUser = async () => {
        const { username: followedUser } = this.props;
        const { username: followingUser } = await Auth.currentAuthenticatedUser();
        const data = { followedUser, followingUser };
        const res = await axios.put(PRODUCTDB_API_URL + `/users/follow`, data);
        console.log(res);
        this.setState({
            following: true
        })
    }

    unfollowUser = async () => {
        const { username: followedUser } = this.props;
        const { username: followingUser } = await Auth.currentAuthenticatedUser();
        const data = { followedUser, followingUser };
        const res = await axios.put(PRODUCTDB_API_URL + `/users/unfollow`, data);
        console.log(res);
        this.setState({
            following: false
        })
    }


    // refactor this code is also in UserProfile
    setLikes = (likes) => {
        let { selectedPost, posts } = this.state;
        const newPost = { ...selectedPost, likes };
        console.log(newPost);

        for (let i in posts) {
            if (posts[i].SK === selectedPost.SK) {
                posts[i] = { ...newPost };
            }
        }
        this.setState({
            selectedPost: newPost,
            posts
        })
    }

    setCaption = caption => {
        let { selectedPost, posts } = this.state;
        const newPost = { ...selectedPost, caption };
        console.log(newPost);

        for (let i in posts) {
            if (posts[i].SK === selectedPost.SK) {
                posts[i] = { ...newPost };
            }
        }
        this.setState({
            selectedPost: newPost,
            posts
        })
    }

    render() {
        const {
            error,
            posts,
            user,
            selectedPost,
            following,
            userFollowsMe
        } = this.state;

        if (error)
            return <p>Sorry, it looks like we encountered an error</p>;

        if (!user || !posts[0])
            return <Loading />;

        if (selectedPost)
            return <Post
                post={selectedPost}
                goBack={() => this.setState({ selectedPost: null })}
                setLikes={this.setLikes}
                setCaption={this.setCaption}
            />;

        return (
            <div>
                {userFollowsMe && <p> This user follows you </p>}
                <Profile
                    user={user}
                    posts={posts}
                    setPost={(selectedPost) => this.setState({ selectedPost })} />
                {following ?
                    <button onClick={this.unfollowUser}>Unfollow</button>
                    :
                    <button onClick={this.followUser}>Follow</button>}
            </div>
        )
    }
}

export default UserProfile;