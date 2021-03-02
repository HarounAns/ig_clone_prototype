import React, { Component } from 'react';

import { Auth } from 'aws-amplify';
import axios from "axios";
import config from "../config";
import Loading from './Loading';

import Post from './Post';
import Profile from './Profile';
import NotificationBar from './NotificationBar';

const { PRODUCTDB_API_URL } = config;

class MyProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            user: null,
            selectedPost: null,
            confirmDelete: false,
            deletingPost: false
        };
    }

    componentDidMount = async () => {
        await this.getUsersPosts();
    }

    getUsersPosts = async () => {
        const { username } = await Auth.currentAuthenticatedUser();
        const res = await axios.get(PRODUCTDB_API_URL + `/users/${username}/posts`);
        const { Posts: posts, User: user } = res.data;
        this.setState({
            posts,
            user
        });
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

    deletePost = async () => {
        const { selectedPost } = this.state;
        const { username } = await Auth.currentAuthenticatedUser();
        const timestamp = selectedPost.SK.split('#').pop();

        this.setState({ 
            confirmDelete: false, // remove the delete buttons since we already clicked Yes
            deletingPost: true 
        });

        try {
            await axios.delete(PRODUCTDB_API_URL + `/users/${username}/posts?postTs=${timestamp}`);

        } catch (error) {
            // TODO: handle error
        }

        await this.getUsersPosts();

        this.setState({
            selectedPost: null,
            deletingPost: false
        });
    }

    render() {
        const { 
            posts, 
            user, 
            selectedPost, 
            confirmDelete, 
            deletingPost 
        } = this.state;

        if (!user || !posts[0])
            return <Loading />

        if (selectedPost)
            return (
                <div>
                    <button onClick={() => this.setState({ confirmDelete: true })}>Delete</button>
                    {confirmDelete &&
                        <div>
                            <p>Are you sure?</p>
                            <button onClick={this.deletePost}>Yes</button>
                            <button onClick={() => this.setState({ confirmDelete: false })}>No</button>
                        </div>
                    }
                    {deletingPost && <p>Deleting...</p>}
                    <Post
                        post={selectedPost}
                        goBack={() => this.setState({ selectedPost: null })}
                        setLikes={this.setLikes}
                        setCaption={this.setCaption}
                    />
                </div>
            )

        return (
            <div>
                <NotificationBar />
                <Profile
                    user={user}
                    posts={posts}
                    setPost={(selectedPost) => this.setState({ selectedPost })} />;
            </div>
        )
    }
}

export default MyProfile;