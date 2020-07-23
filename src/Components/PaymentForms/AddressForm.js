import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

/**
 * Provides the sipping address  details view.
 *
 * @param props Props that contains the order details.
 * @returns {*} Shipping address form view.
 */
export default function AddressForm(props) {

    /**
     * Handle change on the buyer information.
     *
     * @param event Event that contains the change.
     */
    const handleBuyerChange = event => {
        const {name, value} = event.target;
        props.setPaymentRequest((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    /**
     * Handle change on the shipping address information.
     *
     * @param event Event that contains the change.
     */
    const handleShippingAddressChange = event => {
        const {name, value} = event.target;
        props.setPaymentRequest((prevState) => ({
            ...prevState,
            shippingAddress: {
                ...prevState.shippingAddress,
                [name]: value
            }
        }));
    };

    /**
     * Handle change on the same buyer and payer checkbox.
     *
     * @param event Event that contains the change.
     */
    const handleCheckboxChange = event => {
        if (event.target.checked) {
            props.setSameBuyerAndPayer(true);
        } else {
            props.setSameBuyerAndPayer(false)
        }
    };

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Dirección de envío
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="buyerName"
                        name="buyerName"
                        label="Nombre Completo"
                        fullWidth
                        autoComplete="given-name"
                        value={props.paymentRequest.buyerName || ''}
                        onChange={handleBuyerChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="buyerDniNumber"
                        name="buyerDniNumber"
                        value={props.paymentRequest.buyerDniNumber || ''}
                        type="number"
                        label="Número de identificación"
                        onChange={handleBuyerChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="buyerPhone"
                        name="buyerPhone"
                        value={props.paymentRequest.buyerPhone || ''}
                        type="number"
                        label="Telefono de contacto."
                        onChange={handleBuyerChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="street1"
                        name="street1"
                        value={props.paymentRequest.shippingAddress.street1 || ''}
                        label="Dirección"
                        onChange={handleShippingAddressChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="street2"
                        name="street2"
                        value={props.paymentRequest.shippingAddress.street2 || ''}
                        label="Conjunto/casa/apartamento"
                        onChange={handleShippingAddressChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="city"
                        name="city"
                        value={props.paymentRequest.shippingAddress.city || ''}
                        label="Ciudad"
                        fullWidth
                        autoComplete="shipping address-level2"
                        onChange={handleShippingAddressChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField id="state"
                               name="state"
                               value={props.paymentRequest.shippingAddress.state || ''}
                               onChange={handleShippingAddressChange}
                               label="Departamento"
                               fullWidth/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="postalCode"
                        name="postalCode"
                        value={props.paymentRequest.shippingAddress.postalCode || ''}
                        label="Código postal"
                        fullWidth
                        autoComplete="shipping postal-code"
                        onChange={handleShippingAddressChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox color="secondary" name="saveAddress" value="yes"
                                           onChange={handleCheckboxChange}/>}
                        label="Utilizar estos datos para el pago"
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}