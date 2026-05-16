import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import InvoiceCreate from './pages/InvoiceCreate';
import InvoiceCorrect from './pages/InvoiceCorrect';
import Login from './pages/Login';
import Settings from './pages/Settings';
import ComingSoon from './pages/ComingSoon';
import SettingsTemplates from './pages/SettingsTemplates';
import SettingsAutomation from './pages/SettingsAutomation';
import SettingsPlan from './pages/SettingsPlan';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import ReportSales from './pages/ReportSales';
import ReportLedger from './pages/ReportLedger';
import ReportQuarterly from './pages/ReportQuarterly';
import ReportReplaced from './pages/ReportReplaced';
import ReportModified from './pages/ReportModified';
import ReportDeleted from './pages/ReportDeleted';
import ComplianceCenter from './pages/ComplianceCenter';
import DailyAggregate from './pages/DailyAggregate';
import ProductList from './pages/ProductList';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="invoices/new" element={<InvoiceCreate />} />
        <Route path="invoices/:id" element={<InvoiceDetail />} />
        <Route path="invoices/:id/correct" element={<InvoiceCorrect />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="products" element={<ProductList />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/sales" element={<ReportSales />} />
        <Route path="reports/ledger" element={<ReportLedger />} />
        <Route path="reports/quarterly" element={<ReportQuarterly />} />
        <Route path="reports/replaced" element={<ReportReplaced />} />
        <Route path="reports/modified" element={<ReportModified />} />
        <Route path="reports/deleted" element={<ReportDeleted />} />
        <Route path="compliance" element={<ComplianceCenter />} />
        <Route path="aggregate" element={<DailyAggregate />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/cert" element={<ComingSoon title="Chữ ký số" />} />
        <Route path="settings/templates" element={<SettingsTemplates />} />
        <Route path="settings/automation" element={<SettingsAutomation />} />
        <Route path="settings/plan" element={<SettingsPlan />} />
      </Route>
    </Routes>
  );
}
