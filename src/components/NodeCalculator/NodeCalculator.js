import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import useStyles from './styles';
import coinGeckoLogo from '../../images/coingecko-logo-white.webp';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Button from '@mui/material/Button';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import axios from 'axios';
import GavelIcon from '@mui/icons-material/Gavel';
import CircularProgress from '@mui/material/CircularProgress';


const NodeCalculator = () => {

    const classes = useStyles();

    const [nodeId, setNodeId] = React.useState(1);

    const [nodeType, setNodeType] = React.useState('');

    const [nodeDate, setNodeDate] = React.useState(null);

    const [nodeList, setNodeList] = React.useState([]);

    const [gridLoading, setGridLoading] = React.useState(false);

    const handleNodeType = (event) => {
        setNodeType(event.target.value);
    };

    const getNodeReward = (nodeType) => {
        switch(nodeType) {
            case 'odin':
              return 1.02;
            case 'thor':
              return 0.144;
            default:
              return 0;
          }
    };

    const addNode = () => {
        if (nodeType === '' || nodeDate === null) return;

        // Set gridLoading true
        setGridLoading(true);

        // Get reward value for node
        let reward = getNodeReward(nodeType);

        // Set start and dates, calculate number of days to get price
        let startDay = moment(nodeDate);
        let endDay = moment(new Date());
        let days = (startDay.diff(endDay, 'days') * -1);
                    
        // Calculate total token reward
        let tokens = reward * (days + 1);

        // Get prices from Coingecko
        getPrices(days).then((data) => {
            let prices = data.prices;
            let total = 0;
            prices.forEach(price => {
                // Add price to total
                total = total + (price[1] * reward);
                // When total is calculated update nodeList state
                if (moment(price[0]).format('DD-MM-YYYY') === endDay.format('DD-MM-YYYY')) {
                    let newNodeData = {id: nodeId, type: nodeType, nodeReward: reward, purchaseDate: moment(nodeDate).format('DD-MM-YYYY'), purchaseDateUnformatted: nodeDate, totalTokens: tokens, totalIncome: total};
                    setNodeList([...nodeList, newNodeData]);
                    setNodeId(nodeId + 1);

                    // Set gridLoading false
                    setGridLoading(false);
                }
            })
        })
    };

    const getPrices = async (days) => {
        try {
            let res = await axios.get(`https://api.coingecko.com/api/v3/coins/thor/market_chart?vs_currency=usd&days=${days}&interval=daily`);
            return res.data;
        } catch (e) {
            console.log(e.message);
        }
    };

    const nodeGridColumns = [
        {
            field: 'id',
            headerName: 'Id',
            width: 150,
            editable: false
        },
        {
            field: 'type',
            headerName: 'Node Type',
            width: 150,
            editable: false
        },
        {
            field: 'purchaseDate',
            headerName: 'Purchase Date',
            width: 150,
            editable: false
        },
        {
            field: 'totalTokens',
            headerName: 'Total Tokens Received',
            width: 200,
            editable: false
        },
        {
            field: 'totalIncome',
            headerName: 'Total Income (At Distribution Price)',
            width: 300,
            editable: false
        }
    ];

    return (
            <>
                <div className={classes.appContainer}>
                    <Container maxWidth="lg">
                        <Box className={classes.headerContainer}>
                            <Typography variant="h1" className={classes.appHeader}><GavelIcon /> Thor Finance Tax Calculator</Typography> 
                            <Typography variant="h3" className={classes.appSubHeader}>Powered By: <img src={coinGeckoLogo} alt="Coin gecko logo" className={classes.coinGeckoLogo} /></Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Paper elevation={3} className={classes.paper}>
                                        <Typography variant="h2" className={classes.nodeEntryHeader}>Enter Your Node Below:</Typography>
                                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} className={classes.formControl}>
                                            <Grid container spacing={4}>
                                                <Grid item xs={6} md={3}>
                                                    <InputLabel>Node Type</InputLabel>
                                                    <Select
                                                    value={nodeType}
                                                    onChange={handleNodeType}
                                                    label="Node Type"
                                                    className={classes.nodeTypeSelector}
                                                    >
                                                        <MenuItem value={'thor'}>Thor</MenuItem>
                                                        <MenuItem value={'odin'}>Odin</MenuItem>
                                                    </Select>
                                                </Grid>
                                                <Grid item xs={6} md={6}>
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <DatePicker
                                                            label="Date of Purchase"
                                                            value={nodeDate}
                                                            maxDate={new Date()}
                                                            onChange={(newNodeDate) => {
                                                            setNodeDate(newNodeDate);
                                                            }}
                                                            renderInput={(params) => <TextField {...params} />}
                                                        />
                                                    </LocalizationProvider>                                               
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button variant="contained" className={classes.button} onClick={addNode} disabled={gridLoading ? true : false}>Add Node</Button>
                                                    <Box className={classes.loadingContainer} display={gridLoading ? 'inline-block' : 'none'}>
                                                        <CircularProgress />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </FormControl>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper elevation={3} className={classes.paper} height="auto">
                                        <Typography variant="h2" className={classes.nodeEntryHeader}>Added Nodes:</Typography>
                                        {nodeList.length > 0 ? (
                                            <>
                                                <DataGrid 
                                                className={classes.dataGrid} 
                                                rows={nodeList} 
                                                columns={nodeGridColumns} 
                                                pageSize={5} 
                                                rowsPerPageOptions={[5]} 
                                                columnBuffer={3}
                                                components={{ Toolbar: GridToolbar }} 
                                                autoHeight
                                                />                                         
                                            </>
                                        ) : (
                                            <Typography variant="p" className={classes.nodeListMessage}>Add your node details to get started.</Typography>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                </div>

            </>
        )
};

export default NodeCalculator;
