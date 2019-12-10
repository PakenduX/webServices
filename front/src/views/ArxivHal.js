import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import SearchIcon from '@material-ui/icons/Search'
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import logo from '../images/logo.png'
import logoHal from '../images/hal.png'
import axios from 'axios'
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Switch from '@material-ui/core/Switch'
import Header from "../components/Header";
import {useStyles} from "../components/Styles";
import {withSnackbar} from "../components/SnackBar";

function ArxivHal({ snackbar }) {
    const classes = useStyles();

    const [arxivResuts, setArxivResuts] = useState([])
    const [halResuts, setHalResuts] = useState([])
    const [search, setSearch] = useState('')
    const [halLoading, setHalLoading] = useState(false)
    const [arxivLoading, setArxivLoading] = useState(false)
    const [searchAuthorsDocumentsChecked, setSearchAuthorsDocumentsChecked] = useState(false)
    const [searchCoAuthorsChecked, setSeachCoAuthorsChecked] = useState(false)
    const [generalSearchChecked, setGeneralSearchChecked] = useState(true)
    const [arxiv, setArxiv] = useState(true)
    const [hal, setHal] = useState(false)
    const [token, setToken] = useState('')

    const arxivSubmit = () => {
        axios.post('http://localhost:5000/arxiv', { search: search, token: token })
            .then(res => {
                setArxivLoading(false)
                if(res.data.status !== undefined){
                    snackbar.showMessage(res.data.message)
                } else {
                    setArxivResuts(res.data.result)
                }
            })
            .catch(error => {
                console.log(error)
                snackbar.showMessage('Problème de communication avec le serveur')
                setArxivLoading(false)
            })
    }

    const halSubmit = () => {
        axios.post('http://localhost:5000/hal', { search: search, token: token })
            .then(res => {
                setHalLoading(false)
                if(res.data.status !== undefined){
                    snackbar.showMessage(res.data.message)
                } else {
                    setHalResuts(res.data.response.docs)
                }
            })
            .catch(error => {
                console.log(error)
                snackbar.showMessage('Problème de communication avec le serveur')
                setHalLoading(false)
            })
    }

    const submit = (e) => {
        e.preventDefault()
        if(token === ''){
            snackbar.showMessage('No access token entered')
        } else {
            setArxivLoading(true)
            setHalLoading(true)
            if (arxiv && !hal) {
                arxivSubmit()
            } else if (hal && !arxiv) {
                halSubmit()
            } else {
                arxivSubmit()
                halSubmit()
            }
        }
    }

    const handleChecked = (checked) => {
        if(checked === 'generalSearchChecked'){
            setGeneralSearchChecked(true)
            setSeachCoAuthorsChecked(false)
            setSearchAuthorsDocumentsChecked(false)

        } else if(checked === 'searchAuthorsDocumentsChecked'){
            setGeneralSearchChecked(false)
            setSeachCoAuthorsChecked(false)
            setSearchAuthorsDocumentsChecked(true)
        } else {
            setGeneralSearchChecked(false)
            setSeachCoAuthorsChecked(true)
            setSearchAuthorsDocumentsChecked(false)
        }
    }

    return (
        <>
            <Header />
            <Grid
                justify="center"
                style={{ marginRight: '15%', marginLeft: '15%', marginTop: 50}}
            >
                <Grid item>
                    <form noValidate autoComplete="off">
                        <TextField
                            id="search"
                            label="Search..."
                            type="text"
                            name="search"
                            margin="normal"
                            variant="outlined"
                            defaultValue={search}
                            onChange={(e) => setSearch(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            id="token"
                            label="Token d'accès"
                            type="text"
                            name="token"
                            margin="normal"
                            variant="outlined"
                            defaultValue={search}
                            onChange={(e) => setToken(e.target.value)}
                            fullWidth
                        />
                    </form>
                    <hr/>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={arxiv}
                                    onChange={() => setArxiv(!arxiv)}
                                    value="Arxiv"
                                    style={{color: 'black'}}
                                />
                            }
                            label="Arxiv"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={hal}
                                    onChange={() => setHal(!hal)}
                                    value="HAL"
                                    style={{color: 'black'}}
                                />
                            }
                            label="HAL"
                        />
                    </FormGroup>
                    <hr/>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={generalSearchChecked}
                                    onChange={() => handleChecked('generalSearchChecked')}
                                    value="generalSearch"
                                    style={{color: 'black'}}
                                />
                            }
                            label="General search"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={searchAuthorsDocumentsChecked}
                                    onChange={() => handleChecked('searchAuthorsDocumentsChecked')}
                                    value="searchAuthorsDocuments"
                                    style={{color: 'black'}}
                                />
                            }
                            label="Search author documents"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={searchCoAuthorsChecked}
                                    onChange={() => handleChecked('searchCoAuthorsChecked')}
                                    value="searchCoAuthors"
                                    style={{color: 'black'}}
                                />
                            }
                            label="Search co-authors"
                        />
                    </FormGroup>
                    <hr/>
                </Grid>
            </Grid>
            <Grid
                spacing={2}
                justify="center"
                container
                style={{ marginTop: 50}}
            >
                <Grid item>
                    <Button
                        variant="outlined"
                        onClick={submit}
                        //disabled={ halLoading && arxivLoading}
                        style={{backgroundColor: 'black', color: 'white'}}
                    >
                        <SearchIcon/>
                        Search
                    </Button>
                </Grid>
                {
                    halLoading && arxivLoading ?
                        <Grid item>
                            <CircularProgress />
                        </Grid> :
                        null
                }
            </Grid>

            <Grid
                container
                spacing={2}
                justify="center"
            >
                {
                    arxiv ?
                        arxivResuts.map((res, key) =>
                            <Grid item key={key}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.media}
                                        image={logo}
                                        title="Arxiv And Hal Engine Search"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="h6">
                                            { res.title }
                                        </Typography>
                                        <Typography variant='body1'>Author :</Typography>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            { res.author }
                                        </Typography>
                                        <Typography variant='body1'>PDF :</Typography>
                                        <Typography gutterBottom variant="h6" component="h6">
                                            { res.pdf_url }
                                        </Typography>
                                        {
                                            searchCoAuthorsChecked ?
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                >
                                                    Co-authors:
                                                </Typography> :
                                                null
                                        }
                                        {
                                            generalSearchChecked ?
                                                <Typography variant='body1'>Summary :</Typography>:null
                                        }
                                        {
                                            generalSearchChecked || searchAuthorsDocumentsChecked ?
                                                res.summary :
                                                res.authors.map((auth, key) => <Typography key={key}>{auth}</Typography>)
                                        }
                                    </CardContent>
                                </Card>
                            </Grid>
                        ) :
                        null
                }
                {
                    hal ?
                        halResuts.map((res, key) =>
                            <Grid item key={key}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.media}
                                        image={logoHal}
                                        title="Arxiv and Hal Engine Search"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="h6">
                                            { res.label_s.split('.')[1] }
                                        </Typography>
                                        <Typography variant='body1'>Author :</Typography>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            { (res.label_s.split('.')[0]).split(',')[0] }
                                        </Typography>
                                        <Typography variant='body1'>URL</Typography>
                                        <Typography gutterBottom variant="h6" component="h6">
                                            { res.uri_s }
                                        </Typography>
                                        {
                                            searchCoAuthorsChecked ?
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                >
                                                    Co-authors:
                                                </Typography> :
                                                null
                                        }
                                        {
                                            generalSearchChecked ?
                                                <Typography variant='body1'>Summary :</Typography> : null
                                        }
                                        {
                                            generalSearchChecked || searchAuthorsDocumentsChecked ?
                                                res.label_s.split('.')[1] :
                                                (res.label_s.split('.')[0])
                                                    .split(',')
                                                    .map((auth, key) => <Typography key={key}>{auth}</Typography>)
                                        }
                                    </CardContent>
                                </Card>
                            </Grid>
                        ) :
                        null
                }
            </Grid>
        </>
    );
}

export default withSnackbar(ArxivHal)
