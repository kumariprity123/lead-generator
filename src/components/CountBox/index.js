import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function BasicCard(props) {
    const {data, label} = props;
  return (
    <Card sx={{ width: 150, margin: "0 10px" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h5" component="div">
            {data? data[0]?.count : 0}
        </Typography>
      </CardContent>
    </Card>
  );
}