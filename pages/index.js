import { useState } from 'react';
import Head from 'next/head';
import {
  useTheme,
  useMediaQuery,
  makeStyles,
  Grid,
  TextField,
  Chip
} from '@material-ui/core';
import CoinsTable from '../components/CoinsTable';

const useStyles = makeStyles({
  container: { margin: '2em 0' },
  col: { marginBottom: '2em' }
});

export default function Home({ cryptocurrencies, categories }) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [crypto, setCrypto] = useState('');
  const [show, setShow] = useState('crptocurrencies');

  const handleChange = e => {
    setCrypto(e.target.value);
  };

  return (
    <div>
      <Head>
        <title>Crypto Tracker</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Grid container justifyContent='center'>
        <Grid
          item
          style={{
            width: '80%'
          }}
        >
          <Grid
            container
            className={classes.container}
            direction='column'
            alignItems='center'
          >
            <Grid item className={classes.col}>
              Header
            </Grid>
            <Grid item className={classes.col}>
              <TextField
                label='Search'
                value={crypto}
                onChange={handleChange}
                variant='outlined'
              />
            </Grid>
            <Grid item style={{ alignSelf: 'flex-start' }}>
              <Grid item container direction='row' spacing={2}>
                <Grid item>
                  <Chip label='Cryptocurrencies' onClick={() => {}} />
                </Grid>
                <Grid item>
                  <Chip label='Categories' onClick={() => {}} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <CoinsTable arr={cryptocurrencies} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export async function getServerSideProps() {
  const BASE_URL = 'https://api.coingecko.com/api/v3';

  const cryptocurrencies = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&per_page=250`,
    {
      headers: { Accept: 'application/json' },
      method: 'GET'
    }
  ).then(res => res.json());

  const categories = await fetch(`${BASE_URL}/coins/categories`, {
    headers: { Accept: 'application/json' },
    method: 'GET'
  }).then(res => res.json());

  return {
    props: { cryptocurrencies, categories }
  };
}
