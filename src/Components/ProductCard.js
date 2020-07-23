import React from 'react';
import cx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import {useSoftRiseShadowStyles} from '@mui-treasury/styles/shadow/softRise';
import {useSlopeCardMediaStyles} from '@mui-treasury/styles/cardMedia/slope';
import {useN01TextInfoContentStyles} from '@mui-treasury/styles/textInfoContent/n01';
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Checkout from "./PaymentForms/Checkout";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";

/**
 * Custom theme definition.
 */
const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 304,
        margin: 'auto',
    },
    content: {
        padding: 24,
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    }
}));

/**
 * Checkout transition.
 */
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left"  timeout={{enter:200000,exit:20000}} ref={ref} {...props} />;
});

/**
 * Card that contains product info.
 *
 * @param props Properties.
 * @returns {*} Product card.
 */
export default function ProductCard(props) {
    /**
     *Card styles theme.
     */
    const cardStyles = useStyles();
    /**
     * Router history.
     */
    const history = useHistory();
    /**
     * Card media style.
     */
    const mediaStyles = useSlopeCardMediaStyles();
    /**
     * Card shadow theme.
     */
    const shadowStyles = useSoftRiseShadowStyles();
    /**
     * Text style.
     */
    const textCardContentStyles = useN01TextInfoContentStyles();
    /**
     * Checkout display state.
     */
    const [checkOutOpen, setCheckOutOpen] = React.useState(false);
    /**
     * Sign in dialog display state.
     */
    const [dialogOpen, setDialogOpen] = React.useState(false);

    /**
     * Handle click on product purchase icon.
     */
    const handleClickOpen = () => {
        if (localStorage.getItem("accessToken") != null && JSON.parse(localStorage.getItem("user")).role.trim() === "ROLE_USER") {
            setCheckOutOpen(true);
        } else if (localStorage.getItem("accessToken") == null) {
            setDialogOpen(true);
        }

    };

    /**
     * Handle close for checkout.
     */
    const handleCheckoutClose = () => {
        setCheckOutOpen(false);

    };

    /**
     * Handle close for sign in required dialog.
     */
    const handleClose = () => {
        setDialogOpen(false);
        history.push("/signIn");
    };

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

    return (
        <Grid item key={props.product.id} xs={12} sm={6} md={3}>
            <Card className={cx(cardStyles.root, shadowStyles.root)}>
                <CardMedia
                    classes={mediaStyles}
                    image={"https://d1uona6pizvebs.cloudfront.net/catalog/product/cache/4fd94122ce9049ee0590091261a19421/A/r/Areteshojasdefrailejn_2.jpg"}
                />
                <CardContent className={cardStyles.content}>
                    <TextInfoContent
                        classes={textCardContentStyles}
                        heading={props.product.name}
                        body={props.product.description}
                    />
                </CardContent>
                <Divider variant="middle"/>
                <Box px={2} pb={2} mt={1}>
                    <Grid container spacing={5} direction="row"
                          justify="space-between"
                          alignItems="baseline">
                        <Grid item xs={8} >
                            <Typography variant="caption" display="block" gutterBottom>
                                {"$"+format(parseFloat(props.product.price))}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} >
                            <IconButton onClick={handleClickOpen}>
                                <ShoppingCartOutlinedIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
            <Dialog fullScreen open={checkOutOpen} onClose={handleCheckoutClose} TransitionComponent={Transition}>
                <AppBar className={cardStyles.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleCheckoutClose} aria-label="close">
                            <ChevronLeftIcon/>
                        </IconButton>
                        <Typography variant="h6" className={cardStyles.title}>
                            Realizar compra
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Checkout product={props.product}/>
            </Dialog>
            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Inicio de sesión requerido"}</DialogTitle>
                <DialogContent>

                    <DialogContentText id="alert-dialog-description">
                        Para realizar una compra es necesario que inicie sesión.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}


