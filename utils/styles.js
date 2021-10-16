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
    marginLeft: 0,
    padding: 0,
    maxWidth: '100%',
  },

  footer: {
    textAlign: 'center',
    color: '#d3d3d3',
    minHeight: '15vh',
    backgroundColor: 'black',
    marginTop: 0,
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
    margin: '10px',
  },

  transparentBackgroud: {
    backgroundColor: 'transparent',
  },

  error: {
    color: '#f04040',
  },

  marginPages: {
    marginLeft: '10%',
    marginRight: '10%',
  },

  cartCss: {
    marginTop: '15px',
  },

  abcd: {
    marginTop: '10px',
  },

  //CARDS

  marginCards: {
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '-14.5rem',
  },

  align: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px',
  },

  buttonAlign: {
    justifyContent: 'end',

    paddingTop: '0px',
  },
  //LOREM

  loremText: {
    marginLeft: '5%',
    fontWeight: 'bold',
  },

  //OUT PRODUCTS

  ourProducts: {
    backgroundColor: '#64E294',
    minHeight: '35vh',
  },

  ourProductsText: {
    marginLeft: '5%',
    fontWeight: 'bold',
    paddingTop: '1.8rem',
  },

  //CONTACT US

  contactUs: {
    backgroundColor: '#939393',
    minHeight: '35vh',
  },

  contactUsText: {
    fontWeight: 'bold',
    paddingTop: '1.8rem',
    textAlign: 'center',
    marginBottom: 10,
  },

  //HORIZONTAL LINE

  lineFooter: {
    margin: 0,
  },
});

export default useStyles;
