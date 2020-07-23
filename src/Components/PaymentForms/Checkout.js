import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

/**
 * Copyright banner.
 */
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="">
                Redonez
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

/**
 * Custom theme definition.
 */
const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));

/**
 * Steps of the payment process.
 */
const steps = ['Dirección de envío', 'Información de pago', 'Revisa tu orden'];

/**
 * Provides the checkout stepper view.
 *
 * @param props Props that contains the product for the order creation.
 * @returns {*} Checkout stepper view.
 */
export default function Checkout(props) {

    /**
     * Styles for the view.
     */
    const classes = useStyles();

    /**
     * Logged in user information.
     */
    const user = JSON.parse(localStorage.getItem("user"));

    /**
     * Active step of the stepper view.
     */
    const [activeStep, setActiveStep] = React.useState(0);

    /**
     * Defines if the buyer and the payer have te same information.
     */
    const [sameBuyerAndPayer, setSameBuyerAndPayer] = React.useState(false);

    /**
     * Product on which is being processed the order.
     */
    const [product, setProduct] = React.useState(props.product);

    /**
     * Backend API payment response.
     */
    const [paymentResponse, setPaymentResponse] = React.useState({response: ""});

    /**
     * Payment request to send to the backend API.
     */
    const [paymentRequest, setPaymentRequest] = React.useState({
        total: product.price,
        units: 1,
        date: new Date(),
        shippingAddress: {},
        payer: {
            billingAddress: {}
        },
        product,
        user
    });

    /**
     * Backend API call in order to place the order and payment.
     */
    function handlePlaceOrderChange() {
        console.log(paymentRequest)
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("accessToken");
        axios.post("http://localhost:8080/API/orders", paymentRequest).then((res) => {

            setPaymentResponse({
                ...paymentResponse,
                response: res.data
            });


        }).catch(function (error) {
            setPaymentResponse({
                ...paymentResponse,
                response: "ERROR"
            })

        });
    }

    /**
     * Hook use for getting the product
     */
    useEffect(() => {
        setProduct(props.product)
    }, []);

    /**
     * Gets the content depending on the step number.
     *
     * @param step Current step number.
     * @returns {*} Step content for the provided number.
     */
    function getStepContent(step) {
        switch (step) {
            case 0:
                return <AddressForm
                    setSameBuyerAndPayer={setSameBuyerAndPayer}
                    setPaymentRequest={setPaymentRequest}
                    paymentRequest={paymentRequest}
                />;
            case 1:
                return <PaymentForm
                    sameBuyerAndPayer={sameBuyerAndPayer}
                    setPaymentRequest={setPaymentRequest}
                    paymentRequest={paymentRequest}
                />;
            case 2:
                return <Review
                    product={product}
                    paymentRequest={paymentRequest}
                />;
            default:
                throw new Error('Unknown step');
        }
    }

    /**
     * Provide the final checkout component depending on the response provided by de backend API.
     *
     * @returns {*} Component to show transaction result.
     */
    function transactionResult() {
        if (paymentResponse.response.state === "APPROVED") {
            return <React.Fragment>
                <Typography variant="h5" gutterBottom>
                    Pago realizado exitosamente
                </Typography>
                <Typography variant="subtitle1">
                    Te notificaremos tan pronto se envíe tu pedido.
                </Typography>
            </React.Fragment>;
        } else if (paymentResponse.response.state === "DECLINED" || paymentResponse.response.state === "ERROR") {
            return <React.Fragment>
                <Typography variant="h5" gutterBottom>
                    Error en la transacción
                </Typography>
                <Typography variant="subtitle1">
                    Asegurate de que los datos son correctos y reintenta el pago.
                </Typography>
            </React.Fragment>;
        } else if (paymentResponse.response === "") {
            return <React.Fragment>
                <CircularProgress/>
            </React.Fragment>;
        }
    }

    /**
     * Handle nex step transition.
     */
    const handleNext = () => {
        setActiveStep(activeStep + 1);
        if (activeStep === steps.length - 1) {
            handlePlaceOrderChange();
        }
    };

    /**
     * Handle back step transition.
     */
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <React.Fragment>
            <CssBaseline/>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        Realizar orden
                    </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <React.Fragment>
                        {activeStep === steps.length ?
                            <React.Fragment>
                                {transactionResult()}
                            </React.Fragment>
                            :
                            <React.Fragment>
                                {getStepContent(activeStep)}
                                <div className={classes.buttons}>
                                    {activeStep !== 0 && (
                                        <Button onClick={handleBack} className={classes.button}>
                                            Atras
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Confirmar orden' : 'Siguente'}
                                    </Button>
                                </div>
                            </React.Fragment>
                        }
                    </React.Fragment>
                </Paper>
                <Copyright/>
            </main>
        </React.Fragment>
    );
}