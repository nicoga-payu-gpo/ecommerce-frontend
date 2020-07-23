import React, {forwardRef, useEffect} from 'react';
import MaterialTable from 'material-table'

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Refresh from '@material-ui/icons/Refresh';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

/**
 * Table action icons.
 * */
const tableIcons = {
    Clear: forwardRef((props, ref) => <Clear color="action"{...props} ref={ref}/>),
    Refund: forwardRef((props, ref) => <Clear color="action"{...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search color="action" {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};

/**
 * Custom theme definition.
 * */
const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

/**
 * Provide the orders management view.
 *
 * @returns {*} Order management view.
 */
export default function Orders() {

    /**
     * Styles for the view.
     */
    const classes = useStyles();

    /**
     * React ref for table updates.
     */
    const tableRef = React.createRef();

    /**
     * React reference for hooks.
     */
    const {useState} = React;

    /**
     * Columns to display in the table for orders management.
     */
    const [columns, setColumns] = useState([
        {title: 'Id', field: 'id'},
        {title: 'Email', field: 'user.email'},
        {title: 'Producto', field: 'product.name'},
        {title: 'Total', field: 'total', type: 'currency'},
        {title: 'Estado', field: 'state'},

    ]);

    /**
     * Refund status snackbar open state.
     */
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    /**
     * Back drop open state.
     */
    const [backdropOpen, setBackdropOpen] = useState(false);

    /**
     * Snackbar text to display.
     */
    const [snackBarText, setSnackBarText] = useState({severity: "", message: ""});

    /**
     * Table data.
     */
    const [data, setData] = useState([]);

    /**
     * Snack bar close handler.
     */
    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBarOpen(false);
    };

    /**
     * Use of hooks to get orders when loading the view.
     */
    useEffect(() => {
        updateData();
    }, []);

    /**
     * Backend API call to get al the orders in the system.
     */
    function updateData() {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("accessToken");
        axios.get("http://localhost:8080/API/orders").then((res) => {
            setData(res.data)
        }).catch(function (error) {
            console.log(error);
        });
    }

    /**
     * Backend API call process refund on an order.
     *
     * @param order Order which is going to be refunded.
     */
    function doRefund(order) {
        setBackdropOpen(true);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("accessToken");
        axios.post("http://localhost:8080/API/orders/refund", order.id, {headers: {'Content-Type': 'text/plain'}}).then((res) => {
            if (res.data.state === "REFUNDED") {
                setSnackBarText({severity: "success", message: "El reembolso ha sido procesado con exito"});
            } else {
                setSnackBarText({severity: "error", message: "El reembolso no se ha realizado exitosamente."});
            }
            updateData() && tableRef.current && tableRef.current.onQueryChange();
            setBackdropOpen(false);
            setSnackBarOpen(true);
        }).catch(function (error) {
            setBackdropOpen(false);
            setSnackBarText({severity: "error", message: "El reembolso no se ha realizado exitosamente."});
            setSnackBarOpen(true);
        });
    }


    return (
        <div style={{maxWidth: '100%'}}>

            <MaterialTable
                title="Ordenes Realizadas"
                localization={{
                    header: {
                        actions: 'Acciones'
                    },
                    pagination: {
                        labelDisplayedRows: "{from}-{to} de {count}",
                        labelRowsPerPage: "Filas",
                        labelRowsSelect: "Filas"
                    },
                    toolbar: {
                        searchPlaceholder: "Buscar",
                        searchTooltip: "Buscar",
                    }
                }}
                columns={columns}
                data={data}
                icons={tableIcons}
                actions={[
                    {
                        icon: () => <Refresh/>,
                        tooltip: 'Actualizar datos',
                        isFreeAction: true,
                        onClick: () => updateData() && tableRef.current && tableRef.current.onQueryChange(),
                    },
                    rowData => ({
                        icon: () => <MoneyOffIcon/>,
                        tooltip: 'Procesar reembolso',
                        onClick: (event, rowData) => {
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(doRefund(rowData));
                                }, 1000)
                            })
                        },
                        disabled: rowData.state !== "APPROVED"
                    })
                ]}

                options={{
                    actionsColumnIndex: -1,
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30]

                }}
            />
            <Backdrop className={classes.backdrop} open={backdropOpen}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleSnackBarClose}>
                <Alert onClose={handleSnackBarClose} severity={snackBarText.severity}>
                    {snackBarText.message}
                </Alert>
            </Snackbar>


        </div>


    );
}