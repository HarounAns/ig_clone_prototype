import React, { Component } from 'react';
import './Navbar.css';
import { screens } from "../../Screens";

const screenNames = Object.keys(screens);

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navSelection: screenNames,
            active: screenNames[0]
        };
    }

    selectScreen = (ns) => {
        this.setState({ active: ns });
        this.props.setScreen(screens[ns]);
    }

    renderSelection = () => {
        const { navSelection, active } = this.state;

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
                    {ns}
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
            <div class="navbar" onClick={this.handleClick}>
                {this.renderSelection()}
            </div>
        );
    }
}

export default Navbar;