import React, { Component } from "react";
import axios from "axios";
const ImageAxios = axios.create();

ImageAxios.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

const AppContext = React.createContext();

export class AppContextProvider extends Component {
    constructor() {
        super()
        this.state = {
            images: [],
            user: JSON.parse(localStorage.getItem("user")) || {},
            token: localStorage.getItem("token") || ""
        }
    }

    componentDidMount() {
        this.getImages();
    }

    getImages = () => {
        return ImageAxios.get(`/api/image/all/${this.state.user.email}`)
            .then(response => {
                console.log(response)
                this.setState({ images: response.data.files});
                return response;
            })
    }

    addImage = (newImage) => {
        return ImageAxios.post("/api/image/upload", newImage)
            .then(response => {
                this.setState(prevState => {
                    return { images: [...prevState.images, response.data] }
                });
                return response;
            })
    }

    editImage = (imageId, image) => {
        return ImageAxios.put(`/api/image/${imageId}`, image)
            .then(response => {
                this.setState(prevState => {
                    const updatedImages = prevState.images.map(image => {
                        return image._id === response.data._id ? response.data : image
                    })
                    return { images: updatedImages }
                })
                return response;
            })
    }

    deleteImage = (imageId) => {
        return ImageAxios.delete(`/api/image/${imageId}`)
            .then(response => {
                this.setState(prevState => {
                    const updatedImages = prevState.images.filter(image => {
                        return image._id !== imageId
                    })
                    return { images: updatedImages }
                })
                return response;
            })
    }

    signup = (userInfo) => {
        return ImageAxios.post("/auth/signup", userInfo)
            .then(response => {
                const { user, token } = response.data
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                this.setState({
                    user,
                    token
                });
                return response;
            })
    }

    login = (credentials) => {
        return ImageAxios.post("/auth/login", credentials)
            .then(response => {
                const { token, user } = response.data;
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                this.setState({
                    user,
                    token
                });
                this.getImages();
                return response;
            })
    }

    logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        this.setState({
            images: [],
            user: {},
            token: ""
        })
    }

    render() {
        return (
            <AppContext.Provider
                value={{
                    getImages: this.getImages,
                    addImage: this.addImage,
                    editImage: this.editImage,
                    deleteImage: this.deleteImage,
                    signup: this.signup,
                    login: this.login,
                    logout: this.logout,
                    ...this.state
                }}
            >

                {this.props.children}

            </AppContext.Provider>
        )
    }
}

export const withContext = Component => {
    return props => {
        return (
            <AppContext.Consumer>
                {
                    globalState => {
                        return (
                            <Component
                                {...globalState}
                                {...props}
                            />
                        )
                    }
                }
            </AppContext.Consumer>
        )
    }
}
