var React = require('react');
var Layout = require('./layout.jsx');


var Component = React.createClass({
    render: function () {
        var user = (this.props.user.isAuthenticated)
            ? <div>Welcome! {this.props.user.credentials.email}</div>
            : null;

        return (
            <Layout title="Home Page" {...this.props} >
                <h1>Slacktube App - Sync Music and Vdieo Playlists</h1>
                {user}
            </Layout>
        );
    }
});


module.exports = Component;