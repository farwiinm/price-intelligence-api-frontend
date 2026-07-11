import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignalBadge from '../components/SignalBadge';
import { getOverview, getAnomalies } from '../services/api';

function trendLabel(trend) {
    if (trend === 'UP') return { label: '↑ UP', className: 'trend-up' };
    if (trend === 'DOWN') return { label: '↓ DOWN', className: 'trend-down' };
    return { label: '→ STABLE', className: 'trend-stable' };
}

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([getOverview(), getAnomalies()])
            .then(([prods, anom]) => {
                setProducts(prods);
                setAnomalies(anom);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading">Loading dashboard...</div>;

    const buyNowCount = products.filter(p => p.buySignal === 'BUY_NOW').length;
    const upCount = products.filter(p => p.trendDirection === 'UP').length;

    return (
        <div className="page">
            <div className="page-header">
                <h1>Commodity Price Dashboard</h1>
                <p>Real-time market intelligence for wholesale procurement decisions</p>
            </div>

            <div className="stats-row">
                <div className="stat-card">
                    <div className="label">Total Products</div>
                    <div className="value">{products.length}</div>
                </div>
                <div className="stat-card">
                    <div className="label">Buy Signals</div>
                    <div className="value green">{buyNowCount}</div>
                </div>
                <div className="stat-card">
                    <div className="label">Trending Up</div>
                    <div className="value">{upCount}</div>
                </div>
                <div className="stat-card">
                    <div className="label">Active Alerts</div>
                    <div className="value red">{anomalies.length}</div>
                </div>
            </div>

            {anomalies.length > 0 && (
                <div className="alert alert-warning">
                    ⚠ {anomalies.length} price anomaly{anomalies.length > 1 ? 'ies' : ''} detected
                    — review flagged items carefully before placing orders.
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <h2>All Commodities</h2>
                    <span style={{fontSize:'12px',color:'#718096'}}>
                        Click any row to view full analysis
                    </span>
                </div>
                <div className="card-body">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Market Price (LKR)</th>
                                <th>Avg Price</th>
                                <th>vs Average</th>
                                <th>Trend</th>
                                <th>Signal</th>
                                <th>Suggested Sell</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => {
                                const t = trendLabel(product.trendDirection);
                                const vsAvg = product.priceVsAverage;
                                return (
                                    <tr key={product.id}
                                        onClick={() => navigate(`/products/${product.id}`)}
                                    >
                                        <td style={{fontWeight: 600}}>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>Rs. {product.currentPrice?.toFixed(2)}</td>
                                        <td>Rs. {product.averagePrice?.toFixed(2)}</td>
                                        <td>
                                            <span className={vsAvg > 0 ? 'trend-up' : vsAvg < 0 ? 'trend-down' : ''}>
                                                {vsAvg > 0 ? '+' : ''}{vsAvg?.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td><span className={t.className}>{t.label}</span></td>
                                        <td><SignalBadge signal={product.buySignal} /></td>
                                        <td style={{fontWeight: 600}}>
                                            Rs. {product.suggestedSellingPrice?.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;