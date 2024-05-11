import { Breadcrumbs as MUIBreadcrumbs } from '@mui/material';
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
            separator={<NavigateNextIcon fontSize="small" />}
        >
            {list ? (
                list.map((item, index) => (
                    <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            if (onClick) {
                                onClick(item);
                            }
                        }}
                        key={item.id}
                    >
                        {index ? item.name : 'Home'}
                    </div>
                ))
            ) : (
                <div>Home</div>
            )}
        </MUIBreadcrumbs>
    );
}
