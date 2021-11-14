import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
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
  Button,
  Card,
  List,
  ListItem,
  CircularProgress,
} from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import useStyles from '../utils/styles';
import CheckoutWizard from '../components/CheckoutWizard';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import Cookies from 'js-cookie';

function PlaceOrder() {
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 0;
  const taxPrice = round2(itemsPrice * 0);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const placeOrderHandler = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'CART_CLEAR' });
      Cookies.remove('cartItems');
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="Confirmar Pedido">
      <CheckoutWizard activeStep={3}></CheckoutWizard>

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
              </List>
              <List>
                <ListItem>
                  <Typography component="h3" variant="h3">
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
                              Valor
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartItems.map((item) => (
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
            </List>
          </Card>
          {/*<Card className={classes.section}></Card>
          <Card className={classes.section}></Card> */}
          <Grid fullWidth>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">
                    <strong>Confirmar Pedido</strong>
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
                {/*<ListItem>
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
                <ListItem>
                  <Button
                    onClick={placeOrderHandler}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    <Typography component="h3" variant="h3">
                      Confirmar Pedido
                    </Typography>
                  </Button>
                </ListItem>
                {loading && (
                  <ListItem>
                    <CircularProgress />
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
