import { TFSItem, TFile, fetcher } from '@/libs/request';
import { getFormattedDate } from '@/shared/utils';
import {
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { PropsWithChildren, useEffect, useState } from 'react';
import styles from './InfoBar.module.scss';

interface IProps {
    items: TFSItem[];
}

export const InfoBar = ({ items }: PropsWithChildren<IProps>) => {
    const [info, setInfo] = useState<TFile | null>();

    useEffect(() => {
        if (items.length == 1) {
            const itemId = items[0].id;
            fetcher.getFileInfo(itemId).then((info) => {
                console.log(info);
                setInfo(info);
            });
        } else {
            setInfo(null);
        }
    }, [items]);

    return (
        <div className={styles.container}>
            {items.length == 1 && (
                <List sx={{flexGrow: 1}}>
                    <ListItem>
                        <ListItemText primary="Name" secondary={info?.name} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Owner" secondary={info?.owner} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Size" secondary={info?.size} />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Extension"
                            secondary={info?.extension}
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                        <ListItemText
                            primary="Created"
                            secondary={getFormattedDate(info?.createdDate)}
                        />
                    </ListItem>
                </List>
            )}
            {items.length == 0 && (
                <Typography variant="body1">
                    Select an item to see the details
                </Typography>
            )}
            {items.length > 1 && (
                <Typography variant="body1">
                    {items.length} items selected
                </Typography>
            )}
        </div>
    );
};
