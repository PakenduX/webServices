import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    card: {
        maxWidth: 345,
        height: 350,
        maxHeight: 350,
        marginTop: 15,
        overflowY: 'scroll'
    },
    media: {
        height: 140,
    }
}));