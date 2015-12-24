const React = require('react');

const Component = React.createClass({
    render: function () {
        const profile = (this.props.user && this.props.user.isAuthenticated)
            ? <a href="/profile">Profile</a>
            : <a href="/login">Login</a>;

        const logout = (this.props.user && this.props.user.isAuthenticated)
            ? <a href="/logout">Logout</a>
            : null;

        const playlists = (this.props.user && this.props.user.credentials && this.props.user.credentials.youtube)
            ? <a href="/playlists">Playlists</a>
            : null;

        return (
            <html>
                <head>
                    <title>{this.props.title}</title>
                </head>
                <body>
                    <p>
                        <a href="/">Home</a> | <a href="/about">About Us</a> | {profile} | {logout} | {playlists} |
                    </p>
                    <hr />
                    {this.props.children}
                </body>
            </html>
        );
    }
});


module.exports = Component;
