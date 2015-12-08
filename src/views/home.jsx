var React = require('react');
var Layout = require('./layout.jsx');


var Component = React.createClass({
    render: function () {

        return (
            <Layout title="Home Page">
                <h1>Slacktube App - Sync Music and Vdieo Playlists</h1>
            </Layout>
        );
    }
});


module.exports = Component;