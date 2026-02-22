'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    context?: string;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // In production, we would log this to a service like Sentry
        // For now, we strictly follow "Clean Console" law in production, 
        // but we might want to keep a silent log or a specific error reporting mechanism.
        if (process.env.NODE_ENV === 'development') {
            console.error('Uncaught error:', error, errorInfo);
        }
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-800 text-sm">
                    <p className="font-bold">Something went wrong in {this.props.context || 'this component'}.</p>
                    <button
                        className="mt-2 text-xs underline hover:text-red-900"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
