import React, { Component } from 'react';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import config from '../config';

const { PRODUCTDB_API_URL } = config;


class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPostLiked: null, // defaults to null but can be set to true/false
            isMyPost: false,
            editingCaption: false
        };
    }

    componentDidMount = async () => {
        this.isMyPost();
        await this.getIsPostLiked();
    }

    getIsPostLiked = async () => {
        const { post } = this.props;
        const [postUser, postTs] = post.SK.split('PHOTO#')[1].split('#');
        const { username } = await Auth.currentAuthenticatedUser();
        const res = await axios.get(
            PRODUCTDB_API_URL + `/users/${username}/posts/like?postUser=${postUser}&postTs=${postTs}`
        );
        this.setState({ isPostLiked: res.status === 200 });
    }

    likeBtn = () => {
        const { isPostLiked } = this.state;

        if (isPostLiked === null)
            return null;

        if (isPostLiked)
            return <button onClick={this.unlikePost}>Unlike</button>

        return <button onClick={this.likePost}>Like</button>
    }

    likePost = async () => {
        const { post, setLikes } = this.props;
        const { username: user } = await Auth.currentAuthenticatedUser();
        let { likes } = post;

        const data = {
            post: post.SK,
            user
        };
        await axios.put(PRODUCTDB_API_URL + `/posts/like`, data);

        this.setState({
            isPostLiked: true
        })

        try {
            setLikes(likes + 1);
        } catch (error) {
            console.error("couldnt set likes:", error);
        }
    }


    unlikePost = async () => {
        const { post, setLikes } = this.props;
        const { username: user } = await Auth.currentAuthenticatedUser();
        let { likes } = post;

        const data = {
            post: post.SK,
            user
        };
        await axios.put(PRODUCTDB_API_URL + `/posts/unlike`, data);

        this.setState({
            isPostLiked: false
        })
        try {
            setLikes(likes - 1);
        } catch (error) {
            console.error("couldnt set likes:", error);
        }
    }

    isMyPost = async () => {
        const { post } = this.props;
        const postUser = post.SK.split('PHOTO#')[1].split('#')[0];
        const { username } = await Auth.currentAuthenticatedUser();
        const isMyPost = username === postUser;
        this.setState({
            isMyPost
        })
    }

    handleCaptionChange = e => {
        this.setState({ caption: e.target.value });
    }

    saveCaption = async () => {
        const { post, setCaption } = this.props;
        const { caption } = this.state;
        const { PK, SK } = post;
        const data = {
            caption,
            PK,
            SK
        }
        await axios.put(PRODUCTDB_API_URL + `/users/posts`, data);
        this.setState({
            caption,
            editingCaption: false
        });
        setCaption(caption);
    }

    render() {
        const { post, goBack, feed } = this.props;
        const { caption, imgUrl, likes } = post;
        const { isMyPost, editingCaption } = this.state;

        return (
            <div>
                <img
                    src={imgUrl}
                    alt=""
                    style={{ width: '30vw', height: '30vw' }} />
                <p>Likes: {likes}</p>
                {this.likeBtn()}
                <p>
                    {caption + " "}
                    {isMyPost &&
                        <button onClick={() => this.setState({ editingCaption: true })}>Edit Caption</button>
                    }
                    {editingCaption &&
                        <div>
                            <label htmlFor="newcap">New caption:</label>
                            <input type="text" id="newcap" name="newcap" onChange={this.handleCaptionChange} />
                            <button onClick={this.saveCaption}>Save</button>
                        </div>
                    }
                </p>
                {!feed &&
                    <div>
                        <br />
                        <button onClick={goBack}>Back</button>
                    </div>
                }
            </div>
        );
    }
}

export default Post;