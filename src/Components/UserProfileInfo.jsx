import React, { Component } from 'react';

class UserProfileInfo extends Component {
    render() {
        const {
            username,
            email,
            followers,
            following,
            phone,
            timestamp
        } = this.props.user;

        return (
            <div>
                <table>
                    <tr>
                        <td>Username</td>
                        <td>{username}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{email}</td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#" onClick={this.props.setSeeFollowers}>
                                Followers
                            </a>
                        </td>
                        <td>{followers}</td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#" onClick={this.props.setSeeFollowing}>
                                Following
                            </a>
                        </td>
                        <td>{following}</td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td>{phone}</td>
                    </tr>
                    <tr>
                        <td>Joined</td>
                        <td>{timestamp}</td>
                    </tr>
                </table>
            </div>
        );
    }
}

export default UserProfileInfo;