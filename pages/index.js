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
import NextLink from 'next/link';
import Layout from '../components/Layout';
import Product from '../models/Product';
import db from '../utils/db';

export default function Home(props) {
  const { products } = props;
  return (
    <Layout>
      <div>
        <Typography component="h1" variant="h1">
          <h1>Lorem</h1>
        </Typography>
      </div>
      <div>
        <Typography component="h1" variant="h1">
          <h1>Our Products</h1>
        </Typography>
      </div>
      <div>
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
                      <Typography component="h3" variant="h3">
                        {product.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography component="h3" variant="h3">
                    R$ {product.price}
                  </Typography>
                  <Button size="small" color="primary">
                    <Typography component="h3" variant="h3">
                      Add to cart
                    </Typography>
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <div>
        <Typography component="h1" variant="h1">
          <h1>Contact Us</h1>
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
