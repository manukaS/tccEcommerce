import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#36465F',
    '& a': {
      color: '#FFFFFF',
      marginLeft: 10,
    },
  },

  brand: {
    fontWeight: 'bold',
    fontSize: '1.3rem',
    fontFamily: 'Poppins',
  },

  grow: {
    flexGrow: 1,
  },

  main: {
    minHeight: '80vh',
  },

  footer: {
    textAlign: 'center',
    color: '#d3d3d3',
    minHeight: '15vh',
    backgroundColor: 'black',
    marginTop: 10,
  },

  section: {
    marginTop: 10,
    marginBottom: 10,
  },

  form: {
    maxWidth: 800,
    margin: '0 auto',
  },

  navbarButton: {
    color: 'white',
    textTransform: 'initial',
  },

  /*loremText: {
    marginLeft: '15%',
    fontWeight: 'bold',
    fontSize: '3.5rem',
  },*/

  /*ourProducts: {
    backgroundColor: '#64E294',
    minHeight: '30vh',
    width: '100%',
  },*/

  /*ourProductsText: {
    marginLeft: '15%',
    fontWeight: 'bold',
    fontSize: '3.5rem',
  },*/

  /*cards: {
    marginTop: '-12.5rem',
  },*/

  /*contactUs: {
    backgroundColor: '#939393',
    minHeight: '30vh',
    width: '100%',
    textAlign: 'center',
  },*/

  /*contactUsText: {
    fontWeight: 'bold',
    fontSize: '3.5rem',
  },*/
});

export default useStyles;
