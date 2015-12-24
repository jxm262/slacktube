var React = require('react');
var Layout = require('./layout.jsx');


var Component = React.createClass({
    render: function () {

        return (
            <Layout title="About Us" {...this.props}>
                <h1>This app allows you to sync music across platforms like youtube</h1>
                {this.props.data}
            </Layout>
        );
    }
});


module.exports = Component;