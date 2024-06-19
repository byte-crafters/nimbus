import { TFSItem, TFile, TFolder, fetcher } from '@/libs/request';
import { getFormattedDate } from '@/shared/utils';
import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { PropsWithChildren, useEffect, useState } from 'react';
import styles from './InfoBar.module.scss';
import { getCalculatedUnits } from '@/shared/utils/get-calculated-units';

interface IProps {
    items: TFSItem[];
}

export const InfoBar = ({ items }: PropsWithChildren<IProps>) => {
    const [info, setInfo] = useState<TFile | TFolder | null>();

    useEffect(() => {
        if (items.length == 1) {
            const item = items[0];
            console.log(item.id);
            if ('extension' in item) {
                fetcher.getFileInfo(item.id).then((info) => {
                    console.log(info);
                    setInfo(info);
                });
            } else {
                fetcher.getFolderInfo(item.id).then((info) => {
                    console.log(info);
                    setInfo(info);
                });
            }
        } else {
            setInfo(null);
        }
    }, [items]);

    return (
        <div className={styles.container}>
            {items.length == 1 && (
                <Box className={styles.box}>
                    <Typography
                        className={styles.title}
                        noWrap={true}
                        variant="subtitle1"
                        align="center"
                    >
                        {info?.name}
                    </Typography>
                    <List className={styles.list}>
                        <ListItem>
                            <ListItemText
                                primary="Owner"
                                primaryTypographyProps={{
                                    fontWeight: 'bold',
                                }}
                                secondary={info?.owner.username}
                            />
                        </ListItem>
                        {info?.size && (
                            <ListItem>
                                <ListItemText
                                    primary="Size"
                                    primaryTypographyProps={{
                                        fontWeight: 'bold',
                                    }}
                                    secondary={getCalculatedUnits(info?.size)}
                                />
                            </ListItem>
                        )}
                        {info?.extension && (
                            <ListItem>
                                <ListItemText
                                    primary="Extension"
                                    primaryTypographyProps={{
                                        fontWeight: 'bold',
                                    }}
                                    secondary={info?.extension}
                                />
                            </ListItem>
                        )}
                        {/* <Divider variant="inset" component="li" /> */}
                        {info?.createdDate && (
                            <ListItem>
                                <ListItemText
                                    primary="Created"
                                    primaryTypographyProps={{
                                        fontWeight: 'bold',
                                    }}
                                    secondary={getFormattedDate(
                                        info?.createdDate
                                    )}
                                />
                            </ListItem>
                        )}
                    </List>
                </Box>
            )}
            {items.length == 0 && (
                <Typography
                    className={styles.title}
                    variant="body2"
                    textAlign="center"
                    marginTop={25}
                >
                    Select an item to see the details
                </Typography>
            )}
            {items.length > 1 && (
                <Typography
                    className={styles.title}
                    variant="body2"
                    textAlign="center"
                    marginTop={25}
                >
                    {items.length} items selected
                </Typography>
            )}
        </div>
    );
};
