import React, { Component, ErrorInfo, ReactNode } from "react";
import { ClientRegistrationError } from "./errors/ClientRegistrationError";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    lastError: Error | null
}

class ErrorBoundary extends Component<Props, State>  {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, lastError: null };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Uncaught error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            if (this.state.lastError instanceof ClientRegistrationError) {
                console.log('WOWW')
            } else {
                return <h1>Sorry.. there was an error</h1>;
            }
        }

        return this.props.children;
    }
}