import React, {forwardRef, useEffect} from 'react';
import MaterialTable from 'material-table'

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check color="action" {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear color="action"{...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline color="action"{...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit color="action"{...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
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


export default function Products() {
    const {useState} = React;
    const [columns, setColumns] = useState([
        {title: 'Nombre', field: 'name'},
        {title: 'Descripción', field: 'description'},
        {title: 'Precio unitario', field: 'price', type: 'currency'},
        {title: 'Unidades', field: 'availableUnits', type: 'numeric'},

    ]);

    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:8080/API/products").then((res) => {
            setData(res.data)
        }).catch(function (error) {
            console.log(error);
        });
    }, []);

    function updateProduct(product) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("accessToken");
        axios.put("http://localhost:8080/API/products",product).then((res) => {
            console.log(res);
        }).catch(function (error) {
            console.log(error);
        });
    }

    function createProduct(product) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("accessToken");
        axios.post("http://localhost:8080/API/products",product).then((res) => {
            console.log(res);
        }).catch(function (error) {
            console.log(error);
        });
    }
    function deleteProduct(productId) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("accessToken");
        axios.delete("http://localhost:8080/API/products"+productId).then((res) => {
            console.log(res);
        }).catch(function (error) {
            console.log(error);
        });
    }
    return (
        <div style={{maxWidth: '100%'}}>

            <MaterialTable
                title="Productos disponibles"
                localization={{
                    header: {
                        actions: 'Acciones'
                    },
                    body: {
                        emptyDataSourceMessage: "No hay datos para mostrar.",
                        addTooltip: "Agregar producto",
                        deleteTooltip: "Eliminar",
                        editTooltip: "Editar",
                        editRow: {
                            deleteText: "Está seguro de eliminar este producto?",
                            cancelTooltip: "Cancelar",
                            saveTooltip: "Confirmar"
                        }
                    },
                    pagination: {
                        labelDisplayedRows: "{from}-{to} de {count}",
                        labelRowsPerPage: "Filas",
                        labelRowsSelect: "Filas"
                    },
                    toolbar:{
                      searchPlaceholder:"Buscar",
                        searchTooltip:"Buscar",
                    }
                }}
                columns={columns}
                data={data}
                icons={tableIcons}
                editable={{
                    onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                setData([...data, newData]);
                                createProduct(newData);
                                resolve();
                            }, 1000)
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                const dataUpdate = [...data];
                                const index = oldData.tableData.id;
                                dataUpdate[index] = newData;
                                setData([...dataUpdate]);
                                updateProduct(dataUpdate[index]);

                                resolve();
                            }, 1000)
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                const dataDelete = [...data];
                                const index = oldData.tableData.id;
                                deleteProduct(dataDelete[index].id)
                                dataDelete.splice(index, 1);
                                setData([...dataDelete]);

                                resolve()
                            }, 1000)
                        }),
                }}
                options={{
                    actionsColumnIndex: -1,
                    pageSize:10,
                    pageSizeOptions: [10, 20, 30]

                }}
            />

        </div>


    );
}