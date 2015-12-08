var React = require('react');
var Layout = require('./layout.jsx');


var Component = React.createClass({
    render: function () {

        return (
            <Layout title="OauthCallback">
                <h1>Logged in Successfully</h1>
                <p>Using tokens: {this.props.tokens}</p>
            </Layout>
        );
    }
});


module.exports = Component;