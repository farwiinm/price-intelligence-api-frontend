import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignalBadge from '../components/SignalBadge';
import { getPriceReview } from '../services/api';

function PriceReview() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [threshold, setThreshold] = useState(3);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getPriceReview(threshold)
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [threshold]);

    if (loading) return <div className="loading">Analysing prices...</div>;

    const { needsReview = [], stable = [], summary = {} } = data || {};

    return (
        <div className="page">
            <div className="page-header">
                <h1>Price Review Queue</h1>
                <p>Products whose market price has moved beyond your threshold — review selling prices</p>
            </div>

            <div className="stats-row">
                <div className="stat-card">
                    <div className="label">Total Tracked</div>
                    <div className="value">{summary.totalProducts}</div>
                </div>
                <div className="stat-card">
                    <div className="label">Needs Review</div>
                    <div className="value red">{summary.needsReviewCount}</div>
                </div>
                <div className="stat-card">
                    <div className="label">Stable</div>
                    <div className="value green">{summary.stableCount}</div>
                </div>
                <div className="stat-card">
                    <div className="label">Threshold</div>
                    <div className="value">{threshold}%</div>
                </div>
            </div>

            <div style={{marginBottom:'20px',display:'flex',alignItems:'center',gap:'12px'}}>
                <label style={{fontSize:'13px',color:'#4a5568',fontWeight:600}}>
                    Review threshold:
                </label>
                <select
                    value={threshold}
                    onChange={e => setThreshold(Number(e.target.value))}
                    style={{padding:'6px 10px',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'13px'}}
                >
                    <option value={1}>1% change</option>
                    <option value={3}>3% change</option>
                    <option value={5}>5% change</option>
                    <option value={10}>10% change</option>
                </select>
            </div>

            {needsReview.length > 0 ? (
                <div className="card">
                    <div className="card-header">
                        <h2>Requires Action ({needsReview.length})</h2>
                    </div>
                    <div className="card-body">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Market Price</th>
                                    <th>6-Mo Average</th>
                                    <th>Change from Avg</th>
                                    <th>Trend</th>
                                    <th>Signal</th>
                                    <th>Suggested Sell Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {needsReview.map(p => (
                                    <tr key={p.id}>
                                        <td style={{fontWeight:600}}>{p.name}</td>
                                        <td>Rs. {p.currentMarketPrice?.toFixed(2)}</td>
                                        <td>Rs. {p.averagePrice?.toFixed(2)}</td>
                                        <td>
                                            <span className={p.changeFromAverage > 0 ? 'trend-up' : 'trend-down'}>
                                                {p.changeFromAverage > 0 ? '+' : ''}{p.changeFromAverage?.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td>{p.trendDirection}</td>
                                        <td><SignalBadge signal={p.buySignal} /></td>
                                        <td style={{fontWeight:700,color:'#0f3460'}}>
                                            Rs. {p.suggestedSellingPrice?.toFixed(2)}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-outline"
                                                onClick={() => navigate(`/products/${p.id}`)}
                                            >
                                                View Analysis
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="alert alert-success">
                    All products are within the {threshold}% threshold — no selling price updates needed today.
                </div>
            )}
        </div>
    );
}

export default PriceReview;