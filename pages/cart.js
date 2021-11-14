import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import useStyles from '../utils/styles';
import DeleteForeverOutlined from '@material-ui/icons/DeleteForeverOutlined';

function CartScreen() {
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Este produto está fora de estoque!');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    router.push('/shipping');
  };

  return (
    <Layout title=" Carrinho de Compras">
      <Grid
        container
        space={1}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography component="h1" variant="h1">
          Carrinho de Compras
        </Typography>
        {cartItems.length === 0 ? (
          <div>
            <NextLink href="/" passHref>
              <Link>
                <Typography component="h3" variant="h3">
                  Voltar às compras!
                </Typography>
              </Link>
            </NextLink>
          </div>
        ) : (
          <Grid
            container
            space={1}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item md={9} xs={12} className={classes.cartinho}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography component="h3" variant="h3">
                          Produto{' '}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography component="h3" variant="h3">
                          Nome{' '}
                        </Typography>
                      </TableCell>
                      <TableCell aligh="right">
                        <Typography component="h3" variant="h3">
                          Quantidade{' '}
                        </Typography>
                      </TableCell>
                      <TableCell aligh="right">
                        <Typography component="h3" variant="h3">
                          Preço{' '}
                        </Typography>
                      </TableCell>
                      <TableCell aligh="right">
                        <Typography component="h3" variant="h3">
                          Remover{' '}
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
                        <TableCell aligh="right">
                          <Select
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartHandler(item, e.target.value)
                            }
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <MenuItem key={x + 1} value={x + 1}>
                                {x + 1}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell aligh="right">
                          <Typography component="h3" variant="h3">
                            R$ {item.price}
                          </Typography>
                        </TableCell>
                        <TableCell aligh="right">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => removeItemHandler(item)}
                          >
                            <DeleteForeverOutlined fontSize="medium" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid>
                <Card className={classes.section}>
                  <List>
                    <ListItem>
                      <Typography variant="h2" component="h2">
                        Subtotal (
                        {cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                        Produtos): R$
                        {cartItems.reduce(
                          (a, c) => a + c.quantity * c.price,
                          0
                        )}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Button
                        onClick={checkoutHandler}
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        <Typography variant="h3" component="h3">
                          Finalizar Compra
                        </Typography>
                      </Button>
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
