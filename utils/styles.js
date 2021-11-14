import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  //TOOLBAR

  navbar: {
    backgroundColor: '#36465F',
    '& a': {
      color: '#FFFFFF',
      marginLeft: 10,
      marginRight: 10,
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

  //MAIN PAGE

  main: {
    minHeight: '80vh',
    marginLeft: 0,
    padding: 0,
    maxWidth: '100%',
  },

  //FOOTER

  footer: {
    textAlign: 'center',
    color: '#d3d3d3',
    minHeight: '45vh',
    backgroundColor: 'black',
    padding: '10px',
  },

  //SECTIONS

  section: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: '10px',
  },

  //FORM LOGIN/REGISTER/SHIPPING ADDRESS

  form: {
    width: '100%',
    maxWidth: 500,
    margin: '0 auto',
  },

  //NAVBAR

  navbarButton: {
    color: 'white',
    textTransform: 'initial',
    margin: '10px',
  },

  //CHECKOUT WIZARD

  transparentBackgroud: {
    backgroundColor: 'transparent',
  },

  //ERROR

  error: {
    color: '#f04040',
  },

  //MARGIN PAGES

  /*marginPages: {
    marginLeft: '10%',
    marginRight: '10%',
  },*/

  //CARDS

  marginCards: {
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '-20rem',
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
    minHeight: '45vh',
  },

  ourProductsText: {
    marginLeft: '5%',
    fontWeight: 'bold',
    paddingTop: '1.8rem',
  },

  //CONTACT US

  contactUs: {
    backgroundColor: '#939393',
    minHeight: '45vh',
  },

  formMargin: {
    marginTop: '-10px',
    marginLeft: '30%',
    marginRight: '30%',
    padding: '10px',
    textAlign: 'center',
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

  //PAYPAL BUTTONS
  fullWidth: {
    width: '100%',
    alignContent: 'center',
  },

  pad: {
    padding: '5px',
  },

  cartinho: {
    padding: '5px',
  },

  bordinha: {
    borderRadius: '8px',
  },

  margem: {
    marginTop: '10px',
  },
});

export default useStyles;
