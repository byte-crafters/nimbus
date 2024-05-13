import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';

interface IProps {
    variant: string;
    onClick: (variant: string) => void;
}

export function SharedToggleGroup({ variant, onClick }: IProps) {
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newVariant: string
    ) => {
        if (newVariant) {
            console.log(newVariant);
            onClick(newVariant);
        }
    };

    return (
        <ToggleButtonGroup
            sx={{ height: '30px' }}
            color="secondary"
            value={variant}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
        >
            <ToggleButton value="1">I shared</ToggleButton>
            <ToggleButton value="2">Shared with me</ToggleButton>
        </ToggleButtonGroup>
    );
}
