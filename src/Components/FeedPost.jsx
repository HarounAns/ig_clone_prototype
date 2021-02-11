import React, { Component } from 'react';
import Post from './Post';

import { Storage } from 'aws-amplify';

class FeedPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imgUrl: null
        };
    }

    componentDidMount = async () => {
        await this.getImgUrl();
    }

    getImgUrl = async () => {
        const { post } = this.props;

        const imgUrl = await Storage.get(post.location);
        this.setState({ imgUrl });
    }

    feedPostHeader = () => {
        const { username } = this.props.post;
        const style = {
            margin: '10px',
        };

        return <p style={style}><strong>{username}</strong></p>
    }

    feedPostFooter = () => {
        const { timestamp } = this.props.post;

        return <p>{timestamp}</p>
    }

    render() {
        const { post } = this.props;
        const { imgUrl } = this.state;

        if (!imgUrl)
            return null;

        return (
            <div style={styles.container}>
                {this.feedPostHeader()}
                <div style={styles.post}>
                    <Post
                        post={{ ...post, imgUrl }}
                        setLikes={this.props.setLikes}
                        feed={true} />
                </div>
                {this.feedPostFooter()}
            </div>
        );
    }
}

export default FeedPost;

const styles = {
    container: {
        width: '30vw',
        border: '2px solid black',
        margin: '2.5vh 40vw',
    },
    post: {
        borderTop: '1px solid black'
    }
}