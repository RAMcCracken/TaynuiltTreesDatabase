import './App.css';
import Button from 'react-bootstrap/Button';
import CustomersViewer from './Components/Customers/CustomersViewer';
import OrdersViewer from './Components/Orders/OrdersViewer';
import Welcome from './Components/Welcome';
import Navigation from './Components/Navigation';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CustomerCreator from './Components/Customers/CustomerCreator';
import CustomerEditor from './Components/Customers/CustomerEditor';
import OrderEditor from './Components/Orders/OrderEditor';
import OrderSummary from './Components/Orders/OrderSummary'
import QuoteViewer from './Components/Quotes/QuoteViewer';
import QuoteCreator from './Components/Quotes/QuoteCreator';
import QuoteEditor from './Components/Quotes/QuoteEditor';
import QuoteSummary from './Components/Quotes/QuoteSummary';
import InvoiceViewer from './Components/Invoices/InvoiceViewer';
import InvoiceCreator from './Components/Invoices/InvoiceCreator';
import InvoiceEditor from './Components/Invoices/InvoiceEditor';
import InvoiceSummary from './Components/Invoices/InvoiceSummary';
import DeliveryViewer from './Components/Deliveries/DeliveryViewer';
import DeliveryCreator from './Components/Deliveries/DeliveryCreator';
import DeliveryEditor from './Components/Deliveries/DeliveryEditor';

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Route component={Navigation} />
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route path="/Customers" component={CustomersViewer} />
            <Route path="/New-Customer" component={CustomerCreator} />
            <Route path="/Edit-Customer" component={CustomerEditor} />
            <Route exact path="/Orders" component={OrdersViewer} />
            <Route path="/Edit-Order" component={OrderEditor} />
            <Route path="/Orders/:id" component={OrderSummary} />
            <Route exact path="/Quotes" component={QuoteViewer} />
            <Route path="/New-Quote" component={QuoteCreator} />
            <Route path="/Edit-Quote" component={QuoteEditor} />
            <Route path="/Quotes/:id" component={QuoteSummary} />
            <Route exact path="/Invoices" component={InvoiceViewer} />
            <Route path="/New-Invoice" component={InvoiceCreator} />
            <Route path="/Edit-Invoice" component={InvoiceEditor} />
            <Route path="/Invoices/:id" component={InvoiceSummary} />
            <Route exact path="/Deliveries" component={DeliveryViewer} />
            <Route path="/New-Delivery" component={DeliveryCreator} />
            <Route path="/Edit-Delivery" component={DeliveryEditor} />
          </Switch>
        </div>

      </Router>
    </div>
  );
}

export default App;
