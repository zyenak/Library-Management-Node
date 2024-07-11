import React from 'react';
import { Box, Button } from '@mui/material';
import { FallbackProps } from "react-error-boundary"

export function ErrorBombFallback(props: FallbackProps) {
    const { error, resetErrorBoundary } = props


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <div role="alert" style={{ textAlign: 'center' }}>
                <p>Something went wrong:</p>
                <pre style={{ color: 'red' }}>{error.message}</pre>
                <Button onClick={resetErrorBoundary} variant="contained">Try again</Button>
            </div>
        </Box>
    );
};

