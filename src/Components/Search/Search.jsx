import axios from 'axios';
import React, { Component } from 'react';
import UserProfile from '../UserProfile';
import './Search.css';
import config from "../../config";
import { debounce } from 'lodash';


const { PRODUCTDB_API_URL } = config;

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            users: []
        };

    }

    onChange = async (e) => {
        const username = e.target.value;
        this.setState({
            username,
        });

        // we dont want to fire off an API call everytime, so deboounce it
        this.debouncedSearch();
    }

    onSearch = (username) => {
        this.setState({username}, () => {
            this.setState({showProfile: true })
        }, 500);
    }

    searchUsers = async (username) => {
        if (!username)
            return [];

        const res = await axios.get(PRODUCTDB_API_URL + `/users/${username}/search`);
        return res.data.Users;
    }

    debouncedSearch = debounce(async () => {
        const { username } = this.state;
        const users = await this.searchUsers(username);
        this.setState({ users });
    }, 300);

    autoCompleteUsers = () => {
        const { users } = this.state;
        if (!users.length) return;

        let list = [];
        for (let user of users) {
            const { username } = user;
            list.push(<p onClick={() => this.onSearch(username)}>{username}</p>);
        }
        return list;
    }

    render() {
        const { showProfile, username } = this.state;

        if (showProfile) {
            return <UserProfile username={username} />
        }

        return (
            <div>
                <div class="dropdown">
                    <div id="myDropdown" class="dropdown-content">
                        <input type="text" placeholder="Search Users..." value={username} onChange={this.onChange} />
                        {this.autoCompleteUsers()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Search;