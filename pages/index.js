import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import Layout from '../components/Layout';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';

export default function Home(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { products } = props;
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };
  const classes = useStyles();
  return (
    <Layout>
      <div>
        <Typography component="h1" variant="h1">
          <h1 className={classes.loremText}>Lorem</h1>
        </Typography>
      </div>
      <div className={classes.ourProducts}>
        <Typography component="h1" variant="h1">
          <h1 className={classes.ourProductsText}>Our Products</h1>
        </Typography>
      </div>
      <div className={classes.marginCards}>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <CardActions className={classes.align}>
                        <div>
                          <Typography component="h3" variant="h3">
                            {product.name}
                          </Typography>
                        </div>
                        <div>
                          <Typography component="h3" variant="h3">
                            R$ {product.price}
                          </Typography>
                        </div>
                      </CardActions>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions className={classes.buttonAlign}>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => addToCartHandler(product)}
                  >
                    <AddShoppingCart fontSize="large" />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <div className={classes.contactUs}>
        <Typography component="h1" variant="h1">
          <h1 className={classes.contactUsText}>Contact Us</h1>
        </Typography>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
