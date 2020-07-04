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


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left"  timeout={{enter:200000,exit:20000}} ref={ref} {...props} />;
});

export default function ProductCard(props) {
    const cardStyles = useStyles();
    const history = useHistory();
    const mediaStyles = useSlopeCardMediaStyles();
    const shadowStyles = useSoftRiseShadowStyles();
    const textCardContentStyles = useN01TextInfoContentStyles();
    const [checkOutOpen, setCheckOutOpen] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        if (localStorage.getItem("accessToken") != null) {
            setCheckOutOpen(true);
        }else{
            setOpen(true);
        }

    };

    const handleCheckoutClose = () => {
        setCheckOutOpen(false);

    };

    const handleClose = () => {
        setOpen(false);
        history.push("/signIn");
    };

    function format (n) {
        return n.toFixed(2).replace('.', ',').replace(/\d{3}(?=(\d{3})*,)/g, function (s) {
            return '.' + s
        })
    }
    return (
        <Grid item key={props.product.id} xs={12} sm={6} md={3}>
            <Card className={cx(cardStyles.root, shadowStyles.root)}>
                <CardMedia
                    classes={mediaStyles}
                    image={"https://source.unsplash.com/random"}
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
                <Checkout/>
            </Dialog>
            <Dialog
                open={open}
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


