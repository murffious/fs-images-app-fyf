import React, { Component } from 'react';

class AddImageForm extends Component {
    constructor() {
        super();
        this.state = {
            file: ""
        }
    }

    handleChange = (e) => {
        console.log(e.target.files[0])
        e.persist();
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    clearInputs = () => {
        this.setState({
            file: ""
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.addImage(this.state)
            .then(response => {
                this.clearInputs()
            })
            .catch(err => console.error(err.response.data.message))
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <h4>Add New Image</h4>

                    <input
                        name="file"
                        value={this.state.file}
                        // onChange={this.handleChange}
                        type="file"
                        placeholder="File"/>

                    <button onClick={this.handleChange}>Upload</button>
                </form>
            </div>
        )
    }
}

export default AddImageForm;
