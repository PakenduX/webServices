import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Arxiv from "./Arxiv";
import Hal from "./Hal";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    appBar: {
        backgroundColor: 'black'
    }
}));

export default function Home() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };

    return (
        <div className='container-fluid'>
            <AppBar
                position="static"
                className={classes.appBar}
            >
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Arxiv And Hal Search Engine
                    </Typography>
                </Toolbar>
            </AppBar>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="Arxiv and hal services"
                style={{paddingBottom: 30}}
            >
                <Tab label="ARXIV" {...a11yProps(0)} />
                <Tab label="HAL" {...a11yProps(1)} />
            </Tabs>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
                style={{paddingBottom: 30}}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <Arxiv/>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <Hal/>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}
