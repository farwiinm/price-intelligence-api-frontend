function SignalBadge({signal}){
    const labels = {
        BUY_NOW: 'BUY NOW',
        HOLD: 'HOLD',
        CAUTION:'CAUTION',
        NEUTRAL:'NEUTRAL',
        UNKNOWN: '-'
    };

    return (
        <span className={`signal signal-${signal?.toLowerCase()}`}>
            {labels[signal]||signal}
        </span>
    );
}

export default SignalBadge;