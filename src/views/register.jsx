var React = require('react');
var Layout = require('./layout.jsx');


var Component = React.createClass({
    render: function () {
        var errors = (this.props.errors && this.props.errors.length)
            ? <p>{this.props.errors}</p>
            : null;

        return (
            <Layout title="Registration">
                <h1>Registration Page</h1>

                {errors}

                <form method="post" action="register">
                    <p><input type="text"     name="email"    value="" placeholder="E-mail" /></p>
                    <p><input type="password" name="password" value="" placeholder="Password" /></p>
                    <p><input type="submit"   value="Register" /></p>
                </form>
            </Layout>
        );
    }
});


module.exports = Component;
