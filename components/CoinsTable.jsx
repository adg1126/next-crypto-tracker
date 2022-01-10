import React, { useState } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Grid,
  Typography,
  Box
} from '@mui/material';

import NumberFormat from 'react-number-format';
import { makeStyles } from '@mui/styles';
import { visuallyHidden } from '@mui/utils';

const useStyles = makeStyles(theme => ({
  table: { borderCollapse: 'separate' },
  head: { backgroundColor: 'black', color: 'white' },

  semiBold: { fontWeight: '450' },
  stickyColumn: {
    position: 'sticky',
    zIndex: 1000,
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    backgroundColor: '#fff'
  },
  sticky1: { left: 0 },
  sticky2: { left: 60 },
  textRed: { color: '#ea3943' },
  textGreen: { color: '#16c784' }
}));

const descendingComparator = (a, b, orderBy) =>
  b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;

const getComparator = (order, orderBy) =>
  order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });

  return stabilizedThis.map(el => el[0]);
};

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const classes = useStyles();

  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: 'market_cap_rank',
      numeric: true,
      label: '#',
      sticky: [classes.stickyColumn, classes.sticky1].join(' ')
    },
    {
      id: 'name',
      numeric: false,
      label: 'Name',
      minWidth: 170,
      sticky: [classes.stickyColumn, classes.sticky2].join(' ')
    },
    { id: 'current_price', numeric: true, label: 'Price' },
    {
      id: 'price_change_percentage_24h',
      numeric: true,
      label: '24h %',
      minWidth: 100
    },
    { id: 'market_cap', numeric: true, label: 'Market Cap', minWidth: 170 },
    { id: 'total_volume', numeric: true, label: 'Total Volume', minWidth: 170 },
    {
      id: 'circulating_supply',
      numeric: true,
      label: 'Circulating Supply',
      minWidth: 170
    }
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ minWidth: headCell.minWidth }}
            className={headCell.sticky}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

export default function CoinsTable({ arr }) {
  const classes = useStyles(),
    [order, setOrder] = useState('asc'),
    [orderBy, setOrderBy] = useState('market_cap_rank'),
    [page, setPage] = useState(0),
    [rowsPerPage, setRowsPerPage] = useState(25);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, arr.length - page * rowsPerPage);

  return (
    <>
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby='tableTitle'
          aria-label='enhanced table'
        >
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={arr.length}
          />
          <TableBody>
            {stableSort(arr, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(
                (
                  {
                    name,
                    symbol,
                    image,
                    current_price,
                    price_change_percentage_24h,
                    market_cap,
                    total_volume,
                    market_cap_rank,
                    circulating_supply
                  },
                  i
                ) => {
                  return (
                    <TableRow key={i}>
                      <TableCell
                        align='right'
                        className={[classes.stickyColumn, classes.sticky1].join(
                          ' '
                        )}
                      >
                        {market_cap_rank}
                      </TableCell>
                      <TableCell
                        className={[classes.stickyColumn, classes.sticky2].join(
                          ' '
                        )}
                      >
                        <Grid
                          container
                          direction='row'
                          spacing={1}
                          alignItems='center'
                        >
                          <Grid
                            item
                            style={{
                              width: '1.9em',
                              height: '1.9em',
                              position: 'relative'
                            }}
                          >
                            <Image src={image} alt={name} layout='fill' />
                          </Grid>
                          <Grid item>
                            <Typography
                              className={classes.semiBold}
                              variant='body1'
                            >
                              {name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant='body1' color='textSecondary'>
                              {symbol.toUpperCase()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell align='right'>
                        <NumberFormat
                          className={classes.semiBold}
                          value={Number(current_price).toFixed(2)}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'$'}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <NumberFormat
                          className={[
                            classes.semiBold,
                            price_change_percentage_24h < 0
                              ? classes.textRed
                              : classes.textGreen
                          ].join(' ')}
                          value={Number(price_change_percentage_24h).toFixed(2)}
                          displayType={'text'}
                          suffix={'%'}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <NumberFormat
                          className={classes.semiBold}
                          value={market_cap}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'$'}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <NumberFormat
                          className={classes.semiBold}
                          value={total_volume}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'$'}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <NumberFormat
                          className={classes.semiBold}
                          value={Number(circulating_supply).toFixed(0)}
                          displayType={'text'}
                          thousandSeparator={true}
                          suffix={` ${symbol.toUpperCase()}`}
                        />
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            {emptyRows > 0 && (
              <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[rowsPerPage]}
        component='div'
        count={arr.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </>
  );
}
