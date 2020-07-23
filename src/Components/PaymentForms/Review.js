import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';

/**
 * Custom theme definition.
 */
const useStyles = makeStyles((theme) => ({
    listItem: {
        padding: theme.spacing(1, 0),
    },
    total: {
        fontWeight: 700,
    },
    title: {
        marginTop: theme.spacing(2),
    },
}));

/**
 * Format a number to a currency format.
 * @param n Number to format.
 * @returns {string} Formatted number.
 */
function format(n) {
    return n.toFixed(2).replace('.', ',').replace(/\d{3}(?=(\d{3})*,)/g, function (s) {
        return '.' + s
    })
}

/**
 * Provide the review view to confirm an order.
 *
 * @param props Props that contains order details.
 * @returns {*} Order review view.
 */
export default function Review(props) {

    /**
     * Styles for the view.
     */
    const classes = useStyles();

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Resumen de orden
            </Typography>
            <List disablePadding>
                <ListItem className={classes.listItem} key={props.product.name}>
                    <ListItemText primary={props.product.name} secondary={props.product.description}/>
                    <Typography variant="body2">${format(props.product.price)}</Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Total"/>
                    <Typography variant="subtitle1" className={classes.total}>
                        ${format(props.product.price)}
                    </Typography>
                </ListItem>
            </List>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Envío
                    </Typography>
                    <Typography gutterBottom>{props.paymentRequest.buyerName}</Typography>
                    <Typography
                        gutterBottom>{props.paymentRequest.shippingAddress.street1 + ", " + props.paymentRequest.shippingAddress.street2}</Typography>
                    <Typography
                        gutterBottom>{props.paymentRequest.shippingAddress.city + ", " + props.paymentRequest.shippingAddress.postalCode}</Typography>
                </Grid>
                <Grid item container direction="column" xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Detalles de pago
                    </Typography>
                    <Grid container>
                        <React.Fragment key="0">
                            <Grid item xs={6}>
                                <Typography gutterBottom>Titular de la tarjeta</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>{props.paymentRequest.payer.cardHolderName}</Typography>
                            </Grid>
                        </React.Fragment>
                        <React.Fragment key="1">
                            <Grid item xs={6}>
                                <Typography gutterBottom>Número de tarjeta</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    gutterBottom>{"xxxx-xxxx-xxxx-" + props.paymentRequest.payer.cardNumber.substr(props.paymentRequest.payer.cardNumber.length - 4)}</Typography>
                            </Grid>
                        </React.Fragment>
                        <React.Fragment key="2">
                            <Grid item xs={6}>
                                <Typography gutterBottom>Fecha de vencimiento</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>{props.paymentRequest.payer.cardExpirationDate}</Typography>
                            </Grid>
                        </React.Fragment>
                        <React.Fragment key="3">
                            <Grid item xs={6}>
                                <Typography gutterBottom>Tipo de tarjeta</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>{props.paymentRequest.payer.cardFranchise}</Typography>
                            </Grid>
                        </React.Fragment>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}