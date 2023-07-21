
import { Component, ErrorInfo, ReactNode } from "react"
import { Link } from "react-router-dom"

export default class ErrorBoundary extends Component<ErrorBoundaryProps>{
    state = {
        hasError: false
    }
   
    componentDidCatch(error: Error, info: ErrorInfo) {
        this.setState({hasError: true})
        console.log("Error boundary component caught an error", error, info);
    }
    render() {
       if (this.state.hasError) {
        return (
            <h2>
                Oops! an error occured.
                <Link to="/">Click here to go back to the home page.</Link>
            </h2>
        )
       }
        return (
            <>
            {this.props.children} 
            </>
        )
    }
}

interface ErrorBoundaryProps{
    children: ReactNode,
};