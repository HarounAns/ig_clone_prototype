import React, { Component } from 'react';
import './Navbar.css';
import Sockette from 'sockette';
import { Auth } from 'aws-amplify';
import { screens } from "../../Screens";
import { AppContext } from '../../AppContext';

const screenNames = Object.keys(screens);

class Navbar extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);

        this.state = {
            navSelection: screenNames,
            active: screenNames[0],
            notifCount: 0
        };
    }


    componentDidMount = () => {
        this.ws = new Sockette('wss://kezjows1uj.execute-api.us-east-1.amazonaws.com/dev',
            {
                timeout: 1000, // 1 second
                maxAttempts: 50,
                onopen: async e => await this.connectUser(e),
                onmessage: e => this.handleMessage(e),
                onreconnect: e => console.log("Reconnecting...", e),
                onmaximum: e => console.log("Stop Attempting!", e),
                onclose: e => console.log("Closed...", e),
                onerror: e => console.log("Error:", e)
            });
    }

    handleMessage = e => {
        console.log(e);
        if (e.data) {
            const message = JSON.parse(e.data);
            if (message.type === 'like' || message.type === 'follow') {
                let { notifCount } = this.state;
                notifCount++;
                this.setState({ notifCount });
                this.context.setNotification(notification => [...notification, message]);
            }
        }
    }

    connectUser = async e => {
        console.log("Connected...", e);
        const { username } = await Auth.currentAuthenticatedUser();

        this.ws.json({
            action: "connectUser",
            username,
        })
    }

    selectScreen = (ns) => {
        this.setState({ active: ns });
        this.props.setScreen(screens[ns]);

        if (screens[ns] === screens.myProfile) {
            this.setState({ notifCount: 0 });
        }
    }

    renderSelection = () => {
        const { navSelection, active, notifCount } = this.state;

        let list = [];
        for (let ns of navSelection) {
            list.push(
                // Fix ES lint anchor should be a button warning https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                    href="#"
                    key={ns}
                    name={ns}
                    className={ns === active ? "active" : ""}
                    onClick={() => this.selectScreen(ns)}
                >
                    {screens[ns] === screens.myProfile && notifCount ? `${ns} ${notifCount}` : ns}
                </a>
            );
        }

        return list;
    }

    handleClick = e => {
        const { name } = e.target;
        if (!name) return;


    }

    render() {
        return (
            <div className="navbar" onClick={this.handleClick}>
                {this.renderSelection()}
            </div>
        );
    }
}

export default Navbar;