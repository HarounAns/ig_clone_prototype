import React, { Component } from 'react';

class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount = () => {

    }

    render() {
        const { loading } = this.state;
        if (loading) {

        }
        return (
            <div>

            </div>
        );
    }
}

export default Post;