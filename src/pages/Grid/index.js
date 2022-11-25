import React, { useEffect, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import axios from "axios";
import {Modal, Tooltip} from '@mui/material';
import { format } from '../../utils/commonLogic';
import { LoginContext } from "../../Contexts/LoginContext"
import EditIcon from '@mui/icons-material/Edit';
import Toast from '../../components/Toast';
import { styled } from '@mui/system';
import InfoDialog from '../../components/InfoDialog'
import UpdateForm from "../UpdateForm"
const style1 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};


// const rows = [
//   { id: 1, nextFlwDate: '12/1/2022', companyName: 'Jon', customer: 'pqrst', mobile: '9876543212', email: 'abc@gmail.com', status: 'positive', accHolder: 'Raju', leadSource: 'abcd', leadOwner: 'pqrs', remark: 'firstremark'},
//   { id: 2, nextFlwDate: '13/1/2022', companyName: 'Jon', customer: 'pqrst', mobile: '9876543212', email: 'abc@gmail.com', status: 'positive', accHolder: 'Raju', leadSource: 'abcd', leadOwner: 'pqrs', remark: 'firstremark'},
//   { id: 3, nextFlwDate: '14/1/2022', companyName: 'Jon', customer: 'pqrst', mobile: '9876543212', email: 'abc@gmail.com', status: 'positive', accHolder: 'Raju', leadSource: 'abcd', leadOwner: 'pqrs', remark: 'firstremark'},
//   { id: 4, nextFlwDate: '15/1/2022', companyName: 'Jon', customer: 'pqrst', mobile: '9876543212', email: 'abc@gmail.com', status: 'positive', accHolder: 'Raju', leadSource: 'abcd', leadOwner: 'pqrs', remark: 'firstremark'},
//   { id: 5, nextFlwDate: '16/1/2022', companyName: 'Jon', customer: 'pqrst', mobile: '9876543212', email: 'abc@gmail.com', status: 'positive', accHolder: 'Raju', leadSource: 'abcd', leadOwner: 'pqrs', remark: 'firstremark'},
//   { id: 6, nextFlwDate: '17/1/2022', companyName: 'Jon', customer: 'pqrst', mobile: '9876543212', email: 'abc@gmail.com', status: 'positive', accHolder: 'Raju', leadSource: 'abcd', leadOwner: 'pqrs', remark: 'firstremark'},

// ];

export default function DataGridList(props) {
  const [open, setOpen] = useState(false);
  const [rowValues, setRowValues] = useState({})
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose1 = () => {
    setOpen(false);
  };
  const { userLoginDetails, updatedRow, setUpdatedRow} = useContext(LoginContext);
  const [rows, setRows] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastAction, setToastAction] = useState('');
  const [showDialog, setshouldShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState([]);
  const [dialogTitle, setDialogTitle] = useState('');

  const handleClose = () => {
    setshouldShowDialog(false);
  };
  const handleClickOpen = (data, title) => {
    if (data.includes(",")) {
      data = data.split(",");
      setDialogData(data);
      setDialogTitle(title);
      setshouldShowDialog(true);
    }
  };

  console.log(rows);
  console.log("user login details", userLoginDetails);

  const { inputFormData } = props;
  console.log("added form input", inputFormData);

  function updateSelectedRow(event, cellValues) {
    setRowValues(cellValues.row);
    handleOpen();
  }

  function showToastComponent(actionValue) {
    setShowToast(true);
    setToastAction(actionValue);
    setTimeout(() => {
      setToastAction('');
      setShowToast(false);
    }, 3000)
  }
  function dateComparator(date1, date2) {
    var date1Number = date1 && new Date(date1).getTime();
    var date2Number = date2 && new Date(date2).getTime();

    if (date1Number == null && date2Number == null) {
      return 0;
    }

    if (date1Number == null) {
      return -1;
    } else if (date2Number == null) {
      return 1;
    }

    return date1Number - date2Number;
  }
  function joinWithComma(firstNo, secondNo, thirdNo) {
    if (firstNo && secondNo && thirdNo) {
      return `${firstNo},${secondNo},${thirdNo}`;
    } else if (firstNo && secondNo) {
      return `${firstNo},${secondNo}`
    } else {
      return firstNo
    }
  }
  function joinRemarksWithTime(remarks) {
    const remarkArray = [];
    if (remarks) {
      remarks.reverse();
      remarks.forEach((remark) => {
        if (remark.addedon && remark.remarks) {
          let value = `${remark.remarks} (${remark.addedon})`;
          remarkArray.push(value);
        }
      });
    }
    return remarkArray.length ? remarkArray.join(",") : "";
  }
  const columns = [
    { field: 'leadId', headerName: 'ID', minWidth: 30, sortComparator: dateComparator, hide: true, flex: 1, headerClassName: 'super-app-theme--header', },
    {
      field: 'nextFlwDate',
      headerName: 'Next Flw Date',
      type: 'date',
      minWidth: 110,
      editable: false,
      flex: 1,
      sortComparator: dateComparator,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'companyName',
      headerName: 'Company',
      type: 'string',
      minWidth: 100,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Tooltip title={params.value}>
            <span className="table-cell-trucate">{params.value}</span>
          </Tooltip>
        )
      },
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'customer',
      headerName: 'Customer',
      type: 'string',
      minWidth: 110,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Tooltip title={params.value}>
            <span className="table-cell-trucate">{params.value}</span>
          </Tooltip>
        )
      },
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'mobile',
      headerName: 'Mobile',
      type: 'string',
      minWidth: 110,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Tooltip title={params.value}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }} onClick={() => handleClickOpen(params.value, "Mobile")} className="table-cell-trucate">{params.value}</span>
          </Tooltip>
        )
      },
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'email',
      headerName: 'Email',
      type: 'string',
      minWidth: 150,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Tooltip title={params.value}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }} onClick={() => handleClickOpen(params.value, "Emails")} className="table-cell-trucate">{params.value}</span>
          </Tooltip>
        )
      },
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'string',
      minWidth: 110,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Tooltip title={params.value}>
            <span className="table-cell-trucate">{params.value}</span>
          </Tooltip>
        )
      },
      // renderEditCell: renderStatusInputCell,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'accHolder',
      headerName: 'Acc. Holder ',
      type: 'string',
      minWidth: 110,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Tooltip title={params.value}>
            <span className="table-cell-trucate">{params.value}</span>
          </Tooltip>
        )
      },
      // renderEditCell: renderStatusInputCell,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'leadSource',
      headerName: 'Lead Source',
      type: 'string',
      minWidth: 110,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Tooltip title={params.value}>
            <span className="table-cell-trucate">{params.value}</span>
          </Tooltip>
        )
      },
      // renderEditCell: renderStatusInputCell,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'leadOwner',
      headerName: 'Lead Owner',
      type: 'string',
      minWidth: 110,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Tooltip title={params.value}>
            <span className="table-cell-trucate">{params.value}</span>
          </Tooltip>
        )
      },
      // renderEditCell: renderStatusInputCell,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'region',
      headerName: 'Region',
      type: 'string',
      minWidth: 80,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Tooltip title={params.value}>
            <span className="table-cell-trucate">{params.value}</span>
          </Tooltip>
        )
      },
      headerClassName: 'super-app-theme--header',
    },
    {
      headerClassName: 'super-app-theme--header',
      field: 'remarks',
      headerName: 'Remark',
      type: 'string',
      minWidth: 300,
      height: 200,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        if (params.value.includes(',')) {
          return (
            <Tooltip title={params.value}>
              <ul style={{ display: "inline-block", textAlign: "left" }} onClick={() => handleClickOpen(params.value, "remarks")}>
                {params.value.split(",").map((value, key) => {
                  if (key <= 2) {
                    if (value !== " " && key === 0) {
                      return <li style={{ color: "red", fontSize: "16px", textOverflow: "ellipsis", margin: "0 5px 0 0" }}>{value}</li>
                    } else if (value !== " ") {
                      return <li style={{ textOverflow: "ellipsis" }}>{value}</li>
                    }
                  }
                })}
              </ul>
            </Tooltip>
          )
        } else if (params.value) {
          return (
            <Tooltip title={params.value} >
              <ul>
                <li style={{ color: "red", fontSize: "16px" }}>{params.value}</li>
              </ul>
            </Tooltip>
          )
        }

      },
    },
    {
      field: "Edit",
      width: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <span style={{ "marginLeft": "20px", "marginRight": "20px" }} onClick={(event) => {
            updateSelectedRow(event, cellValues);
          }}>
            <EditIcon />
          </span>
        );
      },
      headerClassName: 'super-app-theme--header',
    },

  ];
  useEffect(() => {
    axios.post('http://mindfulautomations.com:8083/lead_list', userLoginDetails).then((response) => {
      console.log(response);
      const allRows = response.data.result.map((data, key) => {
        const dateObj = new Date(data.next_date);
        const dateValue = format(dateObj);
        const mobileValue = joinWithComma(data.mobile, data.second_mobile_no, data.third_mobile_no);
        const emailsValue = joinWithComma(data.email, data.second_email_id, data.third_email_id);
        const remarksValue = joinRemarksWithTime(data.remarks);
        return {
          rowId: (key + 1),
          leadId: data.lead_id,
          nextFlwDate: dateValue,
          companyName: data.company_name,
          customer: data.customer_name,
          mobile: mobileValue,
          email: emailsValue,
          status: data.status,
          accHolder: data.acc_holder,
          leadSource: data.lead_source,
          leadOwner: data.lead_owner,
          region: data.region,
          remarks: remarksValue,
        }
      })
      allRows.sort((a, b) => a.id - b.id);
      setRows(allRows);
    })
  }, [inputFormData, updatedRow]);


  function getSelectedRow(data) {
    console.log(data);
    setSelectionModel(data);
  }
  const [selectionModel, setSelectionModel] = useState([]);
  const [sortModel, setSortModel] = React.useState([
    {
      field: 'nextFlwDate',
      sort: 'desc',
    },
    {
      field: 'id',
      sort: 'desc',
    },
  ]);
  const MyBox = styled('Box')({
    height: `${rows?.length < 50 ? 25 * 75 : 50 * 75}px`,
    width: '100%',
    '& .super-app-theme--header': {
      backgroundColor: 'rgba(46, 134, 193, 1)',
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white'

    },
    '& .super-app-theme--even': {
      backgroundColor: 'rgba(234, 237, 237, 1)',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    '& .super-app-theme--odd': {
      backgroundColor: 'rgba(212, 230, 241 , 1)',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    '& .super-app-theme--updated': {
      backgroundColor: 'rgba(34, 153, 84 , 0.75)',
      fontSize: '14px',
      fontWeight: 'bold',
    },
  });
  function getColorValue(params) {
    if(params.row.leadId === updatedRow?.lead_id) {
      console.log("updated row color", updatedRow, params);
      return 'super-app-theme--updated'
    } else {
      if (params.row.rowId % 2) {
        return 'super-app-theme--odd'
      } else {
        return 'super-app-theme--even'
      }
    }
  }

  return (
    <>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose1}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style1, width: "60%" }}>
          <UpdateForm rowValues={rowValues} onRowUpdated={setUpdatedRow} onCancel={handleClose1} showToastBox={showToastComponent} />
        </Box>
      </Modal>
      <MyBox>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={50}
          getRowHeight={() => 70}
          rowsPerPageOptions={[]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          onSelectionModelChange={(newSelectionModel) => {
            getSelectedRow(newSelectionModel);
          }}
          selectionModel={selectionModel}
          components={{ Toolbar: GridToolbar }}
          sortModel={sortModel}
          onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
          getRowClassName={(params) => getColorValue(params)}
          getRowId={(row) => row.rowId}

        />
      </MyBox>
      {showToast ? <Toast action={toastAction} /> : <></>}
      <InfoDialog
        data={dialogData}
        title={dialogTitle}
        open={showDialog}
        onClose={handleClose}
      />
    </>
  );
}
