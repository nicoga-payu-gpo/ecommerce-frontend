import React, {useEffect, useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ProductCard from "./ProductCard";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));

export default function Products() {
    const classes = useStyles();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/API/products").then((res) => {
            setProducts(res.data)
        }).catch(function (error) {
            console.log(error)
        });
    }, []);

    return (
        <React.Fragment>
            <CssBaseline/>
            <main>
                <div className={classes.heroContent}>
                    <Container maxWidth="lg">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            Una nueva forma de verte
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Redonez es una marca dedicada a ofrecer piezas de joyería hechas a mano
                            con los mejores materiales disponibles en el mercado.
                        </Typography>
                    </Container>
                </div>
                <Container className={classes.cardGrid}>
                    <Grid container spacing={4}>
                        {products.filter((product)=>product.availableUnits>0).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    );
}