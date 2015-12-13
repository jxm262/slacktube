var React = require('react');
var Layout = require('./layout.jsx');


var Component = React.createClass({
    render: function () {
        return (
            <div>
                <p>{this.props.payload.a}</p>
            </div>
        );
    }
});


module.exports = Component;