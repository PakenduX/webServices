import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Header from "../components/Header";
import Box from "@material-ui/core/Box";
import {withSnackbar} from "../components/SnackBar";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            3BGTeam{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function TokenPage({history}) {

    return (
        <>
            <Header />
            <Container component="main" style={{ paddingTop: 50, justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h5">Thanks for your subscription</Typography>
                <Typography variant="caption">This is your access token to our API : </Typography>
                <Typography variant="caption">{localStorage.getItem('access_token')}</Typography>
                <Container style={{ paddingTop : 50 }}>
                        <Button variant="outlined" onClick={() => history.push('/')}>
                            Sign In to start using your API
                        </Button>
                </Container>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
}

export default withSnackbar(TokenPage)