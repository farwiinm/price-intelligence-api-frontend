import { useState } from 'react';
import { triggerPriceFetch, getAnomalies } from '../services/api';

function LiveFeed() {
    const [logs, setLogs] = useState([]);
    const [anomalies, setAnomalies] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [anomalyLoading, setAnomalyLoading] = useState(false);

    function addLog(message, type = 'info') {
        const time = new Date().toLocaleTimeString('en-GB');
        setLogs(prev => [...prev, { time, message, type }]);
    }

    function handleFetch() {
        setFetching(true);
        setLogs([]);
        addLog('Connecting to commodity price feed...', 'info');

        triggerPriceFetch()
            .then(() => {
                addLog('Price fetch completed successfully', 'success');
                addLog('Database updated with latest market prices', 'success');
                addLog('Anomaly detection ran on all updated prices', 'info');
                setFetching(false);
            })
            .catch(err => {
                addLog('Error: ' + err.message, 'error');
                setFetching(false);
            });
    }

    function handleLoadAnomalies() {
        setAnomalyLoading(true);
        getAnomalies()
            .then(data => { setAnomalies(data); setAnomalyLoading(false); })
            .catch(() => setAnomalyLoading(false));
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>Live Price Feed</h1>
                <p>Trigger a manual market price update and monitor detected anomalies</p>
            </div>

            <div className="card" style={{marginBottom:'20px'}}>
                <div className="card-header">
                    <h2>Market Price Update</h2>
                    <button
                        className="btn btn-primary"
                        onClick={handleFetch}
                        disabled={fetching}
                    >
                        {fetching ? 'Fetching...' : 'Fetch Latest Prices'}
                    </button>
                </div>
                <div className="card-body">
                    {logs.length === 0 ? (
                        <div style={{padding:'24px',color:'#718096',fontSize:'13px'}}>
                            Click the button above to pull the latest commodity prices from the market feed.
                        </div>
                    ) : (
                        logs.map((log, i) => (
                            <div key={i} className={`log-entry ${log.type}`}>
                                [{log.time}] {log.message}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Detected Anomalies</h2>
                    <button
                        className="btn btn-outline"
                        onClick={handleLoadAnomalies}
                        disabled={anomalyLoading}
                    >
                        {anomalyLoading ? 'Loading...' : 'Load Anomalies'}
                    </button>
                </div>
                <div className="card-body">
                    {anomalies.length === 0 ? (
                        <div style={{padding:'24px',color:'#718096',fontSize:'13px'}}>
                            {anomalyLoading ? 'Loading...' : 'Click Load Anomalies to view flagged price changes'}
                        </div>
                    ) : (
                        <table>
                            <thead>
    <tr>
        <th>Product</th>
        <th>Old Price</th>
        <th>New Price</th>
        <th>Change %</th>
        <th>Detected At</th>
    </tr>
</thead>
<tbody>
    {anomalies.map(a => (
        <tr key={a.id}>
            <td style={{fontWeight:600}}>{a.productName ?? `Record #${a.id}`}</td>
            <td>Rs. {a.oldPrice?.toFixed(2)}</td>
            <td style={{fontWeight:600,color:'#e94560'}}>
                Rs. {a.newPrice?.toFixed(2)}
            </td>
            <td className={a.changePercentage > 0 ? 'trend-up' : 'trend-down'}>
                {a.changePercentage > 0 ? '+' : ''}{a.changePercentage?.toFixed(2)}%
            </td>
            <td>{new Date(a.recordedAt).toLocaleString('en-GB')}</td>
        </tr>
    ))}
</tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LiveFeed;