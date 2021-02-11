import React, { Component } from 'react';
import axios from 'axios';
import { Auth } from 'aws-amplify';

import config from '../config';
import Loading from './Loading';
import FeedPost from './FeedPost';


const { PRODUCTDB_API_URL } = config;

class Feed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            Feed: null
        };
    }

    componentDidMount = async () => {
        await this.getFeed();
    }

    getFeed = async () => {
        const { username } = await Auth.currentAuthenticatedUser();
        const res = await axios.get(PRODUCTDB_API_URL + `/users/${username}/feed`);
        const { Feed } = res.data;

        this.setState({
            Feed,
            loading: false
        });
    }

    setLikes = (likes, SK) => {
        let { Feed } = this.state;
        for (let i in Feed) {
            if (Feed[i].SK === SK) {
                Feed[i].likes = likes;
                return this.setState({ Feed });
            }
        }
        console.error("Couldnt Set Likes for Feed");
    }

    render() {
        const { Feed, loading } = this.state;

        if (loading)
            return <Loading />

        return (
            <div style={styles.container}>
                {Feed.map(post => 
                    <FeedPost 
                        key={post.SK}
                        post={post} 
                        setLikes={(likes) => this.setLikes(likes, post.SK)}/>
                )}
            </div>
        )
    }
}

export default Feed;

const styles = {
    container: {
        paddingBottom: '2.5vh',
    }
}