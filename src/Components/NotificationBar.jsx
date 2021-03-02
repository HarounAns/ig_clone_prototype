import { divide } from 'lodash';
import React, { Component } from 'react';
import { AppContext } from '../AppContext';

class NotificationBar extends Component {
    static contextType = AppContext;

    componentWillUnmount  = () => {
        this.context.setNotification([]);
    }

    render() {
        const { notifications } = this.context;
        return notifications.map(notification => {
            const {
                type,
                post,
                likingUser,
                followingUser,
                timestamp
            } = notification;

            if (type === 'like') {
                return (
                    <div>
                        <p>{`${likingUser} liked your post ${post} at ${timestamp}`}</p>
                    </div>
                )
            }

            if (type === 'follow') {
                return (
                    <div>
                        <p>{`${followingUser} just followed you! ${timestamp}`}</p>
                    </div>
                )
            }

            return null;
        });
    }
}

export default NotificationBar;