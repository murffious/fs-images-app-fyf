import React, { Component } from 'react';

class AddImageForm extends Component {
    constructor() {
        super();
        this.state = {
            image: ""
        }
    }

    handleChange = (e) => {
        console.log(e.target.files[0])
        e.persist();
        const { name, value } = e.target;
        this.setState({
            image: e.target.files[0]
        })
    }

    clearInputs = () => {
        this.setState({
            file: ""
        })
    }

    handleSubmit = (e) => {
        const fd = new FormData();
        fd.append(this.state.image, this.state.image.name)
        e.preventDefault();
        this.props.addImage(fd)
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
                        onChange={this.handleChange}
                        type="file"
                        placeholder="Image"/>

                    <button onClick={this.handleSubmit}>Upload</button>
                </form>
            </div>
        )
    }
}

export default AddImageForm;
