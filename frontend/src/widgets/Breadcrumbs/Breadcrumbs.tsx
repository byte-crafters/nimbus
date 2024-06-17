import { Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { TFolder, TPath } from '@/libs/request';

interface IProps {
    list: TPath[];
    onClick: (folder: TFolder) => void;
}

export function Breadcrumbs({ list, onClick }: IProps) {
    return (
        <MUIBreadcrumbs
            sx={{ margin: 2 }}
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="medium" />}
        >
            {list &&
                list.map((item, index) => (
                    <Typography
                        variant="body2"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                            if (onClick) {
                                /** TODO fix: we dont use TFolder all data */
                                onClick(item as TFolder);
                            }
                        }}
                        key={item.id}
                    >
                        {index ? item.name : 'Home'}
                    </Typography>
                ))}
        </MUIBreadcrumbs>
    );
}
