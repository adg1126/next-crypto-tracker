import * as React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

export default function ScrollableTabsButtonForce() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box style={{}}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant='scrollable'
        scrollButtons
        allowScrollButtonsMobile
        aria-label='scrollable force tabs example'
      >
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
        <Tab label='Item Four' />
        <Tab label='Item Five' />
        <Tab label='Item Six' />
        <Tab label='Item Seven' />
      </Tabs>
    </Box>
  );
}
