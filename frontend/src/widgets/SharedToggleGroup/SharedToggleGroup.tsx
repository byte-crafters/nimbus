import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';
import styles from './SharedToggleGroup.module.scss';

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
            color="secondary"
            value={variant}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            className={styles.button}
        >
            <ToggleButton value="1">I shared</ToggleButton>
            <ToggleButton value="2">Shared with me</ToggleButton>
        </ToggleButtonGroup>
    );
}
