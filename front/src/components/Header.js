import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar/AppBar";
import React from "react";
import {useStyles} from "./Styles";

export default function Header() {
    const classes = useStyles()

    return (
        <AppBar
            position="static"
            className={classes.appBar}
        >
            <div style={{flexDirection: 'row', flex: 1}}>
                <Toolbar>
                    <div style={{width: '80%'}}>
                        <Typography variant="h6" className={classes.title}>
                            Arxiv And Hal Search Engine
                        </Typography>
                    </div>
                    <div style={{flex: 1}}>
                        <Typography variant="h6" className={classes.title}>
                            3BGTeam
                        </Typography>
                    </div>
                </Toolbar>
            </div>
        </AppBar>
    )
}