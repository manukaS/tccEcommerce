import React, { useContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Grid,
  TableContainer,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Card,
  List,
  ListItem,
  CircularProgress,
} from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import useStyles from '../../utils/styles';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    default:
      state;
  }
}

function Order({ params }) {
  const orderId = params.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const classes = useStyles();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order, successPay }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: '',
    }
  );

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    //taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'BRL',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, successPay]);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        enqueueSnackbar('O pedido foi pago!', { variant: 'success' });
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    });
  }

  function onError(err) {
    enqueueSnackbar(getError(err), { variant: 'error' });
  }

  return (
    <Layout title={`Pedido ${orderId}`}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
        <Grid
          container
          spacing={1}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    Seu Pedido
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography component="h3" variant="h3">
                    Código do Pedido: {orderId}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    <strong>Endereço de Entrega</strong>
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography component="h3" variant="h3">
                    {shippingAddress.fullName}, {shippingAddress.address},{' '}
                    {shippingAddress.state}, {shippingAddress.city},{' '}
                    {shippingAddress.postalCode}, {shippingAddress.country}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography component="h3" variant="h3">
                    Status da Entrega:{' '}
                    {isDelivered ? `Postado em ${deliveredAt}` : 'Não Postado'}
                  </Typography>
                </ListItem>
              </List>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    <strong>Método de Pagamento</strong>
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography component="h3" variant="h3">
                    {paymentMethod}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography component="h3" variant="h3">
                    Status de Pagamento:{' '}
                    {isPaid ? `Pago em ${paidAt}` : 'Não Pago'}
                  </Typography>
                </ListItem>
              </List>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    <strong>Seus Produtos</strong>
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography component="h3" variant="h3">
                              Produto
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component="h3" variant="h3">
                              Nome
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography component="h3" variant="h3">
                              Quantidade
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography component="h3" variant="h3">
                              Valor{' '}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} passHref>
                                <Link>
                                  <Image
                                    className={classes.bordinha}
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                  ></Image>
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} passHref>
                                <Link>
                                  <Typography component="h3" variant="h3">
                                    {item.name}
                                  </Typography>
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell align="right">
                              <Typography component="h3" variant="h3">
                                {item.quantity}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography component="h3" variant="h3">
                                R$ {item.price}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
            {/*<Card className={classes.section}></Card>
            <Card className={classes.section}></Card>*/}{' '}
            <Grid fullWidth>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography variant="h2">
                      <strong>Realizar Pagamento</strong>
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography component="h3" variant="h3">
                          Valor dos Produtos:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right" component="h3" variant="h3">
                          R$ {itemsPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {/* <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Taxa:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">R$ {taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>*/}
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography component="h3" variant="h3">
                          Frete:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right" component="h3" variant="h3">
                          R$ {shippingPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography component="h3" variant="h3">
                          <strong>Total:</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right" component="h3" variant="h3">
                          <strong>R$ {totalPrice}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {!isPaid && (
                    <ListItem>
                      {isPending ? (
                        <CircularProgress />
                      ) : (
                        <div className={classes.fullWidth}>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}
                    </ListItem>
                  )}
                </List>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
