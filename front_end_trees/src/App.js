import './App.css';
import Button from 'react-bootstrap/Button';
import CustomersViewer from './Components/CustomersViewer';
import OrdersViewer from './Components/OrdersViewer';
import Welcome from './Components/Welcome';
import Navigation from './Components/Navigation';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Route component={Navigation} />
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/Customers" component={CustomersViewer} />
          <Route path="/Orders" component={OrdersViewer} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
