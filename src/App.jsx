import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import PriceReview from './pages/PriceReview';
import QuoteRisk from './pages/QuoteRisk';
import LiveFeed from './pages/LiveFeed';
import './index.css';

function App(){
  return(
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Dashboard />} />                
        <Route path="/products/:id" element={<ProductDetail />} />                
        <Route path="/review" element={<PriceReview />} />                
        <Route path="/risk" element={<QuoteRisk />} />                
        <Route path="/feed" element={<LiveFeed />} />      
      </Routes>
    </BrowserRouter>
  );
}

export default App;