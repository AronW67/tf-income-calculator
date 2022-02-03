import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    appContainer: {
      background: '#00121f',
      minHeight: '100vh',
      paddingBottom: '4rem'
    },
    headerContainer: {
      padding: '2rem'
    },
    appHeader: {
      textAlign: 'center',
      fontSize: '36px !important',
      fontWeight: 'bold !important',
      color: '#f6e05e',
      paddingBottom: '1rem' 
    },
    appSubHeader: {
      color: 'white',
      fontSize: '18px !important',
      textAlign: 'center',
      lineHeight: '24px',
      verticalAlign: 'top'
    },
    coinGeckoLogo: {
      width: '140px',
      height: '100%',
      verticalAlign: 'middle',
      marginLeft: '1rem'
    },
    paper: {
      width: '90%',
      padding: '5%',
      background: '#f7f4e9 !important',
      color: 'white !important',
      border: '1px solid #f6e05e'
    },
    formControl: {
      margin: '2rem 0 !important',
      width: '100%'
    },
    nodeEntryHeader: {
      fontSize: '24px !important',
      color: '#000000'
    },
    nodeTypeSelector: {
      width: '100%'
    },
    button: {
      padding: '1rem 2rem !important',
      verticalAlign: 'top !important'
    },
    nodeListMessage: {
      color: 'black',
      padding: '2rem 0 !important',
      display: 'block'
    },
    dataGrid: {
      margin: '2rem 0'
    },
    loadingContainer: {
      display: 'inline-block',
      margin: '0 1rem '
    }
  });

  export default useStyles;