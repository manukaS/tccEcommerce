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
  const { dispatch } = useContext(Store);
  const { product } = props;
  const classes = useStyles();
  if (!product) {
    return <div>Product Not Found!</div>;
  }
  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock <= 0) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } });
    router.push('/cart');
  };
  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography component="h2" variant="h2">
              back to products
            </Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={600}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h2" variant="h2">
                Category: {product.category}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h2" variant="h2">
                Brand: {product.brand}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h2" variant="h2">
                Rating: {product.rating} stars ({product.numReviews} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h2" variant="h2">
                Description: {product.description}
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography component="h2" variant="h2">
                      Price
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography component="h2" variant="h2">
                      R${product.price}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography component="h2" variant="h2">
                      Status
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography component="h2" variant="h2">
                      {product.countInStock > 0 ? 'In Stock' : 'Unavailable'}
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
                  <Typography component="h2" variant="h2">
                    Add to cart
                  </Typography>
                </Button>
              </ListItem>
            </List>
          </Card>
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
