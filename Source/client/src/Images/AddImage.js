import React, { Component } from 'react';

class AddImageForm extends Component {
    constructor() {
        super();
        this.state = {
            image: "",
            uploading: false,
            uploadProgress: {},
            successfullUploaded: false
        }
    }

    handleChange = (e) => {
        console.log(e.target.files[0])
        e.persist();
        this.setState({
            image: e.target.files[0]
        })
    }

    clearInputs = () => {
        this.setState({
            image: ""
        })
    }

    handleSubmit = (e) => {
        const fd = new FormData();
        fd.append("file", this.state.image)
        e.preventDefault();
        // console.log(fd, this.state)
        this.props.addImage(fd)
            .then(response => {
                return this.clearInputs()
            })
            .catch(err => console.error(err.response.data.message))
       
    }
   
    // async uploadFiles() { --add for muliptle and progress
    //     this.setState({ uploadProgress: {}, uploading: true });
    //     const promises = [];
    //     this.state.files.forEach(file => {
    //       promises.push(this.sendRequest(file));
    //     });
    //     try {
    //       await Promise.all(promises);
    
    //       this.setState({ successfullUploaded: true, uploading: false });
    //     } catch (e) {
    //       // Not Production ready! Do some error handling here instead...
    //       this.setState({ successfullUploaded: true, uploading: false });
    //     }
    //   }
    

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
                        // ref={fileInput => this.fileInput = fileInput}
                        placeholder="Image"/>
                    {/* <button onClick={()=>this.fileInput.click()}>Select Photo</button> */}

                    <button onClick={this.handleSubmit}>Upload</button>
                                {/* <div>
                    {this.state.uploadedFileCloudinaryUrl === '' ? null :
                    <div>
                        <p>{this.state.uploadedFile? this.state.uploadedFile.name:null}</p>
                        <img src={this.state.uploadedFileCloudinaryUrl} />
                    </div>}
                    </div> */}
                </form>
            </div>
        )
    }
}

export default AddImageForm;
