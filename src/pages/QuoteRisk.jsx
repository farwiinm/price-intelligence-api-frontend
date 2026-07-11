import { useState, useEffect } from 'react';
import { getProducts, getQuoteRisk } from '../services/api';

function QuoteRisk() {
    const [products, setProducts] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [months, setMonths] = useState(3);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProducts().then(p => {
            setProducts(p);
            if (p.length > 0) setSelectedId(p[0].id);
        });
    }, []);

    function handleAssess() {
        if (!selectedId) return;
        setLoading(true);
        getQuoteRisk(selectedId, months)
            .then(r => { setResult(r); setLoading(false); })
            .catch(() => setLoading(false));
    }

    const risk = result?.riskAssessment;

    return (
        <div className="page">
            <div className="page-header">
                <h1>Quote Risk Calculator</h1>
                <p>Assess the risk of offering a fixed price to a client over a contract period</p>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:'20px'}}>
                <div className="stats-box">
                    <h3>Assessment Parameters</h3>
                    <div className="form-group">
                        <label>Commodity</label>
                        <select
                            value={selectedId}
                            onChange={e => setSelectedId(e.target.value)}
                        >
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Contract Duration</label>
                        <select
                            value={months}
                            onChange={e => setMonths(Number(e.target.value))}
                        >
                            <option value={1}>1 month</option>
                            <option value={3}>3 months</option>
                            <option value={6}>6 months</option>
                            <option value={12}>12 months</option>
                        </select>
                    </div>
                    <button
                        className="btn btn-primary"
                        style={{width:'100%'}}
                        onClick={handleAssess}
                        disabled={loading}
                    >
                        {loading ? 'Assessing...' : 'Assess Risk'}
                    </button>
                </div>

                <div>
                    {result && risk ? (
                        <div className="stats-box">
                            <h3>
                                Risk Assessment — {result.product?.name} ({months} month contract)
                            </h3>

                            <div className="stat-row">
                                <span className="key">Risk Level</span>
                                <span className={`risk-${risk.riskLevel?.toLowerCase()} val`}
                                    style={{fontSize:'18px'}}
                                >
                                    {risk.riskLevel}
                                </span>
                            </div>
                            <div className="stat-row">
                                <span className="key">Current Market Price</span>
                                <span className="val">Rs. {result.product?.currentPrice?.toFixed(2)}</span>
                            </div>
                            <div className="stat-row">
                                <span className="key">Suggested Quote Price</span>
                                <span className="val" style={{color:'#0f3460',fontSize:'16px'}}>
                                    Rs. {risk.suggestedQuotePrice?.toFixed(2)}
                                </span>
                            </div>
                            <div className="stat-row">
                                <span className="key">Safety Buffer</span>
                                <span className="val">{risk.bufferPercent}%</span>
                            </div>
                            <div className="stat-row">
                                <span className="key">Price Volatility</span>
                                <span className="val">{risk.volatilityPercent}%</span>
                            </div>
                            <div className="stat-row">
                                <span className="key">Est. Risk Over Period</span>
                                <span className="val">{risk.estimatedRiskOverPeriod}%</span>
                            </div>
                            <div className="stat-row">
                                <span className="key">Anomalies in History</span>
                                <span className="val">{risk.anomalyCount}</span>
                            </div>
                            <div className="stat-row">
                                <span className="key">Current Trend</span>
                                <span className="val">{risk.trendDirection}</span>
                            </div>

                            <div className={`alert ${risk.riskLevel === 'HIGH' ? 'alert-danger' : risk.riskLevel === 'MEDIUM' ? 'alert-warning' : 'alert-success'}`}
                                style={{marginTop:'16px'}}
                            >
                                <strong>Recommendation:</strong> {risk.recommendation}
                            </div>
                        </div>
                    ) : (
                        <div className="stats-box" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'200px'}}>
                            <p style={{color:'#718096',fontSize:'13px'}}>
                                Select a commodity and contract duration, then click Assess Risk
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuoteRisk;