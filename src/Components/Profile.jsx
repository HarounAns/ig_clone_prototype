import React, { Component } from 'react';
import UserProfileInfo from './UserProfileInfo';
import Grid from './Grid';
import FollowerList from './FollowerList';
import FollowingList from './FollowingList';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seeFollowers: false,
            seeFollowing: false,
        };
    }

    render() {
        const { user, posts, setPost } = this.props;
        const { seeFollowers, seeFollowing } = this.state;

        if (seeFollowers)
            return <FollowerList goBack={() => this.setState({seeFollowing: false, seeFollowers: false})} />

        if (seeFollowing)
            return <FollowingList goBack={() => this.setState({seeFollowing: false, seeFollowers: false})} />

        return (
            <div>
                <UserProfileInfo 
                    user={user}  
                    setSeeFollowers={() => this.setState({seeFollowers: true})}
                    setSeeFollowing={() => this.setState({seeFollowing: true})}
                    />
                <Grid posts={posts} setPost={setPost} />
            </div>
        );
    }
}

export default Profile;