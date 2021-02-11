import React, { Component } from 'react';
import { Storage } from 'aws-amplify';
import Loading from './Loading';

class Grid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imgUrls: []
        };
    }

    componentDidMount = async () => {
        const { posts } = this.props;
        console.log('posts');
        console.log(posts);

        // TODO: make concurrent or figure way to bulk get images
        let imgUrls = [];
        for (let post of posts) {
            const data = await Storage.get(post.location);
            imgUrls.push(data);
        }

        console.log('imgUrls');
        console.log(imgUrls);
        this.setState({ imgUrls });
    }

    createGrid = () => {
        const { posts, setPost } = this.props;
        const { imgUrls } = this.state;
        
        return imgUrls.map((imgUrl, i) => 
            <img 
                onClick={() => setPost({...posts[i], imgUrl})}
                src={imgUrl} 
                alt="" 
                style={{width: '30vw', height: '30vw'}}/>
        )
    }

    render() {
        const { imgUrls } = this.state;

        if (!imgUrls[0])
            return <Loading />

        return (
            <>
                {this.createGrid()}
            </>
        );
    }
}

export default Grid;