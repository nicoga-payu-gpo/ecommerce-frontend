import React, {useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box";

export default function PaymentForm(props) {

    const visaType = new RegExp("^(4)(\\d{12}|\\d{15})$|^(606374\\d{10}$)");
    const dinersType = new RegExp("^3(?:0[0-5]|[68][0-9])[0-9]{11}$");
    const amexType = new RegExp("^3[47][0-9]{13}$");
    const masterType = new RegExp("^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$");

    const handlePaymentChange = event => {
        const {name, value} = event.target;
        props.setPaymentRequest((prevState) => ({
            ...prevState,
            payer: {
                ...prevState.payer,
                [name]: value
            }
        }));
    };
    const handleBillingAddressChange = event => {
        const {name, value} = event.target;
        props.setPaymentRequest((prevState) => ({
            ...prevState,
            payer: {
                ...prevState.payer,
                billingAddress: {
                    ...prevState.payer.billingAddress,
                    [name]: value
                }
            }
        }));
    };
    const handleCardNumberChange = event => {
        const {name, value} = event.target;
        let cardType = "";
        if (visaType.test(event.target.value)) {
            cardType = "VISA";
        } else if (dinersType.test(event.target.value)) {
            cardType = "DINERS";
        } else if (amexType.test(event.target.value)) {
            cardType = "AMEX";
        } else if (masterType.test(event.target.value)) {
            cardType = "MASTERCARD";
        } else {
            cardType = "UNDEFINED";
        }
        props.setPaymentRequest((prevState) => ({
            ...prevState,
            payer: {
                ...prevState.payer,
                [name]: value,
                cardFranchise: cardType
            }
        }));
    };
    useEffect(() => {
        if (props.sameBuyerAndPayer) {
            props.setPaymentRequest((prevState) => ({
                ...prevState,
                payer: {
                    ...prevState.payer,
                    name: prevState.buyerName,
                    email: prevState.user.email,
                    phone: prevState.buyerPhone,
                    dniNumber: prevState.buyerDniNumber,
                    billingAddress: {
                        street1: prevState.shippingAddress.street1,
                        street2: prevState.shippingAddress.street2,
                        city: prevState.shippingAddress.city,
                        state: prevState.shippingAddress.state,
                        postalCode: prevState.shippingAddress.postalCode
                    }
                }
            }));
        }
    }, []);
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Información tarjeta de crédito
            </Typography>
            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>
                    <TextField required
                               id="cardHolderName"
                               name="cardHolderName"
                               value={props.paymentRequest.payer.cardHolderName || ''}
                               label="Nombre en la tarjeta"
                               fullWidth
                               autoComplete="cc-name"
                               onChange={handlePaymentChange}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        name="cardNumber"
                        id="cardNumber"
                        value={props.paymentRequest.payer.cardNumber || ''}
                        label="Número de tarjeta"
                        fullWidth
                        autoComplete="cc-number"
                        onChange={handleCardNumberChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField required
                               name="cardExpirationDate"
                               id="cardExpirationDate"
                               value={props.paymentRequest.payer.cardExpirationDate || ''}
                               label="Fecha de caducidad AAAA/MM"
                               fullWidth
                               autoComplete="cc-exp"
                               onChange={handlePaymentChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="cardSecurityCode"
                        name="cardSecurityCode"
                        value={props.paymentRequest.payer.cardSecurityCode || ''}
                        label="Código de seguridad"
                        helperText="Tres digitos en la parte trasera de la tarjeta"
                        fullWidth
                        autoComplete="cc-csc"
                        onChange={handlePaymentChange}
                    />
                </Grid>
            </Grid>
            {props.sameBuyerAndPayer === false ?
                <>
                    <Box pb={1} mt={2}>
                        <Typography variant="h6" gutterBottom>
                            Información dirección de facturación
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="name"
                                name="name"
                                value={props.paymentRequest.payer.name || ''}
                                label="Nombre Completo"
                                fullWidth
                                autoComplete="given-name"
                                onChange={handlePaymentChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                id="email"
                                name="email"
                                type="email"
                                value={props.paymentRequest.payer.email || ''}
                                label="Correo electrónico"
                                fullWidth
                                autoComplete="given-name"
                                onChange={handlePaymentChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="dniNumber"
                                name="dniNumber"
                                value={props.paymentRequest.payer.dniNumber || ''}
                                type="number"
                                label="Número de identificación"
                                fullWidth
                                onChange={handlePaymentChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="phone"
                                name="phone"
                                value={props.paymentRequest.payer.phone || ''}
                                type="number"
                                label="Telefono de contacto."
                                fullWidth
                                onChange={handlePaymentChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="street1"
                                name="street1"
                                value={props.paymentRequest.payer.billingAddress.street1 || ''}
                                label="Dirección de facturación"
                                fullWidth
                                onChange={handleBillingAddressChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="street2"
                                name="street2"
                                value={props.paymentRequest.payer.billingAddress.street2 || ''}
                                label="Conjunto/casa/apartamento"
                                fullWidth
                                onChange={handleBillingAddressChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="city"
                                name="city"
                                value={props.paymentRequest.payer.billingAddress.city || ''}
                                label="Ciudad"
                                fullWidth
                                autoComplete="shipping address-level2"
                                onChange={handleBillingAddressChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField required
                                       id="state"
                                       name="state"
                                       value={props.paymentRequest.payer.billingAddress.state || ''}
                                       label="Departamento"
                                       fullWidth
                                       onChange={handleBillingAddressChange}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="postalCode"
                                name="postalCode"
                                value={props.paymentRequest.payer.billingAddress.postalCode || ''}
                                label="Código postal"
                                fullWidth
                                autoComplete="shipping postal-code"
                                onChange={handleBillingAddressChange}
                            />
                        </Grid>

                    </Grid>
                </> : null
            }
        </React.Fragment>
    );
}