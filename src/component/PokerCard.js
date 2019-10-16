import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    card: {
        width: 100,
        height: 150,
        marginTop: 50,
        marginBottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardContent: {
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedCard: {
        width: 100,
        height: 150,
        marginTop: 20,
        marginBottom: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

function PokerCard(props) {
    const classes = useStyles();
    const { cardLabel, onClick = () => {}, selected = false } = props;
    return (
        <Card className={selected ? classes.selectedCard : classes.card} onClick={onClick} raised>
            <div className={classes.cardContent}>
                <Typography variant="h6" component="h2">
                    {cardLabel}
                </Typography>
            </div>
        </Card>
    );
}

export default PokerCard;