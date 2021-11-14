import Image from 'next/image';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import useStyles from '../../utils/styles';
import Product from '../../models/Product';
import db from '../../utils/db';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';

export default function ProductScreen(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { product } = props;
  const classes = useStyles();
  if (!product) {
    return <div>Produto não encontrado!</div>;
  }
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Este produto está fora de estoque!');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };
  return (
    <Layout title={product.name} description={product.description}>
      <Grid
        container
        space={1}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <div className={classes.section}>
          <NextLink href="/" passHref>
            <Link>
              <Typography component="h2" variant="h2">
                Voltar para a Loja
              </Typography>
            </Link>
          </NextLink>
        </div>
        <Grid container spacing={1} className={classes.pad}>
          <Grid item md={6} xs={12}>
            <Image
              className={classes.bordinha}
              src={product.image}
              alt={product.name}
              width={800}
              height={600}
              layout="responsive"
            ></Image>
          </Grid>

          <Grid item md={3} xs={12}>
            <Grid item md={12} xs={12}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    {product.name}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography component="h3" variant="h3">
                    Categoria: {product.category}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography component="h3" variant="h3">
                    Marca: {product.brand}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography component="h3" variant="h3">
                    Avaliações: {product.rating} Estrelas ({product.numReviews}{' '}
                    avaliações)
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography component="h3" variant="h3">
                    Descrição: {product.description}
                  </Typography>
                </ListItem>
              </List>
            </Grid>
            <Card>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography component="h3" variant="h3">
                        Preço
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography component="h3" variant="h3">
                        R$ {product.price}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography component="h3" variant="h3">
                        Status do Estoque
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography component="h3" variant="h3">
                        {product.countInStock > 0
                          ? 'Disponível'
                          : 'Indisponível'}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={addToCartHandler}
                  >
                    <Typography component="h3" variant="h3">
                      Adicionar ao Carrinho
                    </Typography>
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
