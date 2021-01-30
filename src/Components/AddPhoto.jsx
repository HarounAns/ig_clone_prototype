import React, { Component } from 'react';
import { Storage, Auth } from 'aws-amplify';
import { AppContext } from '../AppContext';
import config from '../config';
import axios from 'axios';

const { PRODUCTDB_API_URL } = config;

class AddPhoto extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            fileUrl: '',
            file: '',
        };
    }
    handleFileChange = e => {
        const file = e.target.files[0];
        this.setState({
            fileUrl: URL.createObjectURL(file),
            file,
        })
    }

    handleCaptionChange = e => {
        this.setState({ caption: e.target.value });
    }

    saveFile = async () => {
        const { file, caption } = this.state;
        const { username } = await Auth.currentAuthenticatedUser();
        const dateString = new Date().toISOString();
        const location = `photos/${username}/${dateString}.${file.name.split('.').pop()}`;

        // upload to S3
        try {
            await Storage.put(location, file);
            console.log('successfully saved file!');
        } catch (error) {
            console.log('error uploading file', error);
        }

        // store record in DB
        try {
            const data = {
                username,
                caption,
                location
            }
            await axios.post(PRODUCTDB_API_URL + `/users/posts`, data);
            console.log('successfully added metadata!');
        } catch (error) {
            console.log('error saving file metadata', error);
        }

        this.setState({
            fileUrl: '',
            file: '',
            caption: ''
        });
    }
    render() {
        const { fileUrl, caption } = this.state;
        return (
            <div>
                <input type="file" onChange={this.handleFileChange} />
                <img src={fileUrl} alt="" />
                <form>
                    <label>
                        Caption:
                        <input type="text" name="caption" value={caption} onChange={this.handleCaptionChange} />
                    </label>
                </form>
                <button onClick={this.saveFile}>Save File</button>
            </div>
        );
    }
}

export default AddPhoto;