import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import SignalBadge from '../components/SignalBadge';
import { getProductIntelligence } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ProductDetail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductIntelligence(id)
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="loading">Loading product analysis...</div>;
    if (!data) return <div className="error">Product not found</div>;

    const { product, statistics, priceHistory, intelligence } = data;

    const chartLabels = priceHistory
        .slice(0, 20).reverse()
        .map(h => new Date(h.recordedAt).toLocaleDateString('en-GB', {day:'2-digit',month:'short'}));

    const chartPrices = priceHistory
        .slice(0, 20).reverse()
        .map(h => h.newPrice);

    const chartData = {
        labels: chartLabels,
        datasets: [{
            label: 'Price (LKR)',
            data: chartPrices,
            borderColor: '#0f3460',
            backgroundColor: 'rgba(15, 52, 96, 0.08)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: priceHistory.slice(0,20).reverse()
                .map(h => h.isAnomaly ? '#e94560' : '#0f3460'),
            tension: 0.3,
            fill: true,
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: '#f0f4f8' } },
            x: { grid: { display: false } }
        }
    };

    const risk = intelligence?.quoteRisk;

    return (
        <div className="page">
            <Link to="/" className="back-link">← Back to Dashboard</Link>

            <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                    <h1>{product.name}</h1>
                    <p>{product.category} — Current Market Price: Rs. {product.currentPrice?.toFixed(2)}/kg</p>
                </div>
                <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                    <SignalBadge signal={intelligence?.buySignal} />
                    <span style={{fontSize:'13px',color:'#718096'}}>
                        Suggested sell: <strong>Rs. {intelligence?.suggestedSellingPrice?.toFixed(2)}</strong>
                    </span>
                </div>
            </div>

            <div className="detail-grid">
                <div className="chart-container">
                    <h3>Price History — Last 20 Changes</h3>
                    {chartPrices.length > 0
                        ? <Line data={chartData} options={chartOptions} />
                        : <p style={{color:'#718096',fontSize:'13px'}}>No price history yet</p>
                    }
                    <p style={{fontSize:'11px',color:'#718096',marginTop:'8px'}}>
                        Red dots indicate anomalous price changes
                    </p>
                </div>

                <div>
                    <div className="stats-box" style={{marginBottom:'16px'}}>
                        <h3>Price Statistics</h3>
                        {[
                            ['Current Price', `Rs. ${product.currentPrice?.toFixed(2)}`],
                            ['6-Month Average', `Rs. ${statistics?.averagePrice?.toFixed(2)}`],
                            ['Minimum', `Rs. ${statistics?.minPrice?.toFixed(2)}`],
                            ['Maximum', `Rs. ${statistics?.maxPrice?.toFixed(2)}`],
                            ['Std Deviation', `Rs. ${statistics?.standardDeviation?.toFixed(2)}`],
                            ['Trend', statistics?.trendDirection],
                            ['Total Changes', statistics?.totalChanges],
                            ['Anomalies', statistics?.anomalyCount],
                        ].map(([key, val]) => (
                            <div className="stat-row" key={key}>
                                <span className="key">{key}</span>
                                <span className="val">{val ?? '—'}</span>
                            </div>
                        ))}
                    </div>

                    {risk && (
                        <div className="stats-box">
                            <h3>3-Month Contract Risk</h3>
                            <div className="stat-row">
                                <span className="key">Risk Level</span>
                                <span className={`risk-${risk.riskLevel?.toLowerCase()}`}>
                                    {risk.riskLevel}
                                </span>
                            </div>
                            <div className="stat-row">
                                <span className="key">Suggested Quote</span>
                                <span className="val">Rs. {risk.suggestedQuotePrice?.toFixed(2)}</span>
                            </div>
                            <div className="stat-row">
                                <span className="key">Buffer</span>
                                <span className="val">{risk.bufferPercent}%</span>
                            </div>
                            <p style={{fontSize:'12px',color:'#718096',marginTop:'12px',lineHeight:'1.5'}}>
                                {risk.recommendation}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-header"><h2>Full Price History</h2></div>
                <div className="card-body">
                    <table>
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Old Price</th>
                                <th>New Price</th>
                                <th>Change %</th>
                                <th>Flag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {priceHistory.map(h => (
                                <tr key={h.id} style={h.isAnomaly ? {background:'#fff5f5'} : {}}>
                                    <td>{new Date(h.recordedAt).toLocaleString('en-GB')}</td>
                                    <td>Rs. {h.oldPrice?.toFixed(2)}</td>
                                    <td style={{fontWeight:600}}>Rs. {h.newPrice?.toFixed(2)}</td>
                                    <td>
                                        <span className={h.changePercentage > 0 ? 'trend-up' : 'trend-down'}>
                                            {h.changePercentage > 0 ? '+' : ''}{h.changePercentage?.toFixed(2)}%
                                        </span>
                                    </td>
                                    <td>
                                        {h.isAnomaly
                                            ? <span className="signal signal-caution">⚠ ANOMALY</span>
                                            : <span style={{color:'#718096'}}>—</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;