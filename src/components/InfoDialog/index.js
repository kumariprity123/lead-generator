import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

const InfoDialog = (props) => {
  const { onClose, open, data, title } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title} List</DialogTitle>
      <List sx={{ pt: 0 }}>
        {data.map((value, key) => (
          <ListItem button onClick={() => handleListItemClick(value)} key={key}>
            <ListItemText primary={value} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
export default InfoDialog;