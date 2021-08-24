import './App.css';
import Button from 'react-bootstrap/Button';
import CustomersViewer from './Components/Customers/CustomersViewer';
import OrdersViewer from './Components/Orders/OrdersViewer';
import Welcome from './Components/Welcome';
import Navigation from './Components/Navigation';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CustomerCreator from './Components/Customers/CustomerCreator';
import CustomerEditor from './Components/Customers/CustomerEditor';
import OrderCreator from './Components/Orders/OrderCreator';
import OrderEditor from './Components/Orders/OrderEditor';
import OrderSummary from './Components/Orders/OrderSummary'

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
            <Route path="/New-Order" component={OrderCreator} />
            <Route path="/Edit-Order" component={OrderEditor} />
            <Route path="/Orders/:id" component={OrderSummary} />
          </Switch>
        </div>

      </Router>
    </div>
  );
}

export default App;
