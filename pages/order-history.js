import NextLink from 'next/link';
import {
  Grid,
  List,
  ListItem,
  TableContainer,
  Typography,
  Card,
  CircularProgress,
  TableCell,
  ListItemText,
} from '@material-ui/core';
import { Button, Table, TableBody, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function OrderHistory() {
  const { state } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);
  return (
    <Layout title="Histórico de Pedidos">
      <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Perfil"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Histórico de Pedidos"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Histórico de Pedidos
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography component="h3" variant="h3">
                              Pedido
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component="h3" variant="h3">
                              Data
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component="h3" variant="h3">
                              Valor
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component="h3" variant="h3">
                              Pagamento
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component="h3" variant="h3">
                              Entrega
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component="h3" variant="h3">
                              Detalhes
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>
                              <Typography component="h3" variant="h3">
                                {order._id.substring(20, 24)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography component="h3" variant="h3">
                                {order.createdAt}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography component="h3" variant="h3">
                                R$ {order.totalPrice}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography component="h3" variant="h3">
                                {order.paidAt
                                  ? `Pago em ${order.paidAt}`
                                  : 'Não Pago'}{' '}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography component="h3" variant="h3">
                                {order.isDelivered
                                  ? `Postado em ${order.isDelivered}`
                                  : 'Não Postado'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">
                                  {' '}
                                  <Typography component="h3" variant="h3">
                                    Detalhes{' '}
                                  </Typography>
                                </Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
