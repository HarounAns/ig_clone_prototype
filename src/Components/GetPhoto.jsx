import React, { Component } from 'react';
import { Auth, Storage } from 'aws-amplify';


class GetPhoto extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            fileUrl: ''
        };
    }
    componentDidMount = async () => {
        try {
            const data = await Storage.get('photos/husie/2021-01-24T22:46:32.759Z.jpeg');
            this.setState({ fileUrl: data });
        } catch (error) {
            console.log('error fetching image', error);
        }
    }
    render() {
        return (
            <>
                <img src={this.state.fileUrl} alt=""/>
            </>
        );
    }
}

export default GetPhoto;