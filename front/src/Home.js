import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import SearchIcon from '@material-ui/icons/Search'
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import logo from './images/logo.png'
import axios from 'axios'
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Switch from '@material-ui/core/Switch'


const useStyles = makeStyles(theme => ({
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
    },
}));

export default function Home() {
    const classes = useStyles();

    const [resuts, setResults] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [searchAuthorsDocumentsChecked, setSearchAuthorsDocumentsChecked] = useState(false)
    const [searchCoAuthorsChecked, setSeachCoAuthorsChecked] = useState(false)
    const [generalSearchChecked, setGeneralSearchChecked] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        setLoading(true)
        let typeOfSearch = ''
        if(searchAuthorsDocumentsChecked) {
            typeOfSearch = 'searchAuthorsDocumentsChecked'
        } else if (searchCoAuthorsChecked) {
            typeOfSearch = 'searchCoAuthorsChecked'
        } else {
            typeOfSearch = 'generalSearchChecked'
        }
        axios.post('http://localhost:5000/', { search: search, typeOfSearch: typeOfSearch })
            .then(res => {
                setLoading(false)
                setResults(res.data.result)
                console.log(res.data.result)
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
            })
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
        <div className='container-fluid'>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Arxiv Search Engine
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid
                justify="center"
                style={{ marginRight: '15%', marginLeft: '15%'}}
            >
                <Grid item>
                    <form noValidate autoComplete="off">
                        <TextField
                            id="search"
                            label="Search..."
                            type="search"
                            name="search"
                            margin="normal"
                            variant="outlined"
                            defaultValue={search}
                            onChange={(e) => setSearch(e.target.value)}
                            fullWidth
                        />
                    </form>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={generalSearchChecked} 
                                    onChange={() => handleChecked('generalSearchChecked')} 
                                    value="generalSearch" />
                            }
                            label="General search"
                        />
                        <FormControlLabel
                            control={
                            <Switch
                                checked={searchAuthorsDocumentsChecked}
                                onChange={() => handleChecked('searchAuthorsDocumentsChecked')}
                                value="searchAuthorsDocuments"
                                color="primary"
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
                                color="primary"
                            />
                            }
                            label="Search co-authors"
                        />
                    </FormGroup>
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
                        color="primary"
                        onClick={submit}
                        disabled={loading}
                    >
                        <SearchIcon/>
                        Search
                    </Button>
                </Grid>
                {
                    loading ?
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
                    resuts.map((res, key) =>
                        <Grid item key={key}>
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.media}
                                    image={logo}
                                    title="Arxiv Engine Search"
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
                                        generalSearchChecked ?
                                            res.summary :
                                            res.authors.map((auth, key) => <Typography key={key}>{auth}</Typography>)
                                    }
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                }
            </Grid>
        </div>
    );
}
