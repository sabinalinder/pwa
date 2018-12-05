import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <header role="banner">
                <div id="top-header" className="top-header">
                    <nav id="primary-menu">
                        <ul>
                            <li>Link heeere</li>
                            <li>Link heeere</li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}

export default Header;